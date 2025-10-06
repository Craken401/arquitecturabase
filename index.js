const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Sistema } = require('./servidor/modelo.js');

const app = express();
const PORT = process.env.PORT || 3000;

const sistema = new Sistema();
app.use(express.json());
app.use(express.static(__dirname + '/'));

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
	const contenido = fs.readFileSync(path.join(__dirname, 'cliente', 'index.html'));
	res.setHeader('Content-type', 'text/html');
	res.send(contenido);
});

if (require.main === module) {
	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.log(`Servidor escuchando en http://localhost:${PORT}`);
	});
}

module.exports = { app, PORT };
