# CLAUDE.md - Instrucciones para HU-02

## Contexto del Proyecto

Este proyecto usa el patrón ASDD (Análisis, Spec, Desarrollo, Demo) para implementar features de React Native.

## Flujo de Trabajo

### 1. Análisis de Requisitos
- Leer `.github/requirements/HU-02.md` para entender la historia de usuario completa
- Identificar todos los criterios de aceptación

### 2. Generación de Spec
```bash
/skills/generate-spec
```
- Genera `.github/specs/product-registration.spec.md`
- Requiere status **APPROVED** antes de implementar

### 3. Implementación
```bash
/skills/implement-frontend
```
- Implementa el feature completo
- Usa la spec APPROVED como referencia

### 4. Unit Testing
```bash
/skills/unit-testing
```
- Genera tests unitarios
- Lee la spec y el código implementado

### 5. Gherkin Cases
```bash
/skills/gherkin-case-generator
```
- Genera escenarios Gherkin para QA
- Output en `docs/output/qa/`

## Validaciones Requeridas (HU-02)

| Campo | Requerido | Longitud | Validación Extra |
|-------|-----------|---------|------------------|
| ID | Sí | 3-10 caracteres | GET /bp/products/verification/:id |
| Nombre | Sí | 5-100 caracteres | - |
| Descripción | Sí | 10-200 caracteres | - |
| Logo (URL) | Sí | URL válida | - |
| Fecha Liberación | Sí | >= fecha actual | - |
| Fecha Revisión | Sí (calculado) | Fecha Liberación + 1 año | Solo lectura |

## Endpoints de API

- `GET /bp/products/verification/:id` - Verificar disponibilidad de ID
- `POST /bp/products` - Crear nuevo producto

## Estructura de Archivos

```
src/
├── app/                    # Páginas (rutas)
├── widgets/                 # Componentes reutilizables
├── features/
│   └── product-registration/
│       ├── ui/              # Componentes específicos del feature
│       ├── model/           # Tipos y constantes
│       └── lib/             # Lógica de validación
```