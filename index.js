"use strict";
//requiring modules and medels
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = 8888;

//runs express every time app is called
var app = express();

//Need this to run bodyParser
app.use(bodyParser.json());

//Require models.  These are Constuctors 
var Artist = require('./lib/models/artist')
var Song = require('./lib/models/song')
var Tag = require('./lib/models/tag')

//Connecting the Servers and MongoDB
mongoose.connect('mongodb://localhost/myMusic');

var connection = mongoose.connection;
connection.once('open', function(){
	console.log('Successfully connected')
});


//
//Create the endpoints
//
//GET all Artists
app.get('/artists', function(req, res){
	Artist.find().exec(function(err, artists){
		res.status(200).send(artists);
	});
});

//POST an artist
app.post('/artists', function(req, res){
	//body ~ bodyParser
	if(req.body.artist){
		var newArtist = new Artist(req.body.artist);
		//.save ~ mongoose
		newArtist.save(function(err, result){
			//Handle the err
			if(err){
				res.status(400).send('Artist not saved try again')
			} else {
				//.exec & .find ~ mongoose
				//query defined by arguments to .find 
				//.exec tells mongoose you are done configuring the query and mongoose issues the DB command
				Artist.find().exec(function(error, artists){
					if(!error){
						res.status(200).send(artists);		
					}
				});
				//Other option would be to just res.status(200).send(result); instead of the Artist.find()...
			}
		});
	} else {
		res.status(400).send('Please define an artist');
	}
});

//GET artists by Id
app.get('/artists/:artistId', function(req, res){
	Artist.findOne({_id: req.params.artistId}).populate('songs').exec(function(err, artist){
		res.status(200).send(artist)
	});		
});

app.get('/artists/:artistId/songs', function(req, res){
	Artist.findOne({_id: req.params.artistId}).populate('songs').exec(function(err, artist){
		//.populate is used when you are ref: another object.  So it will show you the keys and values
		//.findOne will return the first it finds in the database
		res.status(200).send(artist)
	});		
});


app.post('/artists/:artistId/songs', function(req, res){
	Artist.findOne({_id: req.params.artistId}).populate('songs').exec(function(err, artist){
		var newSong = new Song(req.body.song);
		newSong.save(function(err, song){
			artist.songs.push(song);
			artist.save(function(err){
				if(!err){
					res.status(200).send(song.name + " successfully added to " +  artist.name);	
				} else {
					res.status(400).send(song.name + " was not added to " +  artist.name);	
				}
			});
			
		});
	});		
});


app.get('/song/:songId', function(req, res){
	Song.findOne({_id: req.params.songId}).populate('tags').exec(function(err, song){
		if(!err){
			res.status(200).send(song);
		} else {
			res.status(404).send('song not found');
		}
	});
})

app.post('/song/:songId/tags', function(req, res){
	Tag.findOneAndUpdate({ name: req.body.name}, req.body, {upsert: true}).exec(function(err, tag){
		Song.findOne({_id: req.params.songId}).populate('tags').exec(function(err, song){
			song.tags.push(tag);
			song.save(function(err, song){
				if(err){
					res.status(400).send(err)
				} else {
					res.status(200).send(tag.name + ' added to ' + song.name)
				}
			})
		})
	})
});


app.listen(port, function(){
	console.log('We are listening on ' + port);
});








