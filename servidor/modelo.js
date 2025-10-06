function normalizarNick(nick) {
  return typeof nick === 'string' ? nick.trim() : '';
}

function Usuario(nick) {
  this.nick = nick;
}

function Sistema() {
  this.usuarios = {};

  this.agregarUsuario = (nick) => {
    const clave = normalizarNick(nick);

    if (!clave || Object.prototype.hasOwnProperty.call(this.usuarios, clave)) {
      return { nick: -1 };
    }

    this.usuarios[clave] = new Usuario(clave);
    return { nick: clave };
  };

  this.obtenerUsuarios = () => this.usuarios;

  this.usuarioActivo = (nick) => {
    const clave = normalizarNick(nick);
    return Boolean(clave && Object.prototype.hasOwnProperty.call(this.usuarios, clave));
  };

  this.eliminarUsuario = (nick) => {
    const clave = normalizarNick(nick);

    if (!clave || !Object.prototype.hasOwnProperty.call(this.usuarios, clave)) {
      return { ok: false };
    }

    delete this.usuarios[clave];
    return { ok: true };
  };

  this.numeroUsuarios = () => Object.keys(this.usuarios).length;
}

module.exports.Sistema = Sistema;
module.exports.Usuario = Usuario;
