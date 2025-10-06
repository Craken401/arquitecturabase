describe('Sistema de usuarios (standalone)', function () {
  let sistema;

  beforeEach(function () {
    sistema = new Sistema();
  });

  it('inicialmente no hay usuarios', function () {
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('agrega un usuario nuevo', function () {
    sistema.agregarUsuario('alice');
    expect(sistema.numeroUsuarios()).toEqual(1);
    expect(sistema.obtenerUsuarios().alice.nick).toEqual('alice');
  });

  it('no duplica usuarios con el mismo nick', function () {
    sistema.agregarUsuario('alice');
    sistema.agregarUsuario('alice');
    expect(sistema.numeroUsuarios()).toEqual(1);
  });

  it('marca un usuario existente como activo', function () {
    sistema.agregarUsuario('alice');
    expect(sistema.usuarioActivo('alice')).toBeTrue();
  });

  it('indica falso para un usuario inexistente', function () {
    expect(sistema.usuarioActivo('bob')).toBeFalse();
  });

  it('elimina usuarios registrados', function () {
    sistema.agregarUsuario('alice');
    sistema.eliminarUsuario('alice');
    expect(sistema.usuarioActivo('alice')).toBeFalse();
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('devuelve la colección de usuarios', function () {
    sistema.agregarUsuario('alice');
    sistema.agregarUsuario('bob');
    const usuarios = sistema.obtenerUsuarios();
    expect(Object.keys(usuarios)).toEqual(jasmine.arrayContaining(['alice', 'bob']));
  });
});
