const usuarios = require('./routes/usuarios');
const animes = require('./routes/animes');
const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');

// Conectando a BD
mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Conectado a la base de datos...'))
	.catch((err) => console.log('No se ha podido conectar a la base de datos...', err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios', usuarios);
app.use('/api/animes', animes);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('APIREST OK...');
})