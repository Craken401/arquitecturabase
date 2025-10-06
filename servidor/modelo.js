function normalizarNick(nick) {
  return typeof nick === 'string' ? nick.trim() : '';
}

function Usuario(nick) {
  this.nick = nick;
}

function Sistema() {
  this.usuarios = {};

  this.agregarUsuario = function (nick) {
    const clave = normalizarNick(nick);
    const respuesta = { nick: -1 };

    if (clave && !Object.prototype.hasOwnProperty.call(this.usuarios, clave)) {
      this.usuarios[clave] = new Usuario(clave);
      respuesta.nick = clave;
    }

    return respuesta;
  };

  this.obtenerUsuarios = function () {
    return this.usuarios;
  };

  this.usuarioActivo = function (nick) {
    const clave = normalizarNick(nick);
    return {
      nick: clave,
      activo: Boolean(clave && Object.prototype.hasOwnProperty.call(this.usuarios, clave)),
    };
  };

  this.eliminarUsuario = function (nick) {
    const clave = normalizarNick(nick);
    const respuesta = { nick: -1 };

    if (clave && Object.prototype.hasOwnProperty.call(this.usuarios, clave)) {
      delete this.usuarios[clave];
      respuesta.nick = clave;
    }

    return respuesta;
  };

  this.numeroUsuarios = function () {
    return { num: Object.keys(this.usuarios).length };
  };
}

module.exports.Sistema = Sistema;
module.exports.Usuario = Usuario;
