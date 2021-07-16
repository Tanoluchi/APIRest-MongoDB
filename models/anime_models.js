const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
moment.locale('es');

const autorSchema = new mongoose.Schema({
	name: String,
	email: String
})

const animeSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	autor: autorSchema,
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
		default: moment()
	},
	like: {
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