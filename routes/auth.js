const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model.js');
const ruta = express.Router();

ruta.post('/', (req, res) => {
	Usuario.findOne({email: req.body.email})
		.then(datos => {
			if(datos) {
				// Validacion de contraseña
				const passwordValido = bcrypt.compareSync(req.body.password, datos.password);
				if(!passwordValido) return res.status(400).json({error:'ok', msj: 'Usuario o contraseña incorrecta'});
				// Creación del token
				const jwToken = jwt.sign({
					data: {_id: datos._id, name: datos.name, email: datos.email}
				}, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')});
				res.json({
					usuario: {
						_id: datos._id,
						name: datos.name,
						email: datos.email
					},
					jwToken
				});
			}else{
				res.status(400).json({
					error: 'ok',
					msj: 'Usuario o contraseña incorrecta'
				})
			}
		}).catch(err => {
			res.status(400).json({
				error: 'ok',
				msj: 'Error en el servicio' + err
			})
		})
});

module.exports = ruta;