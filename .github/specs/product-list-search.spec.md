---
id: SPEC-001
status: APPROVED
feature: product-list-search
created: 2026-04-30
updated: 2026-04-30
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: Product List and Search

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Pantalla que muestra el catálogo de productos financieros obtenidos desde la API y permite al usuario filtrarlos en tiempo real por nombre. Muestra un contador de resultados, navega al detalle al presionar un ítem y maneja el estado vacío cuando no hay coincidencias.

### Requerimiento de Negocio
El requerimiento original se encuentra en `.github/requirements/product-list-search.md` (HU-01: Product List and Search).

### Historias de Usuario

#### HU-01: Visualizar y buscar productos financieros

```
Como:        Usuario de la aplicación bancaria
Quiero:      Visualizar el catálogo de productos financieros y realizar búsquedas por nombre
Para:        Gestionar y consultar la información de los servicios disponibles de manera ágil

Prioridad:   Alta
Estimación:  M
Dependencias: Ninguna (API GET /bp/products disponible en http://localhost:3002)
Capa:        Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Cargar productos desde la API
  Dado que:  la aplicación necesita mostrar el catálogo de productos
  Cuando:    el usuario abre la pantalla de lista de productos
  Entonces:  el sistema llama a GET /bp/products
  Y:         muestra todos los productos disponibles en una lista

CRITERIO-1.2: Mostrar producto con chevron
  Dado que:  los productos se han cargado desde la API
  Cuando:    un producto se renderiza en la lista
  Entonces:  muestra el nombre y el ID del producto
  Y:         muestra un ícono de chevron ">" a la derecha del ítem

CRITERIO-1.3: Búsqueda en tiempo real por nombre
  Dado que:  la lista de productos se está mostrando
  Cuando:    el usuario escribe en el campo de búsqueda
  Entonces:  la lista se filtra en tiempo real con coincidencia sobre el nombre del producto
  Y:         muestra solo los productos que contienen el término de búsqueda

CRITERIO-1.4: Mostrar contador de productos filtrados
  Dado que:  los productos se muestran en la lista
  Cuando:    el usuario aplica un filtro de búsqueda
  Entonces:  el sistema muestra la cantidad total de productos filtrados
  Y:         actualiza el contador a medida que el filtro cambia

CRITERIO-1.5: Navegar al detalle del producto
  Dado que:  los productos se muestran en la lista
  Cuando:    el usuario presiona sobre un elemento de la lista
  Entonces:  la aplicación navega a la pantalla de detalle del producto
  Y:         pasa el producto seleccionado como parámetro de navegación
```

**Edge Case**
```gherkin
CRITERIO-1.6: Resultados de búsqueda vacíos
  Dado que:  la lista de productos se está mostrando
  Cuando:    el usuario busca un término que no coincide con ningún producto
  Entonces:  el sistema muestra un mensaje de estado vacío
  Y:         el contador muestra cero productos

CRITERIO-1.7: Búsqueda insensible a mayúsculas
  Dado que:  existen productos "Tarjeta de Crédito" y "Préstamo Personal"
  Cuando:    el usuario busca "tarjeta"
  Entonces:  el sistema muestra "Tarjeta de Crédito" en los resultados

CRITERIO-1.8: Limpiar filtro de búsqueda
  Dado que:  un filtro de búsqueda está aplicado
  Cuando:    el usuario limpia el campo de búsqueda
  Entonces:  todos los productos se muestran nuevamente
  Y:         el contador muestra el total de productos sin filtrar
```

### Reglas de Negocio
1. El filtro de búsqueda opera sobre el campo `name` del producto usando `toLowerCase().includes()` — no requiere llamada adicional a la API.
2. El contador refleja siempre la cantidad de productos actualmente visibles (post-filtro), no el total original.
3. La navegación al detalle es responsabilidad de Expo Router; el ítem solo hace `router.push` con el `id` del producto.
4. El estado de carga (loading) se muestra mientras se resuelve el fetch inicial; los errores de red se muestran con un mensaje descriptivo.

---

## 2. DISEÑO

### Modelos de Datos

#### Entidades afectadas
| Entidad | Almacén | Cambios | Descripción |
|---------|---------|---------|-------------|
| `Product` | API externa `/bp/products` | ninguno (solo lectura) | Producto financiero del catálogo |

#### Campos del modelo `Product`
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | string | sí | Identificador único del producto |
| `name` | string | sí | Nombre descriptivo del producto |
| `description` | string | no | Descripción del producto |
| `logo` | string | no | URL del logo del producto |
| `date_release` | string (ISO 8601) | no | Fecha de liberación |
| `date_revision` | string (ISO 8601) | no | Fecha de revisión |

> Los campos opcionales se asumen por convención del dominio bancario; el contrato exacto debe validarse contra la API real en tiempo de implementación.

#### Índices / Constraints
- Sin índices propios — datos de solo lectura provenientes de la API.

### API Endpoints

#### GET /bp/products
- **Descripción**: Obtiene el listado completo de productos financieros
- **Base URL**: `http://localhost:3002`
- **Auth requerida**: no (según requerimiento)
- **Response 200**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "logo": "string",
        "date_release": "YYYY-MM-DD",
        "date_revision": "YYYY-MM-DD"
      }
    ]
  }
  ```
- **Response 400**: error de solicitud
- **Response 500**: error interno del servidor

### Diseño Frontend

#### Estructura FSD

```
src/
├── app/
│   └── products/
│       └── index.tsx              # Ruta /products (Expo Router)
├── pages/
│   └── ProductList/
│       └── ProductListPage.tsx    # Vista principal — layout completo
├── features/
│   └── productSearch/
│       └── useProductSearch.ts    # Hook: fetch + filtro en tiempo real
├── entities/
│   └── product/
│       ├── product.types.ts       # Tipo Product
│       └── productApi.ts          # Axios call GET /bp/products
└── shared/
    └── ui/
        └── ProductItem/
            └── ProductItem.tsx    # Ítem de lista con nombre, ID y chevron
```

#### Componentes nuevos
| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `ProductItem` | `shared/ui/ProductItem/ProductItem.tsx` | `product: Product, onPress: () => void` | Ítem de lista con nombre, ID y chevron ">" |
| `ProductListPage` | `pages/ProductList/ProductListPage.tsx` | ninguna (consume hook) | Página completa con buscador, contador y lista |

#### Páginas nuevas
| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `ProductListPage` | `app/products/index.tsx` | `/products` | no |

#### Hooks y State
| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useProductSearch` | `features/productSearch/useProductSearch.ts` | `{ products, filteredProducts, searchTerm, setSearchTerm, loading, error }` | Fetch inicial + filtrado por nombre case-insensitive |

#### Services (llamadas API)
| Función | Archivo | Endpoint |
|---------|---------|---------|
| `getProducts()` | `entities/product/productApi.ts` | `GET http://localhost:3002/bp/products` |

### Arquitectura y Dependencias
- Paquetes nuevos requeridos: ninguno (Axios ya disponible según stack aprobado)
- Servicios externos: `http://localhost:3002/bp/products` — API bancaria existente
- Impacto en punto de entrada: agregar ruta `/products` en Expo Router (`app/products/index.tsx`)

### Notas de Implementación
- El filtrado es **local** (client-side): se llama a la API una vez al montar el componente y el hook filtra el array en memoria.
- Usar `useMemo` para derivar `filteredProducts` desde `products` y `searchTerm` — evita re-cálculos innecesarios.
- El navegador de Expo Router recibirá el `id` del producto via `router.push('/products/[id]')` — la pantalla de detalle está fuera del alcance de esta spec.
- El estado vacío (CRITERIO-1.6) debe distinguir entre "cargando", "sin resultados de búsqueda" y "error de red".

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.
> El Orchestrator monitorea este checklist para determinar el progreso.

### Frontend

#### Implementación
- [ ] Crear `entities/product/product.types.ts` — tipo `Product`
- [ ] Crear `entities/product/productApi.ts` — función `getProducts()` con Axios
- [ ] Crear `features/productSearch/useProductSearch.ts` — hook con fetch + filtrado reactivo
- [ ] Implementar `shared/ui/ProductItem/ProductItem.tsx` + estilos StyleSheet
- [ ] Implementar `pages/ProductList/ProductListPage.tsx` + estilos StyleSheet (buscador, contador, lista, estado vacío, loading, error)
- [ ] Registrar ruta `/products` en `app/products/index.tsx` (Expo Router)

#### Tests Frontend
- [ ] `[ProductItem] renders product name and ID`
- [ ] `[ProductItem] renders chevron icon`
- [ ] `[ProductItem] calls onPress when pressed`
- [ ] `[useProductSearch] fetches products on mount`
- [ ] `[useProductSearch] filters products by name case-insensitively`
- [ ] `[useProductSearch] returns empty array when no match`
- [ ] `[useProductSearch] resets filter when searchTerm is cleared`
- [ ] `[useProductSearch] updates counter to reflect filtered count`
- [ ] `[useProductSearch] handles API error gracefully`
- [ ] `[ProductListPage] renders list of products`
- [ ] `[ProductListPage] shows empty state when search has no results`
- [ ] `[ProductListPage] shows loading indicator while fetching`
- [ ] `[ProductListPage] navigates to detail on item press`

### QA
- [ ] Ejecutar skill `/gherkin-case-generator` → criterios CRITERIO-1.1 a CRITERIO-1.8
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Revisar cobertura de tests contra los 8 criterios de aceptación
- [ ] Validar que el filtrado case-insensitive cubre caracteres especiales (acentos)
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
