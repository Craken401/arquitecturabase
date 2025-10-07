const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Sistema } = require('./servidor/modelo.js');

const app = express();
const PORT = process.env.PORT || 3000;

const sistema = new Sistema();
app.use(express.json());

const CLIENT_DIR = path.join(__dirname, 'cliente');
const CLIENT_DIST_DIR = path.join(CLIENT_DIR, 'dist');

if (fs.existsSync(CLIENT_DIST_DIR)) {
	app.use(express.static(CLIENT_DIST_DIR));
}

app.use('/cliente', express.static(CLIENT_DIR));
app.use(express.static(__dirname));

app.get('/hola', (_req, res) => {
	res.json({ mensaje: 'Hola Mundo' });
});

app.get('/agregarUsuario/:nick', (req, res) => {
	const nick = String((req.params.nick || '').trim());
	const resultado = sistema.agregarUsuario(nick);
	res.json(resultado);
});

app.get('/obtenerUsuarios', (_req, res) => {
	res.json(sistema.obtenerUsuarios());
});

app.get('/usuarioActivo/:nick', (req, res) => {
	const nick = String((req.params.nick || '').trim());
	res.json({ activo: sistema.usuarioActivo(nick) });
});

app.get('/numeroUsuarios', (_req, res) => {
	res.json({ num: sistema.numeroUsuarios() });
});

app.delete('/eliminarUsuario/:nick', (req, res) => {
	const nick = String((req.params.nick || '').trim());
	res.json(sistema.eliminarUsuario(nick));
});

app.get('/', (_req, res) => {
	const baseDir = fs.existsSync(path.join(CLIENT_DIST_DIR, 'index.html'))
		? CLIENT_DIST_DIR
		: CLIENT_DIR;
	res.sendFile(path.join(baseDir, 'index.html'));
});

if (require.main === module) {
	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.log(`Servidor en ${PORT}`);
	});
}

module.exports = { app, PORT };
