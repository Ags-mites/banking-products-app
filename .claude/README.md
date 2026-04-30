# ASDD Framework — React Native + FSD

**ASDD** (Agent Spec Software Development) para proyectos React Native con Feature-Sliced Design.

```
Requerimiento → mobile-architect → [ui-factory ∥ logic-navigator] → test-engineer-rn → qa-agent
```

---

## Requisitos

| Requisito | Detalle |
|---|---|
| Claude Code CLI | Instalado y autenticado (`claude`) |
| Modelo recomendado | `claude-sonnet-4-6` (configurado en `settings.json`) |

---

## Estructura FSD (React Native)

```
src/
├── app/                  # Expo Router (_layout.tsx, index.tsx)
├── pages/                # Vistas principales
├── widgets/              # Bloques complejos
├── features/             # Interacciones con estado
├── entities/             # Lógica de dominio (types, API, mappers)
└── shared/
    ├── ui/               # ATOMS/MOLECULES: Button, Input, Modal
    ├── lib/              # Helpers (validaciones de fecha)
    └── theme/            # design-tokens.ts
```

---

## Flujo ASDD

### Paso 1 — Spec

```
/generate-spec <nombre-feature>
```

O:
```
@spec-generator genera la spec para: [tu requerimiento]
```

### Paso 2 — Arquitectura (mobile-architect)

```
@mobile-architect analiza: [descripción del feature]
```

El arquitecto planifica qué capas FSD se affected y presenta un plan para delegar.

### Paso 3 — Implementación (paralelo)

```
@ui-factory crea componentes para .github/specs/<feature>.spec.md
@logic-navigator implementa lógica para .github/specs/<feature>.spec.md
```

### Paso 4 — Tests

```
@test-engineer-rn genera tests para .github/specs/<feature>.spec.md
```

### Paso 5 — QA

```
@qa-agent ejecuta QA para .github/specs/<feature>.spec.md
```

---

## Agentes disponibles

| Agente | Rol |
|---|---|
| `mobile-architect` | Arquirecto FSD - planifica y orquesta |
| `spec-generator` | Genera specs técnicas |
| `ui-factory` | UI atómica - componentes puros |
| `logic-navigator` | Lógica - hooks, services, validaciones |
| `test-engineer-rn` | Tests - Jest + RN Testing Library |
| `qa-agent` | QA - Gherkin, riesgos |

---

## Skills disponibles

| Comando | Qué hace |
|---|---|
| `/generate-spec` | Genera spec técnica |
| `/unit-testing` | Genera tests |
| `/gherkin-case-generator` | Flujos críticos Gherkin |
| `/risk-identifier` | Matriz de riesgos |

---

## Design System

Los componentes UI siguen `.claude/docs/design-system.md`:

- Primary: `#0F265C` (Azul Marino)
- Accent: `#FFD200` (Amarillo Banco)
- Error: `#D32F2F`
- StyleSheet.create obligatorio

---

## Reglas de Oro

1. **No código sin spec aprobada**
2. **UI + Lógica en paralelo** - ui-factory y logic-navigator trabajan juntos
3. **FSD estricto** - seguir la estructura de carpetas
4. **Sin librerías UI** - solo StyleSheet.create