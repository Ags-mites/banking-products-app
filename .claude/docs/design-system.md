# Banco Design System (React Native)

## 1. Visual Theme
Basado en los requerimientos UI del banco. Diseño limpio, corporativo, fondo blanco con acentos institucionales en azul marino y llamadas a la acción en amarillo.

## 2. Paleta de Colores

- **Primary (Textos principales, Header, Iconos):** `#0F265C` (Azul Marino)
- **Accent (Botón Principal):** `#FFD200` (Amarillo Banco)
- **Background (Fondo de pantallas):** `#FFFFFF`
- **Surface (Inputs deshabilitados, Botones secundarios):** `#F4F6F9`
- **Border / Dividers:** `#E0E0E0` (Gris claro)
- **Error / Danger:** `#D32F2F` (Rojo para botón eliminar y textos de error)
- **Text Muted:** `#757575` (Gris para placeholders y descripciones)

## 3. Tipografía (Core React Native)
No usar fuentes externas a menos que se requiera. Usar `System`.

- **Title (Header):** 20px, bold, color Primary.
- **Heading:** 24px, bold (Ej. ID del producto en detalle).
- **Body:** 16px, regular.
- **Caption (Error):** 12px, regular, color Error.

## 4. Componentes (Maquetación Pura - StyleSheet)

### Input
- Borde de 1px solid `#E0E0E0`
- padding 12px
- borderRadius 4px
- Etiqueta superior (14px, bold)
- En estado de error: border color cambia a `#D32F2F` y muestra label rojo abajo

### Button Primary
- Background `#FFD200`
- borderRadius 4px
- paddingVertical 16px
- texto centrado color `#0F265C`
- fontWeight 'bold'

### Button Secondary/Cancel
- Background `#F4F6F9`
- borderRadius 4px
- paddingVertical 16px
- texto centrado color `#0F265C`

### Button Danger
- Background `#D32F2F`
- color texto `#FFFFFF`

### Card/List Item
- Background `#FFFFFF`
- borderBottomWidth 1px border `#E0E0E0`
- padding 16px
- Ícono '>' (chevron) a la derecha

## 5. Restricciones Técnicas

- **PROHIBIDO:** Usar Tailwind, NativeBase, Tamagui, Styled Components o cualquier librería.
- **OBLIGATORIO:** Usar `StyleSheet.create` exclusivo de React Native.