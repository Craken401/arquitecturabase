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

## Despliegue en Google Cloud Run

**Proyecto:** `arquitecturabase-474410` (ID) · **Región:** `europe-west1` · **Servicio:** `arquitecturabase`

### Requisitos (primera vez en este PC)
1. Instalar Google Cloud SDK (Windows):
	```powershell
	winget install Google.Cloud.Sdk


Iniciar sesión y fijar proyecto/región:

gcloud auth login
gcloud config set project arquitecturabase-474410
gcloud config set run/region europe-west1

Despliegue (cada vez)

Desde la raíz del repo:

gcloud run deploy arquitecturabase --source . --region europe-west1 --allow-unauthenticated


Al finalizar, Cloud Run mostrará una Service URL pública (ej.: https://arquitecturabase-XXXXXXXX.europe-west1.run.app).

Verificación rápida
curl -s https://<TU_URL>/agregarUsuario/Craken
curl -s https://<TU_URL>/numeroUsuarios
curl -s https://<TU_URL>/obtenerUsuarios
curl -s -X DELETE https://<TU_URL>/eliminarUsuario/Craken

Costes (recomendación)

Cloud Run no cobra en reposo si las instancias mínimas son 0:

gcloud run services update arquitecturabase --region europe-west1 --min-instances=0 --max-instances=1 --memory=512Mi --cpu=1


Para detener completamente el servicio:

gcloud run services delete arquitecturabase --region europe-west1

Alternativa sin instalar nada (Cloud Shell en el navegador)
gcloud config set project arquitecturabase-474410
gcloud config set run/region europe-west1
git clone https://github.com/Craken401/arquitecturabase
cd arquitecturabase
gcloud run deploy arquitecturabase --source . --allow-unauthenticated

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
