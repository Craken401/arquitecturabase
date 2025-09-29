const path = require('node:path');

const modeloPath = path.resolve(__dirname, '..', 'cliente', 'modelo.js');

const cargarModelo = () => {
  delete require.cache[modeloPath];
  return require(modeloPath);
};

describe('Sistema de usuarios (modelo)', () => {
  let modelo;

  beforeEach(() => {
    modelo = cargarModelo();
  });

  describe('agregarUsuario', () => {
    it('crea un nuevo usuario con el nick indicado', () => {
      const usuario = modelo.agregarUsuario('alice');

      expect(usuario).toEqual(jasmine.any(modelo.Usuario));
      expect(usuario.nick).toBe('alice');
      expect(modelo.numeroUsuarios()).toBe(1);
    });

    it('normaliza el nick eliminando espacios y evita duplicados', () => {
      const primerUsuario = modelo.agregarUsuario(' alice ');
      const segundoUsuario = modelo.agregarUsuario('alice');

      expect(segundoUsuario).toBe(primerUsuario);
      expect(modelo.numeroUsuarios()).toBe(1);
    });

    it('lanza un error si el nick es vacío', () => {
      expect(() => modelo.agregarUsuario('')).toThrowError();
      expect(() => modelo.agregarUsuario('   ')).toThrowError();
    });
  });

  describe('obtenerUsuarios', () => {
    it('devuelve una lista con los usuarios agregados', () => {
      modelo.agregarUsuario('alice');
      modelo.agregarUsuario('bob');

      const usuarios = modelo.obtenerUsuarios();

      expect(usuarios.length).toBe(2);
      const nicks = usuarios.map((u) => u.nick);
      expect(nicks).toContain('alice');
      expect(nicks).toContain('bob');
    });

    it('devuelve una nueva lista para evitar mutaciones externas', () => {
      modelo.agregarUsuario('alice');

      const usuarios = modelo.obtenerUsuarios();
      usuarios.pop();

      expect(modelo.numeroUsuarios()).toBe(1);
    });
  });

  describe('usuarioActivo', () => {
    it('indica verdadero cuando el usuario existe', () => {
      modelo.agregarUsuario('alice');

      expect(modelo.usuarioActivo('alice')).toBeTrue();
    });

    it('indica falso cuando el usuario no existe', () => {
      expect(modelo.usuarioActivo('inexistente')).toBeFalse();
    });
  });

  describe('eliminarUsuario', () => {
    it('elimina usuarios existentes y devuelve verdadero', () => {
      modelo.agregarUsuario('alice');

      const resultado = modelo.eliminarUsuario('alice');

      expect(resultado).toBeTrue();
      expect(modelo.numeroUsuarios()).toBe(0);
    });

    it('devuelve falso cuando el usuario no existe', () => {
      const resultado = modelo.eliminarUsuario('inexistente');

      expect(resultado).toBeFalse();
    });
  });

  describe('numeroUsuarios', () => {
    it('representa la cantidad actual de usuarios', () => {
      expect(modelo.numeroUsuarios()).toBe(0);
      modelo.agregarUsuario('alice');
      expect(modelo.numeroUsuarios()).toBe(1);
      modelo.agregarUsuario('bob');
      expect(modelo.numeroUsuarios()).toBe(2);
      modelo.eliminarUsuario('alice');
      expect(modelo.numeroUsuarios()).toBe(1);
    });
  });
});
