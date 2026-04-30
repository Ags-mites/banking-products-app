---
name: unit-testing
description: Genera tests unitarios para React Native. Lee la spec y el código implementado. Requiere spec APPROVED.
argument-hint: "<nombre-feature>"
---

# Unit Testing — React Native

## Definition of Done

- [ ] Cobertura ≥ 70% en lógica de negocio
- [ ] Tests aislados — sin conexión a API real (siempre mocks)
- [ ] Escenario feliz + errores + validaciones cubiertos
- [ ] No rompe contratos existentes

## Prerequisito — Lee en paralelo

```
.github/specs/<feature>.spec.md
código implementado en src/
.claude/rules/testing.md
.claude/docs/design-system.md
```

## Estructura de Tests (FSD)

```
src/
├── shared/
│   └── ui/
│       └── __tests__/           # Componentes puros
│           └── <Component>.test.tsx
├── features/
│   └── <feature>/
│       └── __tests__/           # Hooks
│           └── use<Feature>.test.ts
├── widgets/
│   └── <widget>/
│       └── __tests__/           # Widgets con lógica
│           └── <Widget>.test.tsx
└── shared/
    └── lib/
        └── __tests__/           # Validaciones
            └── dateValidator.test.ts
```

## Patrones core

```typescript
// Jest + @testing-library/react-native
import { render, screen, fireEvent } from '@testing-library/react-native';
import { renderHook, waitFor } from '@testing-library/react-native';

// Mock de API
jest.mock('../../api/featureApi', () => ({
  fetchFeature: jest.fn(),
}));
```

## Reglas

- Ver `.claude/rules/testing.md`
- AAA (Arrange, Act, Assert)
- Mocks con `jest.mock()`
- Coverage mínimo 70%

## Restricciones

- Solo `__tests__/`. No modificar código fuente.
- Sin llamadas HTTP reales — siempre mocks.
- Usar `@testing-library/react-native` (no web)