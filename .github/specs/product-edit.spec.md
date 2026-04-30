---
id: SPEC-003
status: IN_PROGRESS
feature: product-edit
created: 2026-04-30
updated: 2026-04-30
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-001 (product-list-search)
  - SPEC-002 (product-registration)
---

# Spec: Detalle y Edición de Producto Financiero

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Dos pantallas complementarias: **Detalle** (visualización completa de un producto con logo, campos y botón Editar) y **Edición** (formulario pre-cargado con datos del producto, campo ID deshabilitado, mismas validaciones de HU-02, guardado via PUT). Ambas reemplazan el placeholder actual en `app/products/[id].tsx`.

### Requerimiento de Negocio
El requerimiento original se encuentra en `.github/requirements/product-edit.requirement.md` (HU-03: Product Edit and Detail).

### Historia de Usuario

#### HU-03: Ver y editar un producto financiero

```
Como:        Administrador de productos
Quiero:      Visualizar la información detallada y editar los datos de un producto
Para:        Corregir o actualizar la información de servicios existentes

Prioridad:   Alta
Estimación:  L
Dependencias:
  - SPEC-001 — ProductListPage navega a /products/:id al presionar un ítem
  - SPEC-002 — FormField, ProductFormErrors, todas las funciones de productValidations.ts
  - API GET  /bp/products/:id  disponible en http://localhost:3002
  - API PUT  /bp/products/:id  disponible en http://localhost:3002
Capa:        Frontend
```

---

### Criterios de Aceptación — HU-03

#### Happy Path — Detalle

```gherkin
CRITERIO-3.1: Mostrar detalle completo del producto
  Dado que: el usuario ha presionado un producto en la lista
  Cuando: la pantalla de detalle termina de cargar
  Entonces: muestra el ID del producto
    Y: muestra el nombre del producto
    Y: muestra la descripción del producto
    Y: muestra el logo del producto como imagen
    Y: muestra la fecha de liberación
    Y: muestra la fecha de revisión

CRITERIO-3.2: Navegar al formulario de edición
  Dado que: el usuario está en la pantalla de detalle
  Cuando: presiona el botón "Editar"
  Entonces: navega al formulario de edición
    Y: el formulario carga todos los datos actuales del producto
```

#### Happy Path — Edición

```gherkin
CRITERIO-3.3: Campo ID deshabilitado en edición
  Dado que: el formulario está en modo edición
  Cuando: el formulario se carga con los datos del producto
  Entonces: el campo ID muestra el valor actual
    Y: el campo ID está deshabilitado (no editable)
    Y: el usuario no puede modificar el ID

CRITERIO-3.4: Actualización exitosa
  Dado que: todos los campos editables del formulario son válidos
  Cuando: el usuario presiona "Enviar"
  Entonces: el sistema llama a PUT /bp/products/:id con los datos actualizados
    Y: muestra un banner de confirmación "¡Producto actualizado exitosamente!"
    Y: después de 2 segundos navega de regreso al detalle del producto
```

#### Validaciones en modo edición

```gherkin
CRITERIO-3.5: Validaciones idénticas a HU-02
  Dado que: el formulario de edición tiene datos cargados
  Cuando: el usuario modifica campos y presiona "Enviar" con datos inválidos
  Entonces: aplica las mismas reglas de validación que HU-02:
    Y: Nombre: requerido, mínimo 5 caracteres — error "Nombre no válido"
    Y: Descripción: requerida, mínimo 10 caracteres — error "Descripción no válida"
    Y: Logo: requerido, URL válida (contiene "://") — error "URL de logo requerida"
    Y: Fecha de Liberación: requerida, >= fecha actual — error con mensaje descriptivo
    Y: Fecha de Revisión: calculada automáticamente (no validada manualmente)
    Y: campos inválidos muestran borde rojo y mensaje debajo
```

#### Estados y errores

```gherkin
CRITERIO-3.6: Estado de carga del detalle
  Dado que: el usuario navega a la pantalla de detalle
  Cuando: se está cargando la información del producto
  Entonces: muestra un indicador de carga (ActivityIndicator)

CRITERIO-3.7: Error de red en detalle
  Dado que: el servidor no responde al cargar el detalle
  Cuando: la llamada a GET /bp/products/:id falla
  Entonces: muestra un mensaje de error descriptivo

CRITERIO-3.8: Error de red al actualizar
  Dado que: el usuario envía el formulario de edición
  Cuando: la llamada a PUT /bp/products/:id falla
  Entonces: muestra un mensaje de error global sobre los botones
    Y: el formulario mantiene los datos ingresados
```

---

### Reglas de Negocio

| # | Regla |
|---|-------|
| RN-1 | El ID del producto es inmutable en edición — el campo debe estar `editable={false}`. |
| RN-2 | Las validaciones de Nombre, Descripción, Logo y Fecha de Liberación son idénticas a SPEC-002. |
| RN-3 | La Fecha de Revisión se recalcula automáticamente al cambiar la Fecha de Liberación (= liberación + 1 año). |
| RN-4 | La Fecha de Liberación en edición debe ser >= fecha actual (igual que en registro). |
| RN-5 | No se llama a `verifyProductId` en el flujo de edición — el ID ya existe y está fijo. |
| RN-6 | Tras actualización exitosa, navegar a `/products/:id` (detalle) con `router.replace`. |
| RN-7 | El logo se muestra como `<Image>` en la vista de detalle; como `FormField` de texto en edición. |
| RN-8 | La pantalla de detalle obtiene el producto via `GET /bp/products/:id`. Si el endpoint no existe, se obtiene via `getProducts()` filtrando por `id`. |

---

## 2. DISEÑO

### Modelos de Datos

#### Entidades afectadas

| Entidad | Almacén | Cambios | Descripción |
|---------|---------|---------|-------------|
| `Product` | API externa | Ninguno | Tipo ya definido en `entities/product/product.types.ts` |
| `ProductFormData` | Estado local | Reutilizado de SPEC-002 | Mismo tipo, ya existe |
| `ProductFormErrors` | Estado local | Reutilizado de SPEC-002 | Mismo tipo, ya existe |

#### Tipo `Product` existente — sin cambios

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  date_release?: string;   // YYYY-MM-DD
  date_revision?: string;  // YYYY-MM-DD
}
```

---

### API Endpoints

#### GET /bp/products/:id
- **Descripción:** Obtiene el detalle de un producto por ID.
- **Base URL:** `http://localhost:3002`
- **Path param:** `id`
- **Auth requerida:** no
- **Response 200:**
  ```json
  {
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "logo": "string",
      "date_release": "YYYY-MM-DD",
      "date_revision": "YYYY-MM-DD"
    }
  }
  ```
- **Response 404:** producto no encontrado.
- **Fallback:** si el endpoint no existe, llamar `getProducts()` y filtrar por `id`.

#### PUT /bp/products/:id
- **Descripción:** Actualiza los datos de un producto existente.
- **Base URL:** `http://localhost:3002`
- **Path param:** `id`
- **Auth requerida:** no
- **Request body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "logo": "string",
    "date_release": "YYYY-MM-DD",
    "date_revision": "YYYY-MM-DD"
  }
  ```
  > El campo `id` NO se incluye en el body — va en el path param.
- **Response 200:**
  ```json
  {
    "message": "Product updated successfully",
    "data": { ...Product }
  }
  ```
- **Response 400:** datos inválidos.
- **Response 404:** producto no encontrado.

---

### Diseño Frontend

#### Migración de rutas (impacto en estructura existente)

Para soportar tanto `/products/:id` (detalle) como `/products/:id/edit` (edición), hay que migrar la ruta actual:

```
ANTES:  app/products/[id].tsx          → /products/:id  (placeholder)
DESPUÉS:
  app/products/[id]/index.tsx          → /products/:id  (detalle)
  app/products/[id]/edit.tsx           → /products/:id/edit (edición)
```

#### Estructura FSD completa

```
banking-products-app/
├── app/
│   └── products/
│       ├── index.tsx                              # (existente, sin cambios)
│       ├── register.tsx                           # (existente, sin cambios)
│       └── [id]/
│           ├── index.tsx                          # Ruta /products/:id — detalle
│           └── edit.tsx                           # Ruta /products/:id/edit — edición
├── pages/
│   ├── ProductDetail/
│   │   └── ProductDetailPage.tsx                 # Vista detalle completa
│   └── ProductEdit/
│       └── ProductEditPage.tsx                   # Vista edición (reutiliza FormField)
├── features/
│   ├── productDetail/
│   │   └── useProductDetail.ts                   # Hook: fetch por id, loading, error
│   └── productEdit/
│       └── useProductEdit.ts                     # Hook: form pre-cargado, submit PUT, success
├── entities/
│   └── product/
│       └── productApi.ts                         # + getProductById() + updateProduct()
└── shared/
    ├── ui/
    │   └── FormField/FormField.tsx               # (existente, sin cambios)
    └── lib/
        └── productValidations.ts                 # (existente, sin cambios — todas las funciones disponibles)
```

---

#### Componentes y páginas nuevos

| Componente | Archivo | Props | Descripción |
|------------|---------|-------|-------------|
| `ProductDetailPage` | `pages/ProductDetail/ProductDetailPage.tsx` | ninguna (lee `id` del router) | Muestra campos del producto, logo como Image, botón Editar |
| `ProductEditPage` | `pages/ProductEdit/ProductEditPage.tsx` | ninguna (lee `id` del router) | Formulario de edición con ID disabled, botones Enviar/Reiniciar |

#### Páginas nuevas (router)

| Página | Archivo | Ruta |
|--------|---------|------|
| Detalle | `app/products/[id]/index.tsx` | `/products/:id` |
| Edición | `app/products/[id]/edit.tsx` | `/products/:id/edit` |

#### Hooks nuevos

| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useProductDetail` | `features/productDetail/useProductDetail.ts` | `{ product, loading, error }` | Llama `getProductById(id)`, maneja loading/error |
| `useProductEdit` | `features/productEdit/useProductEdit.ts` | `{ form, errors, networkError, successMessage, loading, handleChange, handleSubmit, handleReset }` | Pre-carga form con datos del producto, valida, llama updateProduct, navega al detalle tras éxito |

#### Funciones API nuevas (extensión de `productApi.ts`)

| Función | Endpoint | Descripción |
|---------|----------|-------------|
| `getProductById(id)` | `GET /bp/products/:id` | Retorna `Product`. Fallback: `getProducts()` filtrado |
| `updateProduct(id, data)` | `PUT /bp/products/:id` | Actualiza y retorna el `Product` actualizado |

---

#### Layout de `ProductDetailPage`

```
SafeAreaView (backgroundColor: appBackground #F5F5F5)
└── ScrollView
    └── View card (white, borderRadius: xl=16, padding: xl=24, shadow: card)
        ├── Header (CashIcon 20px + "BANCO" 17px bold — igual que otras pantallas)
        ├── [loading]  → ActivityIndicator centrado
        ├── [error]    → Text error 14px rojo centrado
        └── [producto cargado]
            ├── Image logo (width: 100%, height: 180px, resizeMode: cover, borderRadius: md=8, marginBottom: xl=24)
            │     └── fallback: View surface con Text "Sin logo" centrado si logo vacío
            ├── DetailField — ID (solo lectura)
            ├── DetailField — Nombre (solo lectura)
            ├── DetailField — Descripción (solo lectura)
            ├── DetailField — Fecha de Liberación (solo lectura)
            ├── DetailField — Fecha de Revisión (solo lectura)
            └── TouchableOpacity "Editar" (botón primary amarillo, marginTop: xxl=32)
```

#### Componente interno `DetailField` (local en `ProductDetailPage`)

```
label:   14px, bold, color primary, marginBottom: xs=4
value:   15px, normal, color textPrimary, paddingVertical: sm=8,
         borderBottomWidth: 1, borderBottomColor: itemBorder (#EEEEEE),
         marginBottom: lg=16
```

#### Layout de `ProductEditPage`

```
SafeAreaView (backgroundColor: appBackground #F5F5F5)
└── KeyboardAvoidingView (behavior: padding/height según Platform)
    └── ScrollView (keyboardShouldPersistTaps: handled)
        └── View card (white, borderRadius: xl=16, padding: xl=24, shadow: card)
            ├── Header (CashIcon 20px + "BANCO" 17px bold)
            ├── FormField — ID (editable={false}, backgroundColor: surface)
            ├── FormField — Nombre (editable)
            ├── FormField — Descripción (editable)
            ├── FormField — Logo / URL (editable, keyboardType: url)
            ├── FormField — Fecha de Liberación (editable, dateMode)
            ├── FormField — Fecha de Revisión (editable={false})
            ├── Text successMessage (banner azul marino) — visible si successMessage
            ├── Text networkError (rojo) — visible si networkError
            └── View botones (row, gap: md=12, marginTop: xxl=32)
                ├── TouchableOpacity "Reiniciar" (surface, texto primary)
                └── TouchableOpacity "Enviar" (accent amarillo, texto primary)
```

> El banner de éxito reutiliza el mismo estilo que `ProductRegistrationPage` (`successBanner`, `successText`, `successSub`). Considerar extraer a `shared/ui/SuccessBanner/SuccessBanner.tsx` si se repite un tercer uso.

#### Especificación visual del botón "Editar" (detalle)

```
backgroundColor: accent #FFD200
borderRadius: sm=4px
paddingVertical: lg=16px
alignItems: center
marginTop: xxl=32px
texto: 16px, bold, color primary #0F265C
```

---

### Arquitectura y Dependencias

- **Paquetes nuevos:** ninguno.
- **Reutilizado de SPEC-002:**
  - `shared/ui/FormField/FormField.tsx` — sin cambios
  - `shared/lib/productValidations.ts` — `validateName`, `validateDescription`, `validateLogo`, `isValidReleaseDate`, `calculateReviewDate`, `maskDateInput`
  - `features/productRegistration/productRegistration.types.ts` — `ProductFormData`, `ProductFormErrors`
- **Archivos modificados:**
  - `entities/product/productApi.ts` — agregar `getProductById()` y `updateProduct()`.
  - `app/products/[id].tsx` — **eliminar** y reemplazar por `app/products/[id]/index.tsx`.
- **Impacto en SPEC-001:** ninguno directo. `ProductListPage` ya navega a `/products/:id`.

### Notas de Implementación

1. **Migración de ruta:** eliminar `app/products/[id].tsx` y crear `app/products/[id]/index.tsx` con el mismo export. Expo Router resolverá la ruta igual.
2. **Carga del producto en edición:** `useProductEdit` recibe el `id` del router y llama `getProductById(id)` para obtener los datos iniciales del formulario. No depende de estado global.
3. **Reset en edición:** el botón "Reiniciar" restaura los valores originales del producto (los que se cargaron al entrar), no un formulario vacío.
4. **No verificar ID en edición:** `useProductEdit` nunca llama `verifyProductId` — el ID está fijo.
5. **Navegación tras éxito:** `router.replace(`/products/${id}`)` — vuelve al detalle (no a la lista).
6. **Image fallback:** si `product.logo` está vacío o la URL falla, mostrar un `View` con `backgroundColor: surface` y texto "Sin logo".
7. **`updateProduct` payload:** enviar solo `{ name, description, logo, date_release, date_revision }` — sin `id` en el body.
8. **Fecha de revisión en edición:** igual que en registro — recalcular en `handleChange` cuando cambia `date_release`.

---

## 3. LISTA DE TAREAS

> Checklist accionable. Marcar cada ítem (`[x]`) al completarlo.

### Frontend

#### Implementación

**Entities — API**
- [ ] Agregar `getProductById(id: string): Promise<Product>` en `productApi.ts`
- [ ] Agregar `updateProduct(id: string, data: UpdateProductPayload): Promise<Product>` en `productApi.ts`
- [ ] Definir `UpdateProductPayload` (name, description, logo, date_release, date_revision — sin id)

**Migración de ruta**
- [ ] Crear directorio `app/products/[id]/`
- [ ] Crear `app/products/[id]/index.tsx` — exportar `ProductDetailPage`
- [ ] Eliminar `app/products/[id].tsx` (placeholder actual)

**Features — Hooks**
- [ ] Crear `features/productDetail/useProductDetail.ts`:
  - [ ] Recibe `id: string`
  - [ ] Llama `getProductById(id)` en `useEffect`
  - [ ] Expone `{ product, loading, error }`
- [ ] Crear `features/productEdit/useProductEdit.ts`:
  - [ ] Recibe `id: string`
  - [ ] Inicializa form con datos del producto via `getProductById(id)`
  - [ ] `handleChange` — igual a `useProductRegistration` pero sin debounce de ID
  - [ ] `handleChange('date_release', v)` — recalcula `date_revision`
  - [ ] `handleReset()` — restaura datos originales del producto (no INITIAL_FORM vacío)
  - [ ] `handleSubmit()` — valida campos, llama `updateProduct`, muestra success, navega a detalle
  - [ ] Expone `{ form, errors, networkError, successMessage, loading, handleChange, handleSubmit, handleReset }`

**Pages**
- [ ] Crear `pages/ProductDetail/ProductDetailPage.tsx`:
  - [ ] Header (CashIcon + "BANCO")
  - [ ] Loading y error states
  - [ ] Image del logo con fallback
  - [ ] 5 `DetailField` (ID, nombre, descripción, fecha liberación, fecha revisión)
  - [ ] Botón "Editar" → `router.push(`/products/${id}/edit`)`
- [ ] Crear `pages/ProductEdit/ProductEditPage.tsx`:
  - [ ] Header (CashIcon + "BANCO")
  - [ ] `KeyboardAvoidingView` + `ScrollView`
  - [ ] 6 `FormField` (ID disabled, resto editables, fecha con `dateMode`)
  - [ ] Banner `successMessage` (azul marino)
  - [ ] Texto `networkError` (rojo)
  - [ ] Botones "Reiniciar" y "Enviar" en fila

**App Router**
- [ ] Crear `app/products/[id]/edit.tsx` — exportar `ProductEditPage`

---

#### Tests Frontend

**`entities/product/productApi`**
- [ ] `getProductById` retorna el producto cuando la API responde 200
- [ ] `getProductById` usa fallback de `getProducts()` si falla el endpoint directo
- [ ] `updateProduct` llama PUT con el payload correcto (sin id en body)
- [ ] `updateProduct` retorna el producto actualizado

**`features/productDetail/useProductDetail`**
- [ ] Llama `getProductById` con el id correcto al montar
- [ ] Expone `loading: true` mientras carga
- [ ] Expone `product` tras carga exitosa
- [ ] Expone `error` si la API falla

**`features/productEdit/useProductEdit`**
- [ ] Inicializa el form con los datos del producto
- [ ] Campo `id` está presente pero no se envía en el PUT
- [ ] `handleChange('name', v)` actualiza el campo
- [ ] `handleChange('date_release', v)` recalcula `date_revision`
- [ ] `handleReset()` restaura datos originales (no INITIAL_FORM vacío)
- [ ] `handleSubmit()` con campos inválidos setea errores
- [ ] `handleSubmit()` con datos válidos llama `updateProduct`
- [ ] `handleSubmit()` setea `successMessage` y navega al detalle tras éxito
- [ ] `handleSubmit()` setea `networkError` si `updateProduct` lanza error

**`pages/ProductDetail/ProductDetailPage`**
- [ ] Muestra ActivityIndicator mientras `loading` es true
- [ ] Muestra mensaje de error cuando `error` está definido
- [ ] Renderiza todos los campos cuando el producto está cargado
- [ ] Botón "Editar" navega a la ruta de edición

**`pages/ProductEdit/ProductEditPage`**
- [ ] Renderiza 6 FormFields con datos del producto
- [ ] Campo ID no es editable
- [ ] Botón "Reiniciar" llama `handleReset`
- [ ] Botón "Enviar" llama `handleSubmit`
- [ ] Muestra `successMessage` cuando está definido
- [ ] Muestra `networkError` cuando está definido

---

### QA

- [ ] Ejecutar `/gherkin-case-generator` → criterios CRITERIO-3.1 a CRITERIO-3.8
- [ ] Ejecutar `/risk-identifier` → clasificación ASD de riesgos
- [ ] Validar que el campo ID no puede editarse en modo edición
- [ ] Validar que el reset en edición restaura valores originales (no vacío)
- [ ] Validar que `verifyProductId` NO se llama en el flujo de edición
- [ ] Validar la navegación post-éxito: debe llegar al detalle, no a la lista
- [ ] Validar el fallback del logo (URL inválida o vacía)
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
