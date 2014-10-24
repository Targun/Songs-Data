"user strict";

var Mongoose = require('mongoose'),
	Schema = Mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	//ObjectId is used for refing other object by there Id
	Moment = require('moment');

var song = new Schema({
	name: { type: String, require: true, uniqueness: true },
	album: { type: String },
	genres: [{ type: String }],
	releasedOn: { type: Date, max: Moment().utc().toDate() },
	explicit: { type: Boolean, required: true},

	artist: [{ type: ObjectId, ref: 'Artist' }],
	tags: [{ type: ObjectId, ref: 'Tag' }],
	//referencing the Tags and Artist
});

module.exports = Mongoose.model('Song', song);
//Song is the name of the collection, and Son is the refrence to the variable