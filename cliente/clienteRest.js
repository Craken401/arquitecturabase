(function (global, $) {
  if (!$) {
    throw new Error('ClienteRest requiere jQuery cargado en la página.');
  }

  const BASE_URL = '';

  const log = (...args) => {
    // eslint-disable-next-line no-console
    console.log('[ClienteRest]', ...args);
  };

  const request = ({ method = 'GET', url }) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        method,
        url: `${BASE_URL}${url}`,
        dataType: 'json',
        success: (data) => resolve(data),
        error: (jqXHR) => {
          const respuesta = jqXHR.responseJSON || {};
          const mensaje = respuesta.mensaje || jqXHR.statusText || 'Error desconocido';
          reject(new Error(mensaje));
        },
      });
    });
  };

  const ClienteRest = {
    agregarUsuario(nick) {
      const destino = `/agregarUsuario/${encodeURIComponent(nick)}`;
      return request({ url: destino }).then((data) => {
        if (!data || data.nick === -1) {
          log(`El nick "${nick}" ya está en uso o no es válido.`);
          throw new Error('El nick ya está en uso o no es válido.');
        }
        log(`Usuario ${data.nick} ha sido registrado`);
        return data;
      });
    },
    agregarUsuario2(nick) {
      const destino = `/agregarUsuario/${encodeURIComponent(nick)}`;
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'GET',
          url: `${BASE_URL}${destino}`,
          dataType: 'json',
          success(data) {
            if (data.nick !== -1) {
              log(`Usuario ${data.nick} ha sido registrado (vía $.ajax)`);
            } else {
              log('El nick ya está ocupado');
            }
            resolve(data);
          },
          error(xhr, textStatus, errorThrown) {
            log(`Status: ${textStatus}`);
            log(`Error: ${errorThrown}`);
            reject(new Error(errorThrown || textStatus));
          },
          contentType: 'application/json',
        });
      });
    },
    obtenerUsuarios() {
      return request({ url: '/obtenerUsuarios' }).then((data) => {
        if (!data) {
          log('No se recibieron usuarios');
          return [];
        }
        const usuarios = Object.values(data).map((usuario) => ({ nick: usuario.nick }));
        log('Listado de usuarios', usuarios);
        return usuarios;
      });
    },
    numeroUsuarios() {
      return request({ url: '/numeroUsuarios' }).then((data) => {
        const valor = data && typeof data.num === 'number' ? data.num : 0;
        log('Número de usuarios', valor);
        return { num: valor };
      });
    },
    usuarioActivo(nick) {
      const clave = typeof nick === 'string' ? nick.trim() : '';
      const destino = `/usuarioActivo/${encodeURIComponent(clave)}`;
      return request({ url: destino }).then((data) => {
        const activo = Boolean(data && data.activo);
        const respuesta = { nick: clave, activo };
        log(`Usuario ${respuesta.nick} está ${respuesta.activo ? 'activo' : 'inactivo'}`);
        return respuesta;
      });
    },
    eliminarUsuario(nick) {
      const clave = typeof nick === 'string' ? nick.trim() : '';
      const destino = `/eliminarUsuario/${encodeURIComponent(clave)}`;

      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'DELETE',
          url: `${BASE_URL}${destino}`,
          dataType: 'json',
          success(data) {
            const ok = Boolean(data && data.ok);
            if (!ok) {
              reject(new Error(`No existe un usuario con nick "${clave}".`));
              return;
            }
            log(`Usuario ${clave} eliminado del sistema`);
            resolve({ ok: true, nick: clave });
          },
          error(xhr, textStatus, errorThrown) {
            log(`Status: ${textStatus}`);
            log(`Error: ${errorThrown}`);
            reject(new Error(errorThrown || textStatus));
          },
          contentType: 'application/json',
        });
      });
    },
  };

  global.ClienteRest = ClienteRest;
})(window, window.jQuery);
