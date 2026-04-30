---
description: Reglas de testing para React Native. Framework: Jest + @testing-library/react-native.
paths:
  - "src/**/__tests__/**"
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
---

# Reglas de Testing — React Native

## Stack

- **Jest** — test runner
- **@testing-library/react-native** — testing utilities (NO usar testing-library/web)
- **jest.mock()** — para mocks de Axios y módulos

## Principios AAA

```
// Arrange — preparar datos y contexto
// Act — ejecutar la acción bajo prueba
// Assert — verificar el resultado esperado
```

## Pirámide de Testing

| Nivel | % recomendado | Qué cubre |
|-------|--------------|-----------|
| **Unitarios** | ~70% | Lógica de negocio, validaciones |
| **Integración** | ~20% | Hooks, widgets |
| **E2E** | ~10% | Flujos críticos de usuario |

## Reglas de Oro

- **Independencia** — cada test ejecutable solo
- **Aislamiento** — mockear SIEMPRE APIs (`http://localhost:3002`)
- **Determinismo** — sin timers, sin fechas reales
- **Cobertura mínima ≥ 70%** en lógica de negocio
- **Nombres descriptivos** — `test_<función>_<escenario>_<resultado>`

## Cobertura obligatoria

Por cada función/lógica:
- ✅ Happy path
- ❌ Error path
- 🔲 Edge cases (vacío, null, formato inválido)

## Mocks obligatorios

```typescript
// Mock de API
jest.mock('../../entities/api/featureApi', () => ({
  fetchFeature: jest.fn(),
}));
```

## Anti-patrones

- Llamadas HTTP reales en tests
- console.log permanente
- Datos de producción
- Tests que dependen de orden

## Ejecución

```bash
npm test              # todos los tests
npm test -- --coverage  # con cobertura
```