# HU-02: Registro de Productos Financieros

## Title

Registro de Productos Financieros

## User Story

Como administrador de productos, quiero un formulario de registro con validaciones automáticas, para asegurar que los nuevos servicios cumplen con las reglas de negocio del banco.

## Acceptance Criteria

#### Scenario: Validación de ID - Requerido y longitud
**Given** el campo de ID está vacío o tiene una longitud inválida
**When** el usuario intenta enviar el formulario
**Then** el sistema muestra un mensaje de error: "ID no válido"
**And** el campo muestra un borde rojo

#### Scenario: Validación de ID - Verificación de disponibilidad
**Given** el campo de ID tiene un valor válido (3-10 caracteres)
**When** el usuario ingresa un ID
**Then** el sistema verifica su disponibilidad mediante GET /bp/products/verification/:id
**And** si el ID ya existe, muestra un mensaje de error: "ID no disponible"

#### Scenario: Validación de Nombre - Requerido y longitud
**Given** el campo de nombre está vacío o tiene menos de 5 caracteres
**When** el usuario intenta enviar el formulario
**Then** el sistema muestra un mensaje de error: "Nombre no válido"
**And** el campo muestra un borde rojo

#### Scenario: Validación de Descripción - Requerido y longitud
**Given** el campo de descripción está vacío o tiene menos de 10 caracteres
**When** el usuario intenta enviar el formulario
**Then** el sistema muestra un mensaje de error: "Descripción no válida"
**And** el campo muestra un borde rojo

#### Scenario: Validación de Logo - URL requerida
**Given** el campo de logo está vacío o no es una URL válida
**When** el usuario intenta enviar el formulario
**Then** el sistema muestra un mensaje de error: "URL de logo requerida"
**And** el campo muestra un borde rojo

#### Scenario: Validación de Fecha de Liberación - Requerida y futura
**Given** la fecha de liberación está vacía o es anterior a la fecha actual
**When** el usuario intenta enviar el formulario
**Then** el sistema muestra un mensaje de error: "Fecha de liberación debe ser igual o posterior a hoy"
**And** el campo muestra un borde rojo

#### Scenario: Validación de Fecha de Revisión - Un año después
**Given** la fecha de liberación es válida
**When** el sistema calcula la fecha de revisión
**Then** la fecha de revisión se establece exactamente un año después de la fecha de liberación
**And** no es editable por el usuario

#### Scenario: Envío exitoso del formulario
**Given** todos los campos son válidos
**When** el usuario presiona el botón "Enviar"
**Then** el sistema guarda el producto mediante POST /bp/products
**And** muestra un mensaje de confirmación
**And** limpia todos los campos del formulario

#### Scenario: Reiniciar formulario
**Given** el formulario tiene campos llenos
**When** el usuario presiona el botón "Reiniciar"
**Then** todos los campos se limpian
**And** los mensajes de error desaparecen
**And** los bordes rojos desaparecen

#### Scenario: Feedback visual de error
**Given** un campo no cumple las reglas de validación
**When** el usuario intenta enviar el formulario
**Then** el campo muestra un borde rojo
**And** se muestra un mensaje descriptivo debajo del campo