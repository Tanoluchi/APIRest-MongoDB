const express = require('express');
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

ruta.get('/', (req, res) => {
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
	let body = req.body;
	const {error, value} = schema.validate({name: body.name, email: body.email});

	if(!error){
		let result = crearUsuario(body);

		result.then(user => {
			res.json({
				valor: user
			})
		}).catch(err => {
			res.status(400).json({
				 error
			})
		});
	}else{
		res.status(400).json({
			error
		})
	}
});

// Actualización
ruta.put('/:email', (req, res) => {
	const {error, value} = schema.validate({name: req.body.name});

	if(!error){
		let result = actualizarUsuario(req.params.email, req.body);
		result.then(valor =>{
			res.json({
				valor
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

ruta.delete('/:email', (req, res) => {
	let result = desactivarUsuario(req.params.email);
	result.then(valor => {
		res.json({
			valor
		})
	}).catch(err => {
		res.status(400).json({
			err
		})
	});
});


async function listarUsuariosActivos(){
	let usuarios = await Usuario.find({"status": true});
	return usuarios;
}

async function crearUsuario(body){
	let usuario = new Usuario({
		email: body.email,
		name : body.name,
		password : body.password
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
