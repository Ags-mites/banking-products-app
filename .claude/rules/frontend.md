---
description: Reglas de frontend para React Native con Feature-Sliced Design (FSD).
paths:
  - "src/**"
---

# Reglas de Frontend — React Native + FSD

## Stack aprobado

- **React Native** con **Expo**
- **TypeScript** (obligatorio)
- **StyleSheet.create** (obligatorio, NO librerías UI)
- **Expo Router** para navegación
- **Axios** para llamadas HTTP

**Prohibido:** Tailwind, NativeBase, Tamagui, styled-components, CSS-in-JS, Redux, MobX.

## Arquitectura FSD

```
src/
├── app/                  # Expo Router (_layout.tsx, index.tsx)
├── pages/                # Vistas principales
├── widgets/              # Bloques complejos (UI + lógica)
├── features/             # Hooks de interacciones
├── entities/             # Types, API client, mappers
└── shared/
    ├── ui/               # Componentes atómicos (Button, Input, Card)
    ├── lib/              # Helpers (validaciones de fecha)
    └── theme/            # Design tokens
```

## Convenciones Obligatorias

- **Estilos**: SIEMPRE `StyleSheet.create()` — NUNCA librerías externas
- **API base**: `http://localhost:3002`
- **Nombres de archivos**: PascalCase para componentes, camelCase para hooks
- **Tests**: en `__tests__/` junto al archivo testeado

## Design System

Ver `.claude/docs/design-system.md` para colores, tipografía y componentes.

## Validaciones críticas (F4)

En `src/shared/lib/`:

- `validateProductId(id)` — verificar ID único con endpoint `/bp/products/verification/:id`
- `isValidReleaseDate(date)` — liberación >= fecha actual
- `calculateReviewDate(releaseDate)` — revisión = liberación + 1 año

## Anti-patrones Prohibidos

- Librerías UI externas (NativeBase, React Native Paper, etc.)
- Estilos inline fuera de StyleSheet
- Lógica de negocio en componentes (va en features/)
- Fetch/Axios directo en componentes (va en entities/api/)

## Lineamientos

`.claude/docs/lineamientos/dev-guidelines.md` — Clean Code, SOLID, API REST, Seguridad.