(function (global) {
  const { ClienteRest } = global;

  if (!ClienteRest) {
    throw new Error('ControlWeb requiere que ClienteRest esté disponible en la ventana global.');
  }

  const crearElemento = (tag, { clases = '', texto = '', atributos = {} } = {}) => {
    const elemento = document.createElement(tag);

    if (clases) {
      elemento.className = clases;
    }

    if (texto) {
      elemento.textContent = texto;
    }

    Object.entries(atributos).forEach(([clave, valor]) => {
      elemento.setAttribute(clave, valor);
    });

    return elemento;
  };

  const ControlWeb = {
    inicio() {
      this.root = document.getElementById('app');
      if (!this.root) {
        // eslint-disable-next-line no-console
        console.warn('No se encontró el contenedor #app para inicializar ControlWeb.');
        return;
      }

      this.root.innerHTML = '';

  this.alertPlaceholder = crearElemento('div', { clases: 'col-12 mb-3' });
  const layout = crearElemento('div', { clases: 'row' });
      this.root.appendChild(layout);

      layout.appendChild(this.alertPlaceholder);

      this.colFormulario = crearElemento('div', { clases: 'col-lg-5' });
      this.colEstado = crearElemento('div', { clases: 'col-lg-7' });

      layout.appendChild(this.colFormulario);
      layout.appendChild(this.colEstado);

      this.mostrarAgregarUsuario();
      this.mostrarPanelUsuarios();
      this.mostrarPanelConsultas();

      this.actualizarPanelUsuarios();
    },

    mostrarAgregarUsuario() {
      const card = crearElemento('div', { clases: 'card shadow-sm' });
      const cardBody = crearElemento('div', { clases: 'card-body' });
      card.appendChild(cardBody);

      cardBody.appendChild(crearElemento('h5', { clases: 'card-title', texto: 'Agregar usuario' }));
      cardBody.appendChild(
        crearElemento('p', {
          clases: 'card-text text-muted',
          texto: 'Registra un nuevo usuario en el sistema utilizando el backend REST.',
        }),
      );

  const form = crearElemento('form', { clases: 'd-flex flex-column' });
  const grupoNick = crearElemento('div', { clases: 'form-group' });
      const etiqueta = crearElemento('label', {
        clases: 'font-weight-bold',
        texto: 'Nick del usuario',
        atributos: { for: 'nick-agregar' },
      });
      const input = crearElemento('input', {
        clases: 'form-control',
        atributos: {
          id: 'nick-agregar',
          type: 'text',
          placeholder: 'Ingresa un nick',
          required: 'required',
          minlength: '1',
        },
      });

      grupoNick.appendChild(etiqueta);
      grupoNick.appendChild(input);
      form.appendChild(grupoNick);

      const botones = crearElemento('div', { clases: 'd-flex flex-wrap' });
      const btnAgregar = crearElemento('button', {
        clases: 'btn btn-primary',
        texto: 'Agregar usuario',
        atributos: { type: 'submit' },
      });

      const btnEliminar = crearElemento('button', {
        clases: 'btn btn-outline-danger',
        texto: 'Eliminar usuario',
        atributos: { type: 'button' },
      });

      btnAgregar.classList.add('mr-2', 'mb-2');
      btnEliminar.classList.add('mb-2');

      botones.appendChild(btnAgregar);
      botones.appendChild(btnEliminar);
      form.appendChild(botones);

      form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const nick = input.value.trim();
        if (!nick) {
          this.mostrarAlerta('warning', 'Indica un nick para agregar.');
          return;
        }

        try {
          const respuesta = await ClienteRest.agregarUsuario(nick);
          this.mostrarAlerta('success', `Usuario "${respuesta.nick}" agregado correctamente.`);
          input.value = '';
          await this.actualizarPanelUsuarios();
        } catch (error) {
          this.mostrarAlerta('danger', error.message);
        }
      });

      btnEliminar.addEventListener('click', async () => {
        const nick = input.value.trim();
        if (!nick) {
          this.mostrarAlerta('warning', 'Indica un nick para eliminar.');
          return;
        }

        try {
          const respuesta = await ClienteRest.eliminarUsuario(nick);
          if (respuesta.ok) {
            this.mostrarAlerta('info', `Usuario "${nick}" eliminado del sistema.`);
            input.value = '';
            await this.actualizarPanelUsuarios();
          } else {
            this.mostrarAlerta('warning', `No existe un usuario con nick "${nick}".`);
          }
        } catch (error) {
          this.mostrarAlerta('danger', error.message);
        }
      });

      cardBody.appendChild(form);
      this.colFormulario.appendChild(card);
    },

    mostrarPanelUsuarios() {
      const card = crearElemento('div', { clases: 'card h-100 shadow-sm' });
      const cardBody = crearElemento('div', { clases: 'card-body d-flex flex-column' });
      card.appendChild(cardBody);

      const cabecera = crearElemento('div', { clases: 'd-flex justify-content-between align-items-center mb-3' });
      cabecera.appendChild(crearElemento('h5', { clases: 'card-title mb-0', texto: 'Usuarios activos' }));
      this.badgeTotal = crearElemento('span', { clases: 'badge badge-success badge-pill', texto: '0' });
      cabecera.appendChild(this.badgeTotal);
      cardBody.appendChild(cabecera);

      const texto = crearElemento('p', {
        clases: 'text-muted',
        texto: 'La lista se sincroniza con el backend y se actualiza automáticamente tras cada operación.',
      });
      cardBody.appendChild(texto);

  this.listaUsuarios = crearElemento('ul', { clases: 'list-group list-group-flush' });
      card.appendChild(this.listaUsuarios);

      const pie = crearElemento('div', { clases: 'card-footer bg-white d-flex justify-content-end' });
      const btnRefrescar = crearElemento('button', {
        clases: 'btn btn-sm btn-outline-secondary',
        texto: 'Refrescar',
        atributos: { type: 'button' },
      });
      btnRefrescar.classList.add('ml-2');
      pie.appendChild(btnRefrescar);
      card.appendChild(pie);

      btnRefrescar.addEventListener('click', () => {
        this.actualizarPanelUsuarios();
      });

      this.colEstado.appendChild(card);
    },

    mostrarPanelConsultas() {
      const card = crearElemento('div', { clases: 'card shadow-sm mt-4' });
      const cardBody = crearElemento('div', { clases: 'card-body' });
      card.appendChild(cardBody);

      cardBody.appendChild(
        crearElemento('h5', {
          clases: 'card-title',
          texto: 'Consultas rápidas',
        }),
      );

      const descripcion = crearElemento('p', {
        clases: 'text-muted',
        texto: 'Verifica si un usuario está activo y consulta el número total de usuarios registrados.',
      });
      cardBody.appendChild(descripcion);

  const controles = crearElemento('div', { clases: 'd-flex flex-column flex-md-row align-items-start' });
  controles.classList.add('mt-3');

  const formularioActivo = crearElemento('form', { clases: 'form-inline' });
      const inputActivo = crearElemento('input', {
        clases: 'form-control mb-2 mr-sm-2',
        atributos: { type: 'text', placeholder: 'Nick a consultar', id: 'nick-consulta' },
      });
      const btnConsultar = crearElemento('button', {
        clases: 'btn btn-outline-primary mb-2 ml-sm-2',
        texto: '¿Está activo?',
        atributos: { type: 'submit' },
      });

      formularioActivo.appendChild(inputActivo);
      formularioActivo.appendChild(btnConsultar);

      const resumenUsuarios = crearElemento('div', { clases: 'd-flex flex-column' });
      const etiquetaTotal = crearElemento('span', { clases: 'text-muted', texto: 'Usuarios registrados' });
      this.indicadorTotal = crearElemento('span', { clases: 'display-4 font-weight-bold text-primary', texto: '0' });
      resumenUsuarios.appendChild(etiquetaTotal);
      resumenUsuarios.appendChild(this.indicadorTotal);

      controles.appendChild(formularioActivo);
      controles.appendChild(resumenUsuarios);
      cardBody.appendChild(controles);

      formularioActivo.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const nick = inputActivo.value.trim();
        if (!nick) {
          this.mostrarAlerta('warning', 'Indica un nick para consultar su estado.');
          return;
        }

        try {
          const respuesta = await ClienteRest.usuarioActivo(nick);
          const estado = respuesta.activo ? 'activo' : 'inactivo';
          const tipo = respuesta.activo ? 'success' : 'secondary';
          this.mostrarAlerta(tipo, `El usuario "${respuesta.nick}" está ${estado}.`);
        } catch (error) {
          this.mostrarAlerta('danger', error.message);
        }
      });

      this.colEstado.appendChild(card);
    },

    async actualizarPanelUsuarios() {
      try {
        const usuarios = await ClienteRest.obtenerUsuarios();
        this.pintarUsuarios(usuarios);
      } catch (error) {
        this.mostrarAlerta('danger', error.message);
      }

      try {
        const total = await ClienteRest.numeroUsuarios();
        const cantidad = Number(total.num ?? 0);
        this.badgeTotal.textContent = cantidad;
        this.indicadorTotal.textContent = cantidad;
      } catch (error) {
        this.mostrarAlerta('danger', error.message);
      }
    },

    pintarUsuarios(usuarios) {
      this.listaUsuarios.innerHTML = '';

      if (!usuarios.length) {
        const vacio = crearElemento('li', {
          clases: 'list-group-item text-center text-muted',
          texto: 'No hay usuarios registrados todavía.',
        });
        this.listaUsuarios.appendChild(vacio);
        return;
      }

      usuarios.forEach(({ nick }) => {
        const item = crearElemento('li', {
          clases: 'list-group-item d-flex justify-content-between align-items-center',
        });
        item.appendChild(crearElemento('span', { texto: nick }));

        const btnEliminar = crearElemento('button', {
          clases: 'btn btn-sm btn-outline-danger',
          texto: 'Eliminar',
          atributos: { type: 'button' },
        });

        btnEliminar.addEventListener('click', async () => {
          try {
            const respuesta = await ClienteRest.eliminarUsuario(nick);
            if (respuesta.ok) {
              this.mostrarAlerta('info', `Usuario "${nick}" eliminado.`);
              await this.actualizarPanelUsuarios();
            } else {
              this.mostrarAlerta('warning', `No existe un usuario con nick "${nick}".`);
            }
          } catch (error) {
            this.mostrarAlerta('danger', error.message);
          }
        });

        item.appendChild(btnEliminar);
        this.listaUsuarios.appendChild(item);
      });
    },

    mostrarAlerta(tipo, mensaje) {
      this.alertPlaceholder.innerHTML = '';
      const alerta = crearElemento('div', {
        clases: `alert alert-${tipo} alert-dismissible fade show`,
        atributos: { role: 'alert' },
      });

      alerta.appendChild(crearElemento('span', { texto: mensaje }));

      const botonCerrar = crearElemento('button', {
        clases: 'close',
        atributos: { type: 'button', 'data-dismiss': 'alert', 'aria-label': 'Close' },
      });
      botonCerrar.innerHTML = '<span aria-hidden="true">&times;</span>';
      botonCerrar.addEventListener('click', () => {
        alerta.remove();
      });

      alerta.appendChild(botonCerrar);
      this.alertPlaceholder.appendChild(alerta);
    },
  };

  global.ControlWeb = ControlWeb;
})(window);
