import Datastore from "nedb";
import shortId from "shortid";
import moment from "moment";

import { FIELDS } from "./constants";

class DB {
	constructor() {
		this.db = new Datastore({
			filename: "../data/enquiries.bin",
			autoload: true
		});
	}
	generateId() {
		return shortId.generate().toUpperCase() + moment().format("YYYY");
	}
	save(record) {
		return new Promise((fulfill, reject) => {
			if(record.ref)
				reject("Duplicate record");
			else {
				record.ref = this.generateId();
				this.db.insert(record, (err, newdoc) => {
					if(!err)
						fulfill(newdoc);
					else
						reject("DB error: " + err);
				});
			}
		});
	}
	read(ref) {
		return new Promise((fulfill, reject) => {
			if(!ref) {
				this.db.find({}, (err, docs) => {
					if(!err) {
						docs = docs.map(d => {
							return FIELDS.reduce((o, field) => ({
								...o,
								[field]: d[field]
							}), {});
						});
						fulfill(docs);
					}
					else
						reject("DB error: " + err)
				});
			} else {
				this.db.findOne({ ref }, (err, doc) => {
					if(!err) {
						doc = FIELDS.reduce((o, field) => ({
							...o,
							[field]: doc[field]
						}), {});
						fulfill(doc);
					}
					else
						reject("DB error: " + err)
				});
			}
		});
	}
	update(record) {
		return new Promise((fulfill, reject) => {
			if(!record.ref)
				reject("Need ref to update record");
			else {
				this.db.update({ ref: record.ref }, record, {}, err => {
					if(!err)
						fulfill();
					else
						reject("DB error: " + err);
				});
			}
		});
	}
	delete(ref) {
		return new Promise((fulfill, reject) => {
			if(!ref)
				reject("Need ref to remove record");
			else {
				this.db.remove({ ref }, (err, numRemoved) => {
					if(!err)
						fulfill();
					else
						reject("DB error: " + err)
				});
			}
		});
	}
	merge(records) {
		return this.read()
			.then(existingRecords => new Promise((fulfill, reject) => {
			const newRecords = records
				.filter(r => !r.ref || !existingRecords.find(er => er.ref===r.ref))
				.map(r => ({ ...r, ref: r.ref || this.generateId() }));
			this.db.insert(newRecords, (err, newdocs) => {
				if(!err) {
					fulfill([existingRecords, newdocs]);
				} else {
					reject("DB error: " + err);
				}
			});
		}))
		.then(prevResult => new Promise((fulfill, reject) => {
			const existingRecords = prevResult[0];
			const newRecords = prevResult[1];
			const updatedRecords = records
				.filter(r => r.ref && existingRecords.find(er => er.ref===r.ref))
			const allUpdates = updatedRecords.map(ur => {
				return new Promise((f, r) => {
					this.db.update({ ref: ur.ref }, ur, {}, (err, numUpdated) => {
						if(!err)
							f();
					});
				});
			});
			Promise.all(allUpdates).then(() => {
				fulfill([ newRecords.length, updatedRecords.length ]);
			}, err => {
				reject("DB error: " + err.join("; "));
			});
		}));
	}
}

const enquiriesDB = new DB();

export default enquiriesDB;
