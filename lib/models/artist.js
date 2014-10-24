"user strict";

var Mongoose = require('mongoose'),
	Schema = Mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	//ObjectId is used for refing other object by there Id
	moment = require('moment');

var artist = new Schema({
	name: { type: String, require: true, uniqueness: true },
	bio: { type: String },
	birthday: {type: Date, max: moment().utc().toDate()},
	genres: [{ type: String }],

	songs: [{type: ObjectId, ref: 'Song'}]
	//referencing the song
});

module.exports = Mongoose.model('Artist', artist);
//Artist is the name of the collection, and artist is the refrence to the variable