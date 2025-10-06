const path = require('node:path');

const modeloPath = path.resolve(__dirname, '..', 'servidor', 'modelo.js');

const cargarSistema = () => {
  delete require.cache[modeloPath];
  const modulo = require(modeloPath);
  return {
    Sistema: modulo.Sistema,
    instancia: new modulo.Sistema(),
  };
};

describe('Sistema de usuarios (modelo)', () => {
  let sistema;

  beforeEach(() => {
    const contexto = cargarSistema();
    sistema = contexto.instancia;
  });

  describe('agregarUsuario', () => {
    it('crea un nuevo usuario con el nick indicado', () => {
      const respuesta = sistema.agregarUsuario('alice');

      expect(respuesta).toEqual({ nick: 'alice' });
      expect(sistema.numeroUsuarios().num).toBe(1);
    });

    it('normaliza el nick eliminando espacios y evita duplicados', () => {
      const primerIntento = sistema.agregarUsuario(' alice ');
      const duplicado = sistema.agregarUsuario('alice');

      expect(primerIntento.nick).toBe('alice');
      expect(duplicado.nick).toBe(-1);
      expect(sistema.numeroUsuarios().num).toBe(1);
    });

    it('rechaza nicks vacíos devolviendo -1', () => {
      const respuesta = sistema.agregarUsuario('   ');

      expect(respuesta.nick).toBe(-1);
      expect(sistema.numeroUsuarios().num).toBe(0);
    });
  });

  describe('obtenerUsuarios', () => {
    it('devuelve un diccionario con los usuarios agregados', () => {
      sistema.agregarUsuario('alice');
      sistema.agregarUsuario('bob');

      const usuarios = sistema.obtenerUsuarios();

      expect(Object.keys(usuarios)).toEqual(jasmine.arrayContaining(['alice', 'bob']));
      expect(usuarios.alice.nick).toBe('alice');
    });

    it('devuelve siempre el mismo contenedor de usuarios', () => {
      const usuariosAntes = sistema.obtenerUsuarios();
      usuariosAntes.prueba = { nick: 'temporal' };

      const usuariosDespues = sistema.obtenerUsuarios();

      expect(usuariosDespues.prueba.nick).toBe('temporal');
      delete usuariosDespues.prueba;
    });
  });

  describe('usuarioActivo', () => {
    it('indica verdadero cuando el usuario existe', () => {
      sistema.agregarUsuario('alice');

      const respuesta = sistema.usuarioActivo('alice');
      expect(respuesta).toEqual({ nick: 'alice', activo: true });
    });

    it('indica falso cuando el usuario no existe', () => {
      const respuesta = sistema.usuarioActivo('inexistente');
      expect(respuesta).toEqual({ nick: 'inexistente', activo: false });
    });
  });

  describe('eliminarUsuario', () => {
    it('elimina usuarios existentes devolviendo el nick', () => {
      sistema.agregarUsuario('alice');

      const resultado = sistema.eliminarUsuario('alice');

      expect(resultado).toEqual({ nick: 'alice' });
      expect(sistema.numeroUsuarios().num).toBe(0);
    });

    it('devuelve -1 cuando el usuario no existe', () => {
      const resultado = sistema.eliminarUsuario('inexistente');

      expect(resultado.nick).toBe(-1);
    });
  });

  describe('numeroUsuarios', () => {
    it('representa la cantidad actual de usuarios', () => {
      expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
      sistema.agregarUsuario('alice');
      expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
      sistema.agregarUsuario('bob');
      expect(sistema.numeroUsuarios()).toEqual({ num: 2 });
      sistema.eliminarUsuario('alice');
      expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    });
  });
});
