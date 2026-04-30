# Banco Design System (React Native)

## 1. Visual Theme
Diseño minimalista, corporativo tipo app bancaria. Fondo de pantalla gris muy claro con tarjeta blanca que ocupa toda la pantalla, bordes redondeados y sombras sutiles. Acentos en azul marino institucional y llamadas a la acción en amarillo.

## 2. Paleta de Colores

Todos los colores se importan desde `shared/theme/designTokens.ts` → `colors`.

| Token              | Valor       | Uso                                              |
|--------------------|-------------|--------------------------------------------------|
| `primary`          | `#0F265C`   | Textos principales, header, iconos, nombre de ítem |
| `textPrimary`      | `#2C3E50`   | Input text color, textos de cuerpo               |
| `textMuted`        | `#757575`   | ID/subtexto de ítem, texto vacío, contador        |
| `textSecondary`    | `#888888`   | Placeholder del input de búsqueda                 |
| `accent`           | `#FFD200`   | Botón principal (Agregar)                         |
| `background`       | `#FFFFFF`   | Fondo de cards y items                           |
| `appBackground`    | `#F5F5F5`   | Fondo general de pantalla (SafeAreaView)          |
| `surface`          | `#F4F6F9`   | Inputs deshabilitados, botones secundarios        |
| `border`           | `#E0E0E0`   | Bordes de inputs, cards, header separator         |
| `itemBorder`       | `#EEEEEE`   | Separadores entre ítems de lista                 |
| `error`            | `#D32F2F`   | Textos de error, botón eliminar                  |
| `white`            | `#FFFFFF`   | Alias explícito para backgrounds blancos         |
| `black`            | `#000000`   | Base de sombras                                  |

**Chevron del ítem:** `#CCCCCC` (hardcoded en `ProductItem`, no está en tokens).

## 3. Tipografía

### Fuentes
Librería: `expo-google-fonts` con `NotoSerifToto`. Tokens en `fonts`.

```ts
fonts.regular  → 'NotoSerifToto_400Regular'
fonts.semiBold → 'NotoSerifToto_600SemiBold'
fonts.bold     → 'NotoSerifToto_700Bold'
```

### Escala de texto (tokens en `typography`)

| Rol          | fontSize | fontWeight | color     | Uso                              |
|--------------|----------|------------|-----------|----------------------------------|
| `heading`    | 24px     | bold       | primary   | Títulos de sección               |
| `title`      | 20px     | bold       | primary   | (token base, no usado directo)   |
| `body`       | 16px     | normal     | primary   | Texto general                    |
| `label`      | 14px     | bold       | primary   | Etiquetas de formulario          |
| `button`     | 16px     | bold       | —         | Texto de botones                 |
| `caption`    | 12px     | normal     | error     | Mensajes de error                |

### Estilos usados directamente en pantalla (sin token de typography)

| Elemento                  | fontSize | fontFamily       | color          |
|---------------------------|----------|------------------|----------------|
| Header "BANCO"            | 17px     | `fonts.bold`     | `primary`      |
| Search input              | 15px     | System           | `textPrimary`  |
| Nombre de ítem            | 15px     | fontWeight '600' | `primary`      |
| ID de ítem                | 12px     | System           | `textMuted`    |
| Texto vacío / error lista | 14px     | System           | `textMuted` / `error` |
| Contador (counter)        | 13px     | System           | `textMuted`    |

## 4. Espaciado

Tokens en `spacing` (todos en px):

| Token   | Valor | Usos frecuentes                                   |
|---------|-------|---------------------------------------------------|
| `xs`    | 4px   | `marginTop` entre nombre e ID del ítem            |
| `sm`    | 8px   | Margen izquierdo del título en header             |
| `md`    | 12px  | `paddingHorizontal` del search input, `paddingBottom` del header |
| `lg`    | 16px  | `paddingHorizontal` de ítems, `paddingVertical` del botón |
| `xl`    | 24px  | `padding` de la card principal, `paddingHorizontal` del header |
| `xxl`   | 32px  | `marginBottom` del search input, `marginTop` del botón Agregar, padding de estado vacío |
| `xxxl`  | 40px  | `marginBottom` del header (separación al contenido) |

## 5. Border Radius

Tokens en `borderRadius`:

| Token | Valor | Uso                                    |
|-------|-------|----------------------------------------|
| `sm`  | 4px   | Search input, botón Agregar            |
| `md`  | 8px   | List card container                    |
| `lg`  | 12px  | (disponible, no usado aún)             |
| `xl`  | 16px  | Card principal (SafeAreaView container)|

## 6. Sombras

Tokens en `shadows`:

```ts
shadows.card      → shadowOpacity: 0.08, shadowRadius: 8, elevation: 3   // Card principal
shadows.listCard  → shadowOpacity: 0.05, shadowRadius: 4, elevation: 2   // List card container
```

Ambas con `shadowColor: black` y `shadowOffset: { width: 0, height: 1/2 }`.

## 7. Componentes

### Screen Layout

```
SafeAreaView (flex: 1, backgroundColor: appBackground #F5F5F5)
└── View card (flex: 1, white, borderRadius: xl=16, padding: xl=24, shadow: card)
    ├── Header
    ├── TextInput Search
    ├── View listCard (flex: 1)
    └── TouchableOpacity addButton
```

### Header de Pantalla

```
flexDirection: 'row'
alignItems: 'center'
justifyContent: 'center'
marginHorizontal: -24px   ← sangría negativa para que el borde llegue al filo de la card
paddingHorizontal: 24px
paddingBottom: 12px       (spacing.md)
marginBottom: 40px        (spacing.xxxl)
borderBottomWidth: 1
borderBottomColor: #E0E0E0
```

- Ícono: `CashIcon` size=20, color=primary `#0F265C` (SVG custom via react-native-svg)
- Texto: 17px, `fonts.bold`, color primary, `marginLeft: 8px`

### Search Input

```
height: 44px
borderWidth: 1
borderColor: #E0E0E0
borderRadius: 4px         (borderRadius.sm)
paddingHorizontal: 12px   (spacing.md)
fontSize: 15
color: #2C3E50            (textPrimary)
backgroundColor: #FFFFFF
marginBottom: 32px        (spacing.xxl)
placeholder color: #888888 (textSecondary)
```

### List Card Container

```
flex: 1
backgroundColor: #FFFFFF
borderRadius: 8px         (borderRadius.md)
borderWidth: 1
borderColor: #E0E0E0
overflow: 'hidden'
shadow: shadows.listCard  (elevation: 2)
```

### ProductItem

```
container:
  backgroundColor: #FFFFFF
  borderBottomWidth: 1
  borderBottomColor: #E0E0E0   ← borde inferior en cada ítem

content:
  flexDirection: 'row'
  alignItems: 'center'
  paddingHorizontal: 16px      (spacing.lg)
  paddingVertical: 14px

name:
  fontSize: 15, fontWeight '600', color #0F265C (primary)

id:
  fontSize: 12, color #757575 (textMuted), marginTop: 4px (spacing.xs)

chevron:
  ChevronRightIcon, size=18, color="#CCCCCC"
```

Separadores entre ítems: `ItemSeparatorComponent` con `height: 1, backgroundColor: #EEEEEE (itemBorder), marginHorizontal: 16 (spacing.lg)`.

### Botón Principal (Agregar)

```
backgroundColor: #FFD200   (accent)
borderRadius: 4px           (borderRadius.sm)
paddingVertical: 16px       (spacing.lg)
alignItems: 'center'
marginTop: 32px             (spacing.xxl)

texto:
  fontSize: 16, fontWeight 'bold', color #0F265C (primary)
```

### Estados de Lista

Todos comparten `stateContainer`: `flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32px, minHeight: 120`.

- **Loading:** `ActivityIndicator` size="large" color=primary
- **Error:** `typography.caption` (12px, color error) con fontSize override a 14px
- **Vacío:** 14px, color textMuted, textAlign center

## 8. Iconos

Librería: `react-native-svg` con iconos SVG custom en `shared/ui/icons/`.

| Ícono              | Archivo            | Size default | Color default | strokeWidth |
|--------------------|--------------------|--------------|---------------|-------------|
| `CashIcon`         | `CashIcon.tsx`     | 24px         | primary       | 2px         |
| `ChevronRightIcon` | `ChevronRightIcon.tsx` | 24px    | #CCCCCC       | 2px         |

En la pantalla de productos: CashIcon se usa con size=20, ChevronRightIcon con size=18.

## 9. Restricciones Técnicas

- **PROHIBIDO:** Tailwind, NativeBase, Tamagui, Styled Components o cualquier librería UI.
- **OBLIGATORIO:** `StyleSheet.create` exclusivo de React Native.
- **TOKENS:** Siempre importar desde `shared/theme/designTokens.ts` → `{ colors, fonts, typography, spacing, borderRadius, shadows }`.
- **ICONOS:** SVG custom vía `react-native-svg`. No usar `@expo/vector-icons`.
