# CLAUDE.md - Instrucciones para Features

## Contexto del Proyecto

Este proyecto usa el patrón **ASDD** (Análisis, Spec, Desarrollo, Demo) para implementar features en React Native con Feature-Sliced Design (FSD).

## Flujo de Trabajo ASDD

### 1. Análisis de Requisitos
- Leer `.github/requirements/<feature>.requirement.md` para entender la historia de usuario
- Identificar criterios de aceptación y flujos

### 2. Generación de Spec
```bash
/skill generate-spec
```
- Genera `.github/specs/<feature>.spec.md`
- Requiere status **APPROVED** antes de implementar

### 3. Implementación
```bash
/skill implement-frontend
```
- Implementa el feature completo
- Usa la spec APPROVED como referencia

### 4. Unit Testing
```bash
/skill unit-testing
```
- Genera tests unitarios
- Lee la spec y el código implementado

### 5. Gherkin Cases
```bash
/skill gherkin-case-generator
```
- Genera escenarios Gherkin para QA
- Output en `docs/output/qa/`

---

## Features Disponibles

### HU-01: Product List and Search
**Archivo:** `.github/requirements/product-registration.requirement.md`
**Feature:** `product-list-search`

| Campo | Descripción |
|-------|-------------|
| Endpoint | GET /bp/products |
| Filtro | Tiempo real por nombre |
| Navegación | A detalle del producto |

### HU-02: Product Registration
**Archivo:** `.github/requirements/product-registration.requirement.md`
**Feature:** `product-registration`

| Campo | Requerido | Longitud | Validación Extra |
|-------|-----------|---------|----------------|
| ID | Sí | 3-10 caracteres | GET /bp/products/verification/:id |
| Nombre | Sí | 5-100 caracteres | - |
| Descripción | Sí | 10-200 caracteres | - |
| Logo (URL) | Sí | URL válida | - |
| Fecha Liberación | Sí | >= fecha actual | - |
| Fecha Revisión | Sí (calculado) | Fecha Liberación + 1 año | Solo lectura |

### HU-03: Product Edit/Detail
**Archivo:** `.github/requirements/product-edit.requirement.md`
**Feature:** `product-edit`

| Campo | Descripción |
|-------|-------------|
| Vista | ID, nombre, descripción, logo, fechas |
| Edición | Botón para cargar datos |
| Restricción | ID deshabilitado en edición |
| Validación | Mismas reglas que HU-02 |

---

## Estructura FSD

```
src/
├── app/                    # Páginas (rutas)
├── widgets/                 # Componentes reutilizables
├── features/
│   └── <feature-name>/
│       ├── ui/             # Componentes específicos
│       ├── model/          # Tipos y constantes
│       └── lib/           # Lógica de negocio
├── entities/               # Modelos de dominio
└── shared/                 # Utilidades compartidas
```

## Validación ASDD Checklist

- [ ] Análisis completado en requirement.md
- [ ] Spec generada con status APPROVED
- [ ] Implementación usa la spec
- [ ] Tests unitarios creados
- [ ] Gherkin cases exportados