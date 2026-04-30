# HU-03: Product Edit and Detail

## Title

Product Edit and Detail

## User Story

Como administrador de productos, quiero visualizar la información detallada y editar los datos de un producto, para corregir o actualizar la información de servicios existentes.

## Acceptance Criteria

#### Scenario: Mostrar detalle del producto
**Given** el usuario ha seleccionado un producto
**When** la pantalla de detalle se carga
**Then** muestra el ID del producto
**And** muestra el nombre del producto
**And** muestra la descripción del producto
**And** muestra el logo (imagen) del producto
**And** muestra la fecha de liberación
**And** muestra la fecha de revisión

#### Scenario: Acceder al modo edición
**Given** el usuario está en la pantalla de detalle
**When** presiona el botón "Editar"
**Then** redirige al formulario de edición
**And** carga los datos actuales del producto en el formulario

#### Scenario: Restricción de ID en modo edición
**Given** el formulario está en modo edición
**When** se carga con datos existentes
**Then** el campo ID está deshabilitado
**And** el usuario no puede modificar el ID

#### Scenario: Validaciones en modo edición
**Given** el formulario de edición tiene datos cargados
**When** el usuario modifica los campos y envía
**Then** aplica las mismas validaciones que HU-02 (product-registration)
**And** Nombre: requerido, 5-100 caracteres
**And** Descripción: requerida, 10-200 caracteres
**And** Logo: requerido (URL válida)
**And** Fecha Liberación: requerida, >= fecha actual
**And** Fecha Revisión: cálculo automático (liberación + 1 año)

#### Scenario: Actualización exitosa
**Given** todos los campos son válidos en modo edición
**When** el usuario presiona "Enviar"
**Then** actualiza el producto mediante PUT /bp/products/{id}
**And** muestra mensaje de confirmación
**And** regresa a la pantalla de detalle