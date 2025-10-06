describe('Sistema de usuarios (standalone)', function () {
  let sistema;

  beforeEach(function () {
    sistema = new Sistema();
  });

  it('inicialmente no hay usuarios', function () {
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('agrega un usuario nuevo', function () {
    const respuesta = sistema.agregarUsuario('alice');

    expect(respuesta).toEqual({ nick: 'alice' });
    expect(sistema.numeroUsuarios()).toEqual(1);
    expect(sistema.obtenerUsuarios().alice.nick).toEqual('alice');
  });

  it('no duplica usuarios con el mismo nick', function () {
    sistema.agregarUsuario('alice');
    const duplicado = sistema.agregarUsuario('alice');

    expect(duplicado).toEqual({ nick: -1 });
    expect(sistema.numeroUsuarios()).toEqual(1);
  });

  it('rechaza nicks vacíos', function () {
    const respuesta = sistema.agregarUsuario('   ');

    expect(respuesta).toEqual({ nick: -1 });
    expect(sistema.numeroUsuarios()).toEqual(0);
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
    const resultado = sistema.eliminarUsuario('alice');

    expect(resultado).toEqual({ ok: true });
    expect(sistema.usuarioActivo('alice')).toBeFalse();
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('gestiona la eliminación de usuarios inexistentes', function () {
    const resultado = sistema.eliminarUsuario('alice');

    expect(resultado).toEqual({ ok: false });
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('devuelve la colección de usuarios', function () {
    sistema.agregarUsuario('alice');
    sistema.agregarUsuario('bob');
    const usuarios = sistema.obtenerUsuarios();
    expect(Object.keys(usuarios)).toEqual(jasmine.arrayContaining(['alice', 'bob']));
  });
});
