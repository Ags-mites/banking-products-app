# HU-01: Product List and Search

## Title

Product List and Search

## User Story

Como usuario de la aplicación bancaria, quiero visualizar el catálogo de productos financieros y realizar búsquedas por nombre, para gestionar y consultar la información de los servicios disponibles de manera ágil.

## Acceptance Criteria

#### Scenario: Cargar productos desde la API
**Given** la aplicación requiere la lista de productos
**When** el usuario abre la pantalla de lista de productos
**Then** el sistema obtiene los datos del endpoint GET /bp/products
**And** muestra todos los productos disponibles

#### Scenario: Mostrar producto con chevron
**Given** los productos se han cargado desde la API
**When** un producto se renderiza en la lista
**Then** muestra el nombre y el ID del producto
**And** muestra un ícono de chevron ">" a la derecha

#### Scenario: Búsqueda en tiempo real por nombre de producto
**Given** la lista de productos se está mostrando
**When** el usuario escribe en el campo de búsqueda
**Then** la lista se filtra en tiempo real coincidencia con el nombre del producto
**And** muestra solo los productos que contienen el término de búsqueda

#### Scenario: Mostrar contador de productos filtrados
**Given** los productos se muestran en la lista
**When** el usuario aplica un filtro de búsqueda
**Then** el sistema muestra la cantidad total de productos filtrados
**And** actualiza el contador a medida que el filtro cambia

#### Scenario: Navegar al detalle del producto
**Given** los productos se muestran en la lista
**When** el usuario presiona sobre un elemento de la lista
**Then** la aplicación navega a la pantalla de detalle del producto
**And** muestra la información completa del producto

#### Scenario: Resultados de búsqueda vacíos
**Given** la lista de productos se está mostrando
**When** el usuario busca un producto que no existe
**Then** el sistema muestra un mensaje de estado vacío
**And** muestra cero productos en el contador

#### Scenario: La búsqueda es insensible a mayúsculas
**Given** existen productos "Tarjeta de Crédito" y "Préstamo Personal"
**When** el usuario busca "tarjeta"
**Then** el sistema muestra "Tarjeta de Crédito" en los resultados

#### Scenario: Limpiar filtro de búsqueda
**Given** un filtro de búsqueda está aplicado
**When** el usuario limpia el campo de búsqueda
**Then** todos los productos se muestran nuevamente
**And** el contador muestra el total de productos