---
name: asdd-orchestrate
description: Orquesta el flujo ASDD completo. Fase 1 (Spec) → Fase 2 (Backend ∥ Frontend) → Fase 3 (Tests ∥) → Fase 4 (QA).
argument-hint: "<nombre-feature> | status"
---

# ASDD Orchestrate

## Flujo

```
[FASE 1 — SECUENCIAL]
  spec-generator → .github/specs/<feature>.spec.md  (DRAFT → APPROVED por el usuario)

[FASE 2 — FRONTEND]
  frontend-developer

[FASE 3 — TESTS]
  test-engineer-frontend

[FASE 4 — SECUENCIAL]
  qa-agent → /gherkin-case-generator, /risk-identifier
```

## Proceso
1. Busca `.github/specs/<feature>.spec.md`
   - No existe → ejecuta `/generate-spec` y espera
   - `DRAFT` → presenta spec al usuario y pide aprobación
   - `APPROVED` → actualiza a `IN_PROGRESS` y continúa
2. Lanza Fase 2 (frontend)
3. Cuando Fase 2 completa → lanza Fase 3 (tests frontend)
4. Cuando Fase 3 completa → lanza Fase 4 (qa-agent)
5. Actualiza spec a `IMPLEMENTED` y reporta estado final al usuario

## Comando status
Al recibir `status`: lista specs en `.github/specs/` con su estado actual y próxima acción.

## Reglas
- Sin spec `APPROVED` → no hay código — sin excepciones
- No implementar directamente — solo coordinar y delegar
- Si una fase falla → detener el flujo y notificar al usuario con contexto
- Fase 5 (doc) solo si el usuario la solicita explícitamente
