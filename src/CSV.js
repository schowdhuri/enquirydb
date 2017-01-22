import { parse, stringify } from "csv";
import { FIELDS, READABLE_FIELDS } from "./constants";
import db from "./DB";

let isElectron = false;
let fs, dialog;

if(window.require) {
	isElectron = true;
	fs = window.require("fs");
	dialog = window.require("electron").remote.dialog;
	// ^ https://github.com/electron/electron/issues/7300
}

export function exportCSV() {
	if(!isElectron) {
		return Promise.reject("Electron not found");
	}
	return new Promise((fulfill, reject) => {
		db.read().then(records => {
			stringify(records, function(err, output){
				output = READABLE_FIELDS.join(",") + "\n" + output;
				dialog.showSaveDialog(
					{
						properties: ["openFile"],
						filters: [{
							name: "Comma-separated value (CSV)",
							extensions: ["csv"]
						}]
					}, function (fileName, content) {
						if (!fileName){
							reject("Save cancelled");
						} else {
							fs.writeFile(fileName, output, function (err) {
								if(err)
									reject("An error ocurred creating the file "+ err.message)
								else
									fulfill();
							});
						}
					}
				);
			});
		});
	});
}

export function importCSV() {
	if(!isElectron) {
		return Promise.reject("Electron not found");
	}
	return new Promise((fulfill, reject) => {
		dialog.showOpenDialog(
			{
				properties: ["openFile"],
				filters: [{
					name: "Comma-separated value (CSV)",
					extensions: ["csv"]
				}]
			}, function (fileName, content) {
				if (!fileName || !fileName[0]){
					reject("Import cancelled");
					return;
				}
				fileName = fileName[0];
				fs.readFile(fileName, "utf-8", function (err, data) {
					if(err) {
						reject("An error ocurred reading the file "+ err.message);
						return;
					}
					parse(data, {}, function(err, output) {
						if(err) {
							reject("Invalid data in import file. " + err);
							return;
						}
						const records = output.slice(1).map(row => 
							FIELDS.reduce((o, field, index) => ({
								...o,
								[field]: row[index]
							}), {})
						);
						db.merge(records).then(fulfill, reject);
					});
				});
			}
		);
	});
}
