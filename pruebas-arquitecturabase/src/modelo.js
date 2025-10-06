function Usuario(nick) {
  this.nick = nick;
}

function Sistema() {
  this.usuarios = {};

  this.agregarUsuario = function (nick) {
    if (nick && !this.usuarios[nick]) {
      this.usuarios[nick] = new Usuario(nick);
    }
  };

  this.obtenerUsuarios = function () {
    return this.usuarios;
  };

  this.usuarioActivo = function (nick) {
    return Boolean(nick && this.usuarios[nick]);
  };

  this.eliminarUsuario = function (nick) {
    if (nick && this.usuarios[nick]) {
      delete this.usuarios[nick];
    }
  };

  this.numeroUsuarios = function () {
    return Object.keys(this.usuarios).length;
  };
}
