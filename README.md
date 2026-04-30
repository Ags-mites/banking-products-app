# Banking Products - Full Stack Setup

Este workspace contiene dos proyectos:

- `repo-interview-main`: backend (Node.js + Express + routing-controllers)
- `banking-products-app`: frontend (Expo + React Native + Expo Router)

## Requisitos

- Node.js 20+
- npm 10+

## Estructura del workspace

```text
App/
  repo-interview-main/      # Backend API (puerto 3002)
  banking-products-app/     # Frontend Expo
```

## 1) Levantar backend

En una terminal:

```bash
cd repo-interview-main
npm install
npm run start:dev
```

Backend disponible en:

- `http://localhost:3002`

Rutas principales (con prefijo `/bp`):

- `GET /bp/products`
- `GET /bp/products/verification/:id`
- `GET /bp/products/:id`
- `POST /bp/products`
- `PUT /bp/products/:id`
- `DELETE /bp/products/:id`

Nota importante:

- Este backend usa almacenamiento en memoria (arreglo local). Si reinicias el servidor, se pierden los productos creados.

## 2) Configurar y levantar frontend

En otra terminal:

```bash
cd banking-products-app
npm install
cp .env.template .env
```

Asegura que `.env` tenga:

```env
EXPO_PUBLIC_API_URL=http://localhost:3002
```

Iniciar app:

```bash
npm run start
```

Atajos en Expo:

- `w`: abrir en web
- `a`: abrir en Android
- `r`: recargar

## 3) Ejecutar pruebas del frontend

Desde `banking-products-app`:

```bash
npm test
```

Cobertura:

```bash
npm run test:coverage
```

Reporte HTML:

- `banking-products-app/coverage/lcov-report/index.html`

## 4) Flujo rapido para probar funcionalidad

1. Levanta backend (`npm run start:dev`).
2. Levanta frontend (`npm run start`).
3. Abre la app en web con `w`.
4. Crea un producto desde la pantalla de registro.
5. Verifica que aparece en listado.
6. Abre detalle, edita y guarda.
7. Elimina el producto.

## Problemas comunes

### `Cannot find module 'babel-preset-expo'`

Desde `banking-products-app`:

```bash
npm install --save-dev babel-preset-expo@~54.0.10
```

### Puerto 8081 ocupado (Expo)

- Acepta otro puerto cuando Expo lo pregunte, o
- libera el proceso actual:

```bash
lsof -i :8081 -sTCP:LISTEN -P -n
kill <PID>
```
