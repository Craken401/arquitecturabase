# Arquitectura Base

Proyecto base de la asignatura Procesos de Ingeniería del Software. Incluye un backend Express con capa REST, cliente web enriquecido con Bootstrap 4 y pruebas automatizadas con Jasmine.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Scripts disponibles

```bash
npm install      # Instala dependencias
npm start        # Inicia el servidor Express (http://localhost:3000 por defecto)
npm test         # Ejecuta la suite de pruebas Jasmine (configuración multiplataforma)
npm run testW    # Alternativa Windows equivalente al paso del guion
```

## Estructura principal

- `index.js`: servidor Express y rutas REST.
- `cliente/`: activos estáticos del frontend (modelo, cliente REST y capa de control web).
- `spec/`: pruebas unitarias y de integración Jasmine.
- `pruebas-arquitecturabase/`: proyecto standalone de Jasmine (bloque 2) con:
	- `lib/jasmine-5.1.1/`: librerías copiadas desde el paquete standalone.
	- `src/modelo.js`: copia del modelo ligero de cliente.
	- `spec/modeloSpec.js`: especificaciones Jasmine ejecutables vía `SpecRunner.html`.
	- `SpecRunner.html`: cargador HTML para la ejecución manual en navegador.

## Cliente web

El cliente se sirve automáticamente desde `npm start`. Accede a `http://localhost:3000/` para:

- Registrar usuarios mediante el formulario "Agregar usuario".
- Listar y eliminar usuarios en la tarjeta "Usuarios activos".
- Consultar si un usuario está activo y revisar el total global en "Consultas rápidas".

La capa de acceso REST (`cliente/clienteRest.js`) utiliza jQuery para consumir el backend y `cliente/controlWeb.js` renderiza los componentes con vanilla JS + Bootstrap 4.

## Contratos REST (según guion)

El backend expone respuesta JSON minimalistas, alineadas con el guion del sprint:

- `GET /agregarUsuario/:nick` → `{ "nick": "pepe" }` si se registra o `{ "nick": -1 }` si el nick está en uso o es inválido.
- `GET /obtenerUsuarios` → Diccionario de usuarios, por ejemplo `{ "pepe": {"nick": "pepe"} }`.
- `GET /usuarioActivo/:nick` → `{ "activo": true|false }`.
- `GET /numeroUsuarios` → `{ "num": 3 }`.
- `DELETE /eliminarUsuario/:nick` → `{ "ok": true|false }`.

## Pruebas según la guía

- **Bloque 2**: abre `pruebas-arquitecturabase/SpecRunner.html` en el navegador para lanzar las specs de cliente.
- **Bloques 2-4**: ejecuta `npm test` (o `npm run testW` en PowerShell) para correr las specs de backend ubicadas en `spec/`.

## Despliegue en Cloud Run (Bloque 7)

1. **Instala y autentica** Google Cloud CLI:
	```bash
	gcloud auth login
	gcloud config set project <ID_DEL_PROYECTO>
	gcloud services enable run.googleapis.com artifactregistry.googleapis.com
	```
2. **Despliega** la aplicación (desde la carpeta raíz del repo):
	```bash
	gcloud run deploy arquitecturabase \
	  --source . \
	  --region europe-west1 \
	  --allow-unauthenticated
	```
3. **Verifica** la URL que devuelve el comando (por ejemplo, abriéndola en el navegador o ejecutando):
	```bash
	curl https://<URL_GENERADA>/obtenerUsuarios
	```

> Nota: la ejecución de `gcloud run deploy` debe realizarse en tu entorno local con la CLI instalada; este repositorio solo prepara la aplicación para que el comando funcione con `npm start` como punto de entrada.

## Flujo de trabajo con Git

Se recomienda versionar cada bloque de trabajo siguiendo los pasos:

```bash
git status
git add .
git commit -m "Descripción breve del bloque realizado"
git push origin main
```

Repite el ciclo tras completar cada bloque para mantener un historial claro y trazable.

## Verificación API

```bash
# agregar
curl -s http://localhost:3000/agregarUsuario/Craken
# activo?
curl -s http://localhost:3000/usuarioActivo/Craken
# total
curl -s http://localhost:3000/numeroUsuarios
# lista
curl -s http://localhost:3000/obtenerUsuarios
# eliminar (DELETE)
curl -s -X DELETE http://localhost:3000/eliminarUsuario/Craken
```
