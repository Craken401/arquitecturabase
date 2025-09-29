(function (global, $) {
  if (!$) {
    throw new Error('ClienteRest requiere jQuery cargado en la página.');
  }

  const BASE_URL = '';

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
      return request({ url: destino });
    },
    obtenerUsuarios() {
      return request({ url: '/obtenerUsuarios' });
    },
    numeroUsuarios() {
      return request({ url: '/numeroUsuarios' });
    },
    usuarioActivo(nick) {
      const destino = `/usuarioActivo/${encodeURIComponent(nick)}`;
      return request({ url: destino });
    },
    eliminarUsuario(nick) {
      const destino = `/eliminarUsuario/${encodeURIComponent(nick)}`;
      return request({ url: destino, method: 'DELETE' });
    },
  };

  global.ClienteRest = ClienteRest;
})(window, window.jQuery);
