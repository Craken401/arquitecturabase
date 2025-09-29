const path = require('node:path');
const express = require('express');
const modelo = require('./cliente/modelo.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'cliente')));

app.get('/hola', (_req, res) => {
	res.json({ mensaje: 'Hola Mundo' });
});

app.get('/agregarUsuario/:nick', (req, res) => {
	try {
		const usuario = modelo.agregarUsuario(req.params.nick);
		res.json({ ok: true, usuario: { nick: usuario.nick } });
	} catch (error) {
		res.status(400).json({ ok: false, mensaje: error.message });
	}
});

app.get('/obtenerUsuarios', (_req, res) => {
	const usuarios = modelo.obtenerUsuarios().map((usuario) => ({ nick: usuario.nick }));
	res.json({ ok: true, usuarios });
});

app.get('/usuarioActivo/:nick', (req, res) => {
	const activo = modelo.usuarioActivo(req.params.nick);
	res.json({ ok: true, nick: req.params.nick, activo });
});

app.get('/numeroUsuarios', (_req, res) => {
	res.json({ ok: true, total: modelo.numeroUsuarios() });
});

app.delete('/eliminarUsuario/:nick', (req, res) => {
	const eliminado = modelo.eliminarUsuario(req.params.nick);
	if (!eliminado) {
		res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado', nick: req.params.nick });
		return;
	}

	res.json({ ok: true, nick: req.params.nick });
});

app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, 'cliente', 'index.html'));
});

if (require.main === module) {
	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.log(`Servidor escuchando en http://localhost:${PORT}`);
	});
}

module.exports = { app, PORT };
