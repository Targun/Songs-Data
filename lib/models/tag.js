"user strict";

var Mongoose = require('mongoose'),
	Schema = Mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;
	//ObjectId is used for refing other object by there Id

var tag = new Schema({
	name: { type: String, require: true, uniqueness: true },
	songs: [{type: ObjectId, ref: 'Song'}]
	//referencing the song
});

module.exports = Mongoose.model('Tag', tag);
//Tag is the name of the collection, and tag is the refrence to the variable