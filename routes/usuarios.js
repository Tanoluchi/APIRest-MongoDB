const express = require('express');
const verificarToken = require('../middlewares/authToken');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const Usuario = require('../models/usuario_model.js');
const ruta = express.Router();

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		
	email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

ruta.get('/', verificarToken, (req, res) => {
	let result = listarUsuariosActivos();
	result.then(usuarios => {
		res.json(usuarios)
	}).catch(err => {
		res.status(400).json({
			err
		})
	});
});

// Creación
ruta.post('/', (req, res) => {
	const body = req.body;

	Usuario.findOne({email: body.email}, (err, user) => {
		if(err) return res.status(400).json({error: 'Server ERROR'});
		// El usuario ya existe
		if(user) return res.status(400).json({msj:'El usuario ya existe'});
	});

	const {error, value} = schema.validate({name: body.name, email: body.email});
	if(!error){
		let result = crearUsuario(body);

		result.then(user => {
			res.json({
				name: user.name,
				email: user.email
			})
		}).catch(error => {
			res.status(400).json({
				 error
			})
		});
	}else{
		res.status(400).json({
			error
		});
	}
});

// Actualización
ruta.put('/:email', verificarToken, (req, res) => {
	const {error, value} = schema.validate({name: req.body.name});

	if(!error){
		let result = actualizarUsuario(req.params.email, req.body);
		result.then(valor =>{
			res.json({
				name: valor.name,
				email: valor.email
			})
		}).catch(err => {
			res.status(400).json({
				err
			})
		});
	}else{
		res.status(400).json({
			error
		})
	}
});

ruta.delete('/:email', verificarToken, (req, res) => {
	let result = desactivarUsuario(req.params.email);
	result.then(valor => {
		res.json({
			name: valor.name,
			email: valor.email
		})
	}).catch(error => {
		res.status(400).json({
			error
		})
	});
});


async function listarUsuariosActivos(){
	let usuarios = await Usuario.find({"status": true})
	.select({nombre: 1, email: 1});
	return usuarios;
}

async function crearUsuario(body){
	let usuario = new Usuario({
		email: body.email,
		name : body.name,
		password : bcrypt.hashSync(body.password, 10) 
	});
	return await usuario.save();
}

async function actualizarUsuario(email, body){
	let usuario = await Usuario.findOneAndUpdate({"email": email}, {
		$set: {
			name : body.name,
			password : body.password
		}
	}, {new: true});
	return usuario;
}
async function desactivarUsuario(email){
	let usuario = await Usuario.findOneAndUpdate({"email": email}, {
		$set: {
			status: false
		}
	}, {new: true});
	return usuario;
}

module.exports = ruta
