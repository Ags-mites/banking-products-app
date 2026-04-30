---
name: implement-frontend
description: Implementa un feature completo en React Native usando FSD. Requiere spec APPROVED.
argument-hint: "<nombre-feature>"
---

# Implement Frontend — React Native + FSD

## Prerequisitos

1. Leer spec: `.github/specs/<feature>.spec.md`
2. Leer design-system: `.claude/docs/design-system.md`

## Estructura FSD

```
src/
├── app/                  # Expo Router
├── pages/                # Vistas (FeaturePage.tsx)
├── widgets/              # Bloques complejos
├── features/             # Hooks de interacciones
├── entities/             # Types, API, mappers
└── shared/
    ├── ui/               # Componentes atómicos (Button, Input, Card)
    ├── lib/              # Helpers (validaciones)
    └── theme/            # Tokens
```

## Orden de implementación

```
entities (types + api) → features (hooks) → shared/ui (componentes) → pages → widgets
```

## Reglas de maquetación

- LEER `.claude/docs/design-system.md` antes de crear estilos
- Usar EXCLUSIVAMENTE `StyleSheet.create()`
- PROHIBIDO: Tailwind, NativeBase, Styled Components, librerías UI externas

## Patrones obligatorios

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| Types | `src/entities/` | TypeScript interfaces |
| API | `src/entities/api/` | Axios calls a `http://localhost:3002` |
| Hooks | `src/features/<feature>/hooks/` | Estado + lógica de negocio |
| UI | `src/shared/ui/` | Componentes puros (sin lógica) |
| Pages | `src/pages/` | Composición final |
| Widgets | `src/widgets/` | UI + lógica integrada |

## Validaciones críticas (F4)

En `src/shared/lib/`:

```typescript
// Validar ID único
validateProductId(id: string): boolean

// Fecha liberación >= hoy
isValidReleaseDate(date: string): boolean

// Fecha revisión = liberación + 1 año
calculateReviewDate(releaseDate: string): string
```

## Restricciones

- Solo `src/` (estructura FSD)
- No generar tests (responsabilidad de `test-engineer-rn`)
- Sin librerías UI externas