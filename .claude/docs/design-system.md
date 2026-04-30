# Banco Design System (React Native)

## 1. Visual Theme
Diseño minimalista, corporativo tipo app bancaria. Fondo de pantalla gris muy claro con tarjetas blancas centradas, bordes redondeados y sombras sutiles. Acentos en azul marino institucional y llamadas a la acción en amarillo.

## 2. Paleta de Colores

- **Primary (Textos, Header, Iconos institucionales):** `#0F265C` (Azul Marino)
- **Text Primary (Nombres en lista):** `#2C3E50` (Gris oscuro / Azul suave)
- **Text Muted (Counters, placeholders):** `#757575`
- **Text Secondary (IDs, subtextos):** `#888888`
- **Accent (Botón Principal):** `#FFD200` (Amarillo Banco)
- **Background (Fondo de tarjetas y pantallas):** `#FFFFFF`
- **App Background (Fondo general de pantalla):** `#F5F5F5` (Gris muy claro)
- **Surface (Inputs deshabilitados, Botones secundarios):** `#F4F6F9`
- **Border / Dividers:** `#E0E0E0` (Gris claro)
- **Item Border (Separadores en listas):** `#EEEEEE` (Gris muy tenue)
- **Error / Danger:** `#D32F2F` (Rojo para botón eliminar y textos de error)

## 3. Tipografía (Core React Native)
No usar fuentes externas a menos que se requiera. Usar `System`.

- **Title (Header de página):** 17px, weight 600, color Primary.
- **Heading:** 24px, bold, color Primary.
- **Body:** 16px, regular.
- **Item Name:** 15px, weight 600, color Text Primary (`#2C3E50`).
- **Item ID / Subtitle:** 12–13px, regular, color Text Secondary (`#888`).
- **Caption (Error):** 12px, regular, color Error.
- **Label:** 14px, bold, color Primary.

## 4. Componentes (Maquetación Pura - StyleSheet)

### Screen Layout
- Fondo de pantalla: `#F5F5F5` (App Background)
- Contenedor principal (tarjeta blanca): `backgroundColor: #FFFFFF`, `borderRadius: 16`, sombra suave, `padding: 24`
- Sombra principal: `shadowOpacity: 0.08, shadowRadius: 8, elevation: 3`

### Header de Pantalla
- `flexDirection: 'row'`, `alignItems: 'center'`
- Ícono pequeño (Ionicons `business-outline`, 18px, color Primary) + margen derecho 8px
- Texto: 17px, weight 600, color Primary
- Separación inferior: 24px

### Input / Search Bar
- Altura: 44px
- `borderWidth: 1`, `borderColor: #E0E0E0`
- `borderRadius: 12`
- `paddingHorizontal: 12`
- `fontSize: 15`, color Text Primary
- Placeholder color: `#888888`
- Separación inferior: 24px

### List Card Container
- `backgroundColor: #FFFFFF`
- `borderRadius: 12`
- `borderWidth: 1`, `borderColor: #E0E0E0`
- `overflow: 'hidden'`
- Sombra sutil: `shadowOpacity: 0.05, shadowRadius: 4, elevation: 2`

### List Item (ProductItem)
- `flexDirection: 'row'`, `alignItems: 'center'`, `paddingHorizontal: 16`, `paddingVertical: 14`
- Nombre: 15px, weight 600, `#2C3E50`
- ID/subtexto: 12px, `#888888`, `marginTop: 4`
- Chevron `>`: 13px, `#CCCCCC`
- Separador entre ítems: `height: 1, backgroundColor: #EEEEEE, marginHorizontal: 16`
- Último elemento: sin separador (usar `ItemSeparatorComponent`)

### Button Primary
- Background `#FFD200`
- `borderRadius: 4`
- `paddingVertical: 16`
- Texto centrado color `#0F265C`, `fontWeight: 'bold'`

### Button Secondary/Cancel
- Background `#F4F6F9`
- `borderRadius: 4`, `paddingVertical: 16`
- Texto centrado color `#0F265C`

### Button Danger
- Background `#D32F2F`, color texto `#FFFFFF`

### Input de Formulario
- Borde de 1px solid `#E0E0E0`, `padding: 12`, `borderRadius: 4`
- Etiqueta superior (14px, bold)
- En estado de error: border color `#D32F2F`, label rojo abajo

## 5. Iconos
- Librería: `@expo/vector-icons` (Ionicons)
- Header de pantalla: `business-outline` (18px)
- Usar iconos solo donde la spec lo indique explícitamente

## 6. Restricciones Técnicas

- **PROHIBIDO:** Usar Tailwind, NativeBase, Tamagui, Styled Components o cualquier librería UI.
- **OBLIGATORIO:** Usar `StyleSheet.create` exclusivo de React Native.
- **TOKENS:** Siempre importar colores, spacing y borderRadius desde `shared/theme/designTokens.ts`.
