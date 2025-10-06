const path = require('node:path');
const request = require('supertest');

const modeloPath = path.resolve(__dirname, '..', 'servidor', 'modelo.js');
const servidorPath = path.resolve(__dirname, '..', 'index.js');

const cargarAplicacion = () => {
  delete require.cache[modeloPath];
  delete require.cache[servidorPath];
  // Requerimos el servidor después de limpiar el cache para arrancar con estado limpio
  const servidor = require(servidorPath);
  return servidor.app;
};

describe('API REST de usuarios', () => {
  let app;

  beforeEach(() => {
    app = cargarAplicacion();
  });

  it('responde "Hola Mundo" en /hola', async () => {
    const respuesta = await request(app).get('/hola');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ mensaje: 'Hola Mundo' });
  });

  it('permite agregar usuarios y obtener el listado', async () => {
    let respuesta = await request(app).get('/obtenerUsuarios');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({});

    respuesta = await request(app).get('/agregarUsuario/alice');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.nick).toBe('alice');

    respuesta = await request(app).get('/agregarUsuario/bob');
    expect(respuesta.status).toBe(200);

    respuesta = await request(app).get('/obtenerUsuarios');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.alice.nick).toBe('alice');
    expect(respuesta.body.bob.nick).toBe('bob');
  });

  it('no agrega usuarios duplicados', async () => {
    const primeraRespuesta = await request(app).get('/agregarUsuario/alice');
    const segundaRespuesta = await request(app).get('/agregarUsuario/alice');

    expect(primeraRespuesta.status).toBe(200);
    expect(segundaRespuesta.status).toBe(200);
    expect(segundaRespuesta.body.nick).toBe(-1);

    const respuestaNumero = await request(app).get('/numeroUsuarios');
    expect(respuestaNumero.body.num).toBe(1);
  });

  it('valida el nick del usuario en la API', async () => {
    const respuesta = await request(app).get('/agregarUsuario/%20%20');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.nick).toBe(-1);
  });

  it('permite comprobar si un usuario está activo', async () => {
    await request(app).get('/agregarUsuario/alice');

    const respuestaActivo = await request(app).get('/usuarioActivo/alice');
    expect(respuestaActivo.status).toBe(200);
    expect(respuestaActivo.body).toEqual({ activo: true });

    const respuestaInactivo = await request(app).get('/usuarioActivo/bob');
    expect(respuestaInactivo.status).toBe(200);
    expect(respuestaInactivo.body).toEqual({ activo: false });
  });

  it('elimina usuarios mediante DELETE', async () => {
    await request(app).get('/agregarUsuario/alice');

    const respuestaEliminar = await request(app).delete('/eliminarUsuario/alice');
    expect(respuestaEliminar.status).toBe(200);
    expect(respuestaEliminar.body).toEqual({ ok: true });

    const respuestaNumero = await request(app).get('/numeroUsuarios');
    expect(respuestaNumero.body.num).toBe(0);

    const respuestaEliminarInexistente = await request(app).delete('/eliminarUsuario/alice');
    expect(respuestaEliminarInexistente.status).toBe(200);
    expect(respuestaEliminarInexistente.body).toEqual({ ok: false });
  });
});
