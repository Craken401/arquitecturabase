(function (global) {
  class Usuario {
    constructor(nick) {
      if (typeof nick !== 'string' || nick.trim().length === 0) {
        throw new Error('El nick del usuario es obligatorio');
      }
      this.nick = nick.trim();
    }
  }

  const usuarios = new Map();

  function agregarUsuario(nick) {
    const usuario = new Usuario(nick);
    if (!usuarios.has(usuario.nick)) {
      usuarios.set(usuario.nick, usuario);
    }
    return usuarios.get(usuario.nick);
  }

  function obtenerUsuarios() {
    return Array.from(usuarios.values());
  }

  function usuarioActivo(nick) {
    if (typeof nick !== 'string') {
      return false;
    }
    return usuarios.has(nick.trim());
  }

  function eliminarUsuario(nick) {
    if (typeof nick !== 'string') {
      return false;
    }
    const clave = nick.trim();
    if (!usuarios.has(clave)) {
      return false;
    }
    usuarios.delete(clave);
    return true;
  }

  function numeroUsuarios() {
    return usuarios.size;
  }

  const api = {
    Usuario,
    agregarUsuario,
    obtenerUsuarios,
    usuarioActivo,
    eliminarUsuario,
    numeroUsuarios,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (global && typeof global === 'object') {
    global.SistemaUsuarios = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
