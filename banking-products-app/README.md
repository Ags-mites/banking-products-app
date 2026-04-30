# Banking Products App

Aplicacion frontend construida con Expo + React Native (Expo Router) para gestionar productos bancarios.

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+

## Configuracion inicial

1. Instala dependencias:

```bash
npm install
```

2. Configura variables de entorno:

```bash
cp .env.template .env
```

3. Verifica el valor de `EXPO_PUBLIC_API_URL` en `.env`.

Ejemplo local:

```env
EXPO_PUBLIC_API_URL=http://localhost:3002
```

## Como ejecutar la app

### Desarrollo (Expo)

```bash
npm run start
```

Atajos utiles en la consola de Expo:

- `w`: abrir en web
- `a`: abrir en Android
- `r`: recargar
- `m`: menu de desarrollador

### Web directo

```bash
npm run web
```

## Como ejecutar tests

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm run test:coverage
```

El reporte de cobertura HTML queda en:

- `coverage/lcov-report/index.html`

## Resultado de validacion actual

Ejecucion realizada en este entorno:

- `Test Suites: 7 passed, 7 total`
- `Tests: 95 passed, 95 total`
- `Snapshots: 0 total`

Cobertura global actual:

- `Statements: 94.16%`
- `Branches: 85.96%`
- `Functions: 90%`
- `Lines: 98.52%`

## Problemas comunes y solucion

### Error: Cannot find module 'babel-preset-expo'

Este proyecto requiere `babel-preset-expo` compatible con Expo SDK 54.

Solucion:

```bash
npm install --save-dev babel-preset-expo@~54.0.10
```

### Puerto ocupado (8081)

Si Expo indica que el puerto 8081 esta en uso, puedes:

- Aceptar usar otro puerto cuando Expo lo pregunte, o
- Cerrar el proceso actual y reiniciar.

En Linux:

```bash
lsof -i :8081 -sTCP:LISTEN -P -n
kill <PID>
```

## Estructura (alto nivel)

- `app/`: rutas Expo Router
- `pages/`: vistas por pantalla
- `features/`: hooks y logica por funcionalidad
- `entities/`: tipos y acceso API
- `shared/`: utilidades y componentes reutilizables
