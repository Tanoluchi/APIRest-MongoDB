const express = require('express');
const ruta = express.Router();
const Anime = require('../models/anime_models');
const verificarToken = require('../middlewares/authToken');
const moment = require('moment');
moment.locale('es');
const formato = 'LL';

ruta.get('/', verificarToken, (req, res) => {
	let result = listarAnimesActivos();

	result.then(anime => {
		res.json(anime)
	}).catch(error => {
		res.status(400).json({
			error
		})
	});
});

ruta.post('/', verificarToken, (req, res) =>{
	let result = crearAnime(req);

	result.then(anime => {
		res.json(anime)
	}).catch(error => {
		res.status(400).json(error)
	});
});

ruta.put('/:id', verificarToken, (req, res) =>{
	let result = actualizarAnime(req.params.id, req.body);

	result.then(anime => {
		res.json(anime)
	}).catch(error => {
		res.status(400).json(error)
	});
});

ruta.delete('/:id', verificarToken, (req, res) => {
	let result = desactivarAnime(req.params.id);

	result.then(anime => {
		res.json(anime)
	}).catch(error => {
		res.status(400).json(error)
	});
});

async function crearAnime(req){
	const newDate = moment(req.body.date)
	let anime = new Anime({
		title : req.body.title,
		autor : req.usuario,
		description : req.body.description,
		gender : req.body.gender,
		date : newDate.format(formato),
		like : req.body.like
	});
	return await anime.save();
}

async function actualizarAnime(id, body){
	const newDate = moment(body.date);

	let anime = await Anime.findByIdAndUpdate(id, {
		$set: {
			title : body.title,
			description : body.description,
			gender : body.gender,
			date : newDate.format(formato),
			like : body.like
		}
	}, {new: true});
	return anime;
}

async function desactivarAnime(id){
	let anime = await Anime.findByIdAndUpdate(id, {
		$set: {
			status: false
		}
	}, {new: true});
	return anime;
}

async function listarAnimesActivos(){
	let anime = await Anime
		.find({"status": true});
	return anime;
}

module.exports = ruta;