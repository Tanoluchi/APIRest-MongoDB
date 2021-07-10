const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	date: {
		type: String,
		default: Date.now
	},
	score: {
		type: Number,
		default: 0
	},
	status: {
		type: Boolean,
		default: true
	},
	img: {
		type: String,
		required: false
	}
});

module.exports = mongoose.model('Anime', animeSchema);