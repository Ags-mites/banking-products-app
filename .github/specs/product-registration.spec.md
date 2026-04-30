---
id: SPEC-002
status: IN_PROGRESS
feature: product-registration
created: 2026-04-30
updated: 2026-04-30
author: spec-generator
version: "1.1"
related-specs:
  - SPEC-001 (product-list-search)
---

# Spec: Registro de Productos Financieros

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Formulario de registro de nuevos productos financieros con validaciones síncronas y asíncronas. El administrador completa seis campos (ID, nombre, descripción, logo, fecha de liberación y fecha de revisión calculada automáticamente), recibe feedback visual por campo en caso de error, y al enviar el formulario el producto se persiste mediante POST /bp/products.

### Requerimiento de Negocio
El requerimiento original se encuentra en `.github/requirements/product-registration.md` (HU-02: Registro de Productos Financieros).

### Historia de Usuario

#### HU-02: Registrar un nuevo producto financiero

```
Como:        Administrador de productos
Quiero:      Un formulario de registro con validaciones automáticas
Para:        Asegurar que los nuevos servicios cumplen con las reglas de negocio del banco

Prioridad:   Alta
Estimación:  L
Dependencias:
  - SPEC-001 (product-list-search) — la pantalla de lista ya existe y puede navegar al formulario
  - API GET /bp/products/verification/:id disponible en http://localhost:3002
  - API POST /bp/products disponible en http://localhost:3002
Capa:        Frontend
```

---

### Criterios de Aceptación — HU-02

#### Happy Path

```gherkin
CRITERIO-2.1: Envío exitoso del formulario
  Dado que: todos los campos del formulario son válidos
    Y: el ID verificado está disponible en el servidor
  Cuando: el usuario presiona el botón "Enviar"
  Entonces: el sistema llama a POST /bp/products con los datos del formulario
    Y: muestra un Alert nativo de React Native con el título "¡Registro exitoso!" y un botón "Aceptar"
    Y: al confirmar el Alert, la app navega de regreso a la lista de productos (router.back())
    Y: la lista refleja el nuevo producto registrado

CRITERIO-2.2: Cálculo automático de fecha de revisión
  Dado que: el usuario ingresa una fecha de liberación válida
  Cuando: el sistema procesa el valor del campo fecha de liberación
  Entonces: la fecha de revisión se establece exactamente un año después de la fecha de liberación
    Y: el campo fecha de revisión es de solo lectura (no editable por el usuario)

CRITERIO-2.3: Reiniciar formulario
  Dado que: el formulario tiene uno o más campos con valores
  Cuando: el usuario presiona el botón "Reiniciar"
  Entonces: todos los campos del formulario se vacían
    Y: todos los mensajes de error desaparecen
    Y: todos los bordes rojos de campos inválidos desaparecen
```

#### Validaciones de campos

```gherkin
CRITERIO-2.4: Validación de ID — requerido y longitud
  Dado que: el campo ID está vacío o tiene menos de 3 o más de 10 caracteres
  Cuando: el usuario intenta enviar el formulario
  Entonces: el sistema muestra el mensaje "ID no válido" debajo del campo ID
    Y: el campo ID muestra un borde rojo

CRITERIO-2.5: Validación de ID — disponibilidad en servidor
  Dado que: el campo ID tiene entre 3 y 10 caracteres (formato válido)
  Cuando: el usuario ingresa un valor en el campo ID
  Entonces: el sistema consulta GET /bp/products/verification/:id
    Y: si el ID ya existe, muestra el mensaje "ID no disponible" debajo del campo
    Y: si el ID está disponible, no muestra ningún error de disponibilidad

CRITERIO-2.6: Validación de Nombre — requerido y longitud mínima
  Dado que: el campo nombre está vacío o tiene menos de 5 caracteres
  Cuando: el usuario intenta enviar el formulario
  Entonces: el sistema muestra el mensaje "Nombre no válido" debajo del campo
    Y: el campo nombre muestra un borde rojo

CRITERIO-2.7: Validación de Descripción — requerida y longitud mínima
  Dado que: el campo descripción está vacío o tiene menos de 10 caracteres
  Cuando: el usuario intenta enviar el formulario
  Entonces: el sistema muestra el mensaje "Descripción no válida" debajo del campo
    Y: el campo descripción muestra un borde rojo

CRITERIO-2.8: Validación de Logo — URL requerida y formato válido
  Dado que: el campo logo está vacío o no tiene formato de URL válida
  Cuando: el usuario intenta enviar el formulario
  Entonces: el sistema muestra el mensaje "URL de logo requerida" debajo del campo
    Y: el campo logo muestra un borde rojo

CRITERIO-2.9: Validación de Fecha de Liberación — requerida y no anterior a hoy
  Dado que: el campo fecha de liberación está vacío o es anterior a la fecha actual
  Cuando: el usuario intenta enviar el formulario
  Entonces: el sistema muestra el mensaje "Fecha de liberación debe ser igual o posterior a hoy"
    Y: el campo fecha de liberación muestra un borde rojo
```

#### Feedback visual de error

```gherkin
CRITERIO-2.10: Feedback visual por campo
  Dado que: un campo no cumple las reglas de validación
  Cuando: el usuario intenta enviar el formulario
  Entonces: ese campo específico muestra un borde rojo
    Y: se muestra un mensaje descriptivo debajo del campo afectado
    Y: los campos válidos no se ven afectados
```

---

### Reglas de Negocio

| # | Regla |
|---|-------|
| RN-1 | El ID debe tener entre 3 y 10 caracteres (inclusivo). |
| RN-2 | El ID debe ser único: verificar con `GET /bp/products/verification/:id` antes de enviar. |
| RN-3 | El Nombre debe tener entre 5 y 100 caracteres. |
| RN-4 | La Descripción debe tener entre 10 y 200 caracteres. |
| RN-5 | El Logo debe ser una URL válida (contiene `://` o inicia con `http`). |
| RN-6 | La Fecha de Liberación debe ser igual o posterior a la fecha actual (sin hora). |
| RN-7 | La Fecha de Revisión = Fecha de Liberación + exactamente 1 año. No editable. |
| RN-8 | La validación de longitud/formato se ejecuta al intentar enviar (on-submit). |
| RN-9 | La verificación de disponibilidad del ID se ejecuta en tiempo real (on-change), solo cuando el ID tiene formato válido (3-10 chars). |
| RN-10 | El formulario solo llama a `POST /bp/products` si todas las validaciones (incluyendo disponibilidad del ID) pasan. |
| RN-11 | El botón "Reiniciar" no requiere confirmación. Limpia campos y errores inmediatamente. |
| RN-12 | La llamada a `verifyProductId` debe aplicar un debounce de mínimo 500ms para evitar saturar la API mientras el usuario escribe. |
| RN-13 | La pantalla del formulario debe envolver el contenido en `KeyboardAvoidingView` para asegurar que los campos inferiores y los botones sean visibles cuando el teclado está activo en cualquier dispositivo. |
| RN-14 | Los campos de fecha usan `keyboardType="numeric"` y aplican una máscara de entrada que auto-inserta guiones al llegar al carácter 4 (YYYY-) y 7 (YYYY-MM-). |
| RN-15 | Si la llamada a la API falla por error de red (timeout, servidor apagado), el hook expone un `networkError` y la pantalla muestra un mensaje de error global visible sobre los botones. |

---

## 2. DISEÑO

### Modelos de Datos

#### Entidades afectadas

| Entidad | Almacén | Cambios | Descripción |
|---------|---------|---------|-------------|
| `Product` | API externa `/bp/products` | Ninguno al tipo existente | Producto financiero a registrar |
| `ProductFormData` | Estado local (hook) | Nueva | Datos del formulario de registro |
| `ProductFormErrors` | Estado local (hook) | Nueva | Errores de validación por campo |

#### Tipo existente `Product` (en `entities/product/product.types.ts`) — sin cambios

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  date_release?: string;  // ISO 8601: YYYY-MM-DD
  date_revision?: string; // ISO 8601: YYYY-MM-DD
}
```

#### Nuevos tipos locales (en `features/productRegistration/productRegistration.types.ts`)

```typescript
interface ProductFormData {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;   // YYYY-MM-DD
  date_revision: string;  // YYYY-MM-DD — calculado, solo lectura
}

interface ProductFormErrors {
  id?: string;
  name?: string;
  description?: string;
  logo?: string;
  date_release?: string;
  date_revision?: string;
}
```

#### Valores iniciales del formulario

```typescript
const INITIAL_FORM: ProductFormData = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};
```

---

### API Endpoints

#### GET /bp/products/verification/:id
- **Descripción:** Verifica si un ID de producto ya existe en el sistema.
- **Base URL:** `http://localhost:3002`
- **Path param:** `id` — el ID a verificar
- **Auth requerida:** no
- **Response 200 (ID disponible):**
  ```json
  { "message": "ID disponible" }
  ```
- **Response 200 / 400 (ID ya existe):** el servidor retorna error o mensaje indicando que el ID ya fue registrado.
  > Nota: confirmar código HTTP exacto contra la API real durante implementación.
- **Uso:** Se llama en `useProductRegistration` al cambiar el campo `id` (cuando tiene formato válido).

#### POST /bp/products
- **Descripción:** Crea un nuevo producto financiero.
- **Base URL:** `http://localhost:3002`
- **Auth requerida:** no
- **Request body:**
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "date_release": "YYYY-MM-DD",
    "date_revision": "YYYY-MM-DD"
  }
  ```
- **Response 201:**
  ```json
  {
    "message": "Product added successfully",
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
- **Response 400:** datos inválidos o ID duplicado.
- **Response 500:** error interno del servidor.
- **Uso:** Se llama solo cuando todas las validaciones pasan.

---

### Diseño Frontend

#### Estructura FSD

```
banking-products-app/
├── app/
│   └── products/
│       └── register.tsx                          # Ruta /products/register (Expo Router)
├── pages/
│   └── ProductRegistration/
│       └── ProductRegistrationPage.tsx           # Vista principal — layout del formulario
├── features/
│   └── productRegistration/
│       ├── useProductRegistration.ts             # Hook: estado, validaciones, submit, reset
│       └── productRegistration.types.ts          # ProductFormData, ProductFormErrors
├── entities/
│   └── product/
│       ├── product.types.ts                      # (existente, sin cambios)
│       └── productApi.ts                         # + verifyProductId() + createProduct()
└── shared/
    ├── ui/
    │   └── FormField/
    │       └── FormField.tsx                     # Input con label, error y estado visual
    └── lib/
        └── productValidations.ts                 # validateId, validateName, validateDescription,
                                                  # validateLogo, isValidReleaseDate,
                                                  # calculateReviewDate
```

---

#### Componentes nuevos

| Componente | Archivo | Props | Descripción |
|------------|---------|-------|-------------|
| `FormField` | `shared/ui/FormField/FormField.tsx` | `label, value, onChangeText, error?, placeholder?, editable?, keyboardType?, dateMode?` | Input con etiqueta superior, borde rojo en error y mensaje de error debajo. `dateMode=true` activa la máscara YYYY-MM-DD. |
| `ProductRegistrationPage` | `pages/ProductRegistration/ProductRegistrationPage.tsx` | ninguna (consume hook) | Formulario completo con 6 campos, botones Enviar y Reiniciar, KeyboardAvoidingView y error global de red |

#### Página nueva

| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `ProductRegistrationPage` | `app/products/register.tsx` | `/products/register` | no |

#### Hook y State

| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useProductRegistration` | `features/productRegistration/useProductRegistration.ts` | `{ form, errors, networkError, idAvailable, loading, handleChange, handleSubmit, handleReset }` | Estado del formulario, validaciones on-submit, verificación de ID on-change (debounce 500ms), submit con Alert + router.back(), reset, y error global de red |

#### Funciones de API (extensión de `productApi.ts`)

| Función | Endpoint | Descripción |
|---------|----------|-------------|
| `verifyProductId(id)` | `GET /bp/products/verification/:id` | Retorna `true` si el ID está disponible, `false` si ya existe |
| `createProduct(data)` | `POST /bp/products` | Crea el producto; retorna el producto creado |

#### Funciones de validación (en `shared/lib/productValidations.ts`)

| Función | Retorna | Lógica |
|---------|---------|--------|
| `validateId(id)` | `string \| undefined` | Error si vacío o < 3 o > 10 chars |
| `validateName(name)` | `string \| undefined` | Error si vacío o < 5 chars |
| `validateDescription(desc)` | `string \| undefined` | Error si vacío o < 10 chars |
| `validateLogo(url)` | `string \| undefined` | Error si vacío o no contiene `://` |
| `isValidReleaseDate(date)` | `string \| undefined` | Error si vacío o anterior a hoy (comparar YYYY-MM-DD) |
| `calculateReviewDate(date)` | `string` | Retorna la fecha + 1 año en formato YYYY-MM-DD |
| `maskDateInput(value, prev)` | `string` | Aplica máscara YYYY-MM-DD: solo dígitos, inserta `-` al pos 4 y 7, limita a 10 chars |

---

#### Layout del formulario (`ProductRegistrationPage`)

```
SafeAreaView (backgroundColor: appBackground #F5F5F5)
└── KeyboardAvoidingView (flex: 1, behavior: 'padding' en iOS / 'height' en Android)
    └── ScrollView (keyboardShouldPersistTaps: 'handled')
        └── View card (backgroundColor: white, borderRadius: xl=16, padding: xl=24, shadow: card)
            ├── Header (igual que ProductListPage — CashIcon 20px + "BANCO" 17px bold)
            ├── FormField — ID (editable, keyboardType default)
            ├── FormField — Nombre (editable)
            ├── FormField — Descripción (editable, multiline opcional)
            ├── FormField — Logo / URL (editable, keyboardType url)
            ├── FormField — Fecha de Liberación (editable, keyboardType numeric, máscara YYYY-MM-DD)
            ├── FormField — Fecha de Revisión (no editable, backgroundColor: surface #F4F6F9)
            ├── Text networkError (14px, color error, textAlign center) — visible solo si networkError
            └── View botones (row, gap entre botones)
                ├── TouchableOpacity "Reiniciar" (botón secundario)
                └── TouchableOpacity "Enviar" (botón primary amarillo)
```

#### Especificación visual de `FormField`

```
label:
  fontSize: 14, fontWeight 'bold', color primary #0F265C
  marginBottom: 4px (spacing.xs)

input:
  height: 44px
  borderWidth: 1
  borderColor: normal → #E0E0E0 | error → #D32F2F
  borderRadius: 4px (borderRadius.sm)
  paddingHorizontal: 12px (spacing.md)
  fontSize: 15
  color: textPrimary #2C3E50
  backgroundColor: editable → white | no editable → surface #F4F6F9
  marginBottom: 4px cuando hay error, 16px (spacing.lg) cuando no

errorText:
  fontSize: 12, color error #D32F2F
  marginBottom: 16px (spacing.lg)
```

#### Especificación visual de botones

```
Reiniciar (secundario):
  flex: 1
  backgroundColor: surface #F4F6F9
  borderRadius: 4px (borderRadius.sm)
  paddingVertical: 16px (spacing.lg)
  texto: 16px, fontWeight 'bold', color primary #0F265C

Enviar (primary):
  flex: 1
  backgroundColor: accent #FFD200
  borderRadius: 4px (borderRadius.sm)
  paddingVertical: 16px (spacing.lg)
  texto: 16px, fontWeight 'bold', color primary #0F265C

Contenedor botones:
  flexDirection: 'row'
  gap: 12px (spacing.md)
  marginTop: 32px (spacing.xxl)
```

---

### Arquitectura y Dependencias

- **Paquetes nuevos:** ninguno — Axios ya disponible; `StyleSheet` y RN core disponibles.
- **Servicios externos:**
  - `GET http://localhost:3002/bp/products/verification/:id`
  - `POST http://localhost:3002/bp/products`
- **Archivos modificados:**
  - `entities/product/productApi.ts` — agregar `verifyProductId()` y `createProduct()`.
- **Navegación:** desde `ProductListPage` el botón "Agregar" navega a `/products/register` via `router.push('/products/register')`.
- **Impacto en SPEC-001:** conectar el botón "Agregar" de `ProductListPage` con la ruta nueva.

---

### Notas de Implementación

1. `date_release` y `date_revision` se manejan como strings `YYYY-MM-DD`. No usar `Date` objects en el estado del formulario.
2. `calculateReviewDate` suma 1 año al año de `date_release`: `new Date(date_release).setFullYear(year + 1)` → formatear a `YYYY-MM-DD`.
3. La verificación del ID (`verifyProductId`) se llama en `handleChange` solo cuando el campo `id` tiene entre 3 y 10 caracteres. Evitar llamadas con IDs inválidos.
4. El submit llama a `verifyProductId` nuevamente antes del `POST` si `idAvailable` no está confirmado, para evitar race conditions.
5. El campo Fecha de Revisión usa `editable={false}` y `backgroundColor: surface` para indicar visualmente que es de solo lectura.
6. **Gestión de teclado:** Envolver la pantalla con `KeyboardAvoidingView` usando `behavior="padding"` en iOS y `behavior="height"` en Android (detectar con `Platform.OS`). El `ScrollView` debe llevar `keyboardShouldPersistTaps="handled"` para que los taps en botones funcionen aunque el teclado esté abierto.
7. Los errores se limpian campo por campo al corregir el valor (on-change) o todos juntos al presionar "Reiniciar".
8. **Debounce del ID:** implementar con `useRef` + `clearTimeout`/`setTimeout` de 500ms dentro de `handleChange` para el campo `id`. No usar librerías externas de debounce.
9. **Máscara de fecha:** `maskDateInput(value, prev)` en `shared/lib/productValidations.ts`. Lógica: extraer solo dígitos del input, insertar `-` automáticamente en las posiciones 4 y 6 (sobre los dígitos limpios), retornar el string resultante limitado a 10 caracteres. Usar `prev` para detectar si el usuario está borrando (no insertar guión al borrar). Llamar desde `handleChange` antes de actualizar el estado cuando el campo es `date_release`.
10. **Navegación post-éxito:** tras recibir respuesta exitosa de `createProduct`, llamar `Alert.alert('¡Registro exitoso!', 'El producto fue agregado correctamente.', [{ text: 'Aceptar', onPress: () => router.back() }])`. No limpiar el formulario antes del Alert para evitar parpadeo visual; la navegación lo descarta.
11. **Error de red global:** capturar el `catch` de `verifyProductId` y `createProduct` en el hook y setear `networkError: string`. La pantalla muestra este mensaje en texto rojo sobre los botones. Limpiar `networkError` al iniciar cualquier nueva llamada.

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.

### Frontend

#### Implementación

**Shared — Validaciones**
- [x] Crear `shared/lib/productValidations.ts`:
  - [x] `validateId(id)` — requerido, 3-10 chars
  - [x] `validateName(name)` — requerido, min 5 chars
  - [x] `validateDescription(desc)` — requerido, min 10 chars
  - [x] `validateLogo(url)` — requerido, URL válida
  - [x] `isValidReleaseDate(date)` — requerido, >= hoy
  - [x] `calculateReviewDate(date)` — fecha + 1 año, formato YYYY-MM-DD
  - [x] `maskDateInput(value, prev)` — máscara YYYY-MM-DD: solo dígitos, auto-guiones en pos 4 y 7, max 10 chars

**Shared — UI**
- [x] Crear `shared/ui/FormField/FormField.tsx`:
  - [x] Label superior (14px bold, color primary)
  - [x] TextInput con borde rojo en error y gris normal
  - [x] Mensaje de error debajo del campo (12px, color error)
  - [x] Prop `editable` controla color de fondo (white vs surface)
  - [x] Prop `dateMode` activa `keyboardType="numeric"` y aplica `maskDateInput` internamente en `onChangeText`

**Entities — API**
- [x] Extender `entities/product/productApi.ts`:
  - [x] `verifyProductId(id: string): Promise<boolean>`
  - [x] `createProduct(data: ProductFormData): Promise<Product>`

**Features — Hook**
- [x] Crear `features/productRegistration/productRegistration.types.ts` (ProductFormData, ProductFormErrors)
- [x] Crear `features/productRegistration/useProductRegistration.ts`:
  - [x] Estado inicial del formulario (INITIAL_FORM)
  - [x] `handleChange(field, value)` — actualiza form, recalcula date_revision si cambia date_release
  - [x] Verificación de ID on-change con debounce 500ms (useRef + setTimeout/clearTimeout), solo si 3-10 chars
  - [x] `handleSubmit()` — valida todos los campos, verifica ID, llama createProduct, muestra Alert y navega con router.back()
  - [x] `handleReset()` — restaura INITIAL_FORM, limpia errores y networkError
  - [x] Estado `loading` durante submit y verificación de ID
  - [x] Estado `networkError` para errores de red en verifyProductId y createProduct

**Pages**
- [x] Crear `pages/ProductRegistration/ProductRegistrationPage.tsx`:
  - [x] Header igual al de ProductListPage (CashIcon + "BANCO")
  - [x] 6 FormFields según especificación visual (Fecha de Liberación con `dateMode`)
  - [x] Botones "Reiniciar" y "Enviar" en fila
  - [x] `KeyboardAvoidingView` como contenedor externo (`behavior="padding"` iOS / `"height"` Android)
  - [x] `ScrollView` con `keyboardShouldPersistTaps="handled"` dentro del KeyboardAvoidingView
  - [x] Texto de error global `networkError` visible sobre los botones (14px, color error)

**App Router**
- [x] Crear `app/products/register.tsx` — exportar `ProductRegistrationPage`
- [x] Actualizar `pages/ProductList/ProductListPage.tsx` — conectar botón "Agregar" a `router.push('/products/register')`

---

#### Tests Frontend

**`shared/lib/productValidations`**
- [ ] `validateId` retorna error si vacío
- [ ] `validateId` retorna error si < 3 chars
- [ ] `validateId` retorna error si > 10 chars
- [ ] `validateId` retorna undefined si 3-10 chars válidos
- [ ] `validateName` retorna error si vacío o < 5 chars
- [ ] `validateDescription` retorna error si vacío o < 10 chars
- [ ] `validateLogo` retorna error si vacío o sin `://`
- [ ] `isValidReleaseDate` retorna error si vacío o fecha pasada
- [ ] `isValidReleaseDate` retorna undefined si fecha >= hoy
- [ ] `calculateReviewDate` retorna fecha + 1 año en formato YYYY-MM-DD
- [ ] `maskDateInput` inserta guión después del 4to dígito
- [ ] `maskDateInput` inserta guión después del 7mo dígito
- [ ] `maskDateInput` no inserta guión cuando el usuario está borrando
- [ ] `maskDateInput` limita el resultado a 10 caracteres

**`shared/ui/FormField`**
- [ ] Renderiza label con el texto correcto
- [ ] Renderiza TextInput con el valor dado
- [ ] Muestra borde rojo y mensaje de error cuando `error` está definido
- [ ] Muestra borde gris cuando no hay error
- [ ] Input no editable cuando `editable={false}`

**`features/productRegistration/useProductRegistration`**
- [ ] Estado inicial tiene todos los campos vacíos y networkError vacío
- [ ] `handleChange('id', value)` actualiza el campo ID
- [ ] `handleChange('id', value)` dispara debounce de 500ms para verificar disponibilidad
- [ ] `handleChange('date_release', value)` recalcula `date_revision` automáticamente
- [ ] `handleReset()` restaura INITIAL_FORM, limpia errores y networkError
- [ ] `handleSubmit()` con campos vacíos setea todos los errores de campo
- [ ] `handleSubmit()` con datos válidos llama a `verifyProductId` y `createProduct`
- [ ] `handleSubmit()` setea error de ID cuando `verifyProductId` retorna false
- [ ] `handleSubmit()` muestra Alert y llama router.back() tras éxito de `createProduct`
- [ ] `handleSubmit()` setea networkError si `createProduct` lanza error de red

**`pages/ProductRegistration/ProductRegistrationPage`**
- [ ] Renderiza 6 campos de formulario
- [ ] Campo "Fecha de Revisión" no es editable
- [ ] Botón "Reiniciar" llama a handleReset
- [ ] Botón "Enviar" llama a handleSubmit
- [ ] Muestra errores por campo cuando la validación falla
- [ ] Muestra el texto de `networkError` sobre los botones cuando el estado lo tiene
- [ ] Contiene un `KeyboardAvoidingView` como contenedor externo

---

### QA

- [ ] Ejecutar skill `/gherkin-case-generator` → criterios CRITERIO-2.1 a CRITERIO-2.10
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Revisar cobertura de tests contra los 10 criterios de aceptación
- [ ] Validar que la verificación de ID no se dispara con IDs de formato inválido
- [ ] Validar comportamiento del formulario cuando `POST /bp/products` retorna error 400
- [ ] Validar que el campo Fecha de Revisión se actualiza en tiempo real al cambiar Fecha de Liberación
- [ ] Validar que la máscara de fecha no permite caracteres no numéricos
- [ ] Validar el comportamiento del formulario cuando el servidor está inaccesible (networkError visible)
- [ ] Validar que el Alert de éxito se muestra y que al confirmar navega al listado
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
