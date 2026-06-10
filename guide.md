# Guía Completa — F&L Essentials

## Índice
1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Productos](#2-productos)
3. [Imágenes de producto](#3-imágenes-de-producto)
4. [Imágenes promocionales](#4-imágenes-promocionales)
5. [Configuración de la tienda](#5-configuración-de-la-tienda)
6. [Secciones de la página](#6-secciones-de-la-página)
7. [Colores y diseño](#7-colores-y-diseño)
8. [Fuentes y tipografía](#8-fuentes-y-tipografía)
9. [Textos y títulos editables](#9-textos-y-títulos-editables)
10. [Carrito y checkout](#10-carrito-y-checkout)
11. [Mensaje de WhatsApp](#11-mensaje-de-whatsapp)
12. [Atributos personalizados](#12-atributos-personalizados)
13. [Precio rebajado / Ofertas](#13-precio-rebajado--ofertas)
14. [Categorías](#14-categorías)
15. [Modo oscuro](#15-modo-oscuro)
16. [Comandos útiles](#16-comandos-útiles)

---

## 1. Estructura del proyecto

```
flessentials.vercel.app/
├── app/
│   ├── api/images/
│   │   ├── products/[filename]/route.js   → Sirve imágenes de productos
│   │   └── promos/[filename]/route.js      → Sirve imágenes promocionales
│   ├── globals.css                          → Estilos globales (colores, fuentes, layout)
│   ├── layout.js                            → Layout raíz (meta tags, fuentes)
│   ├── page.js                              → Página principal (servidor)
│   └── CatalogContainer.jsx                 → Componente principal (cliente)
├── components/
│   ├── Cart.jsx                             → Carrito y checkout
│   ├── FilterHeader.jsx                     → Header, búsqueda, categorías, filtros
│   ├── MasonryGrid.jsx                      → Grid tipo Pinterest
│   ├── ProductCard.jsx                      → Tarjeta de producto
│   └── ProductModal.jsx                     → Modal de detalle de producto
├── content/
│   ├── store-config.json                    → Configuración de la tienda
│   ├── products/                            → Productos (.md) + imágenes
│   │   ├── perfume-rose.md
│   │   ├── reloj-elegante.md
│   │   ├── bolso-cuero.md
│   │   ├── gafas-sol.md
│   │   ├── crema-hidratante.md
│   │   ├── collar-mariposa.md
│   │   ├── *.png / *.webp                  → Imágenes de producto
│   └── promos/                              → Imágenes promocionales
│       ├── landscape-promo.webp
│       ├── square-promo-1.webp
│       └── square-promo-2.webp
├── lib/
│   └── products.js                          → Lógica de lectura de productos
├── public/
│   └── images/
│       └── logo.webp                        → Logo de la tienda
├── package.json
└── guide.md                                 → Este archivo
```

---

## 2. Productos

Cada producto es un archivo `.md` dentro de `content/products/`. El nombre del archivo determina el ID (sin la extensión `.md`).

### Campos del frontmatter

```
---
id: "perfume-rose"            ← Obligatorio. Identificador único (letras, números, guiones)
name: "Perfume Floral Rose"   ← Obligatorio. Nombre visible del producto
priceUSD: 18.00               ← Obligatorio. Precio en USD (número, usa punto decimal)
originalPrice: 25.00          ← Opcional. Precio original (se muestra tachado + badge "Oferta")
category: "Perfumería"        ← Obligatorio. Categoría (se crea automáticamente si no existe)
image: "perfume_rose.png"     ← Forma 1: una sola imagen
images:                       ← Forma 2: múltiples imágenes (opcional, reemplaza a `image`)
  - "perfume_rose.png"
  - "perfume_rose_2.png"
description: "..."            ← Opcional. Texto corto visible en la tarjeta
featured: true                ← Opcional (true/false). Los destacados aparecen primero en el
                                catálogo y en el filtro "Destacados primero"
offer: true                   ← Opcional (true/false). Aparece en la sección "Ofertas Flash"
attributes:                   ← Opcional. Pares clave: valor que se muestran en el modal
  Tamaño: "50 ml"              y en el mensaje de WhatsApp
  Duración: "12 horas"
  Tipo: "Eau de Parfum"
---
```

Después del frontmatter (tras el `---`), puedes escribir contenido en **Markdown**. Ese contenido se muestra en la sección de detalles del modal del producto.

### Cómo crear un producto nuevo

1. Crea un archivo nuevo en `content/products/` con extensión `.md`.
2. Copia la estructura de frontmatter de arriba.
3. Completa todos los campos obligatorios.
4. Añade la imagen en la misma carpeta (ver sección 3).
5. El producto aparecerá automáticamente en la página tras el próximo build.

### Cómo editar un producto

1. Abre el archivo `.md` del producto en `content/products/`.
2. Edita cualquier campo del frontmatter.
3. El cambio se refleja tras el próximo build (o en desarrollo se recarga solo).

### Cómo eliminar un producto

1. Borra el archivo `.md` de `content/products/`.
2. Borra también su(s) imagen(es) asociada(s).
3. El producto desaparece tras el próximo build.

### Formato de la imagen

El valor de `image:` o dentro de `images:` puede ser:

- **Nombre de archivo relativo**: `"perfume_rose.png"` → se sirve desde `/api/images/products/perfume_rose.png`
- **URL absoluta externa**: `"https://ejemplo.com/foto.jpg"` → se usa directamente
- **Ruta desde public/**: `"/images/logo.webp"` → se sirve desde `/images/logo.webp`

---

## 3. Imágenes de producto

### Ubicación
Las imágenes deben colocarse en `content/products/`, en la **misma carpeta** que los archivos `.md`.

### Formatos soportados
`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`, `.avif`

### Tamaño recomendado
- **Ancho:** 600-800px (suficiente para retina en mobile)
- **Peso:** < 200 KB por imagen (usa WebP si es posible)

### Cómo añadir una imagen

1. Guarda el archivo de imagen en `content/products/`.
2. En el frontmatter del producto, referencia el nombre del archivo:
   ```yaml
   image: "mi_imagen.webp"
   ```
   o para múltiples:
   ```yaml
   images:
     - "mi_imagen_1.webp"
     - "mi_imagen_2.webp"
   ```
3. Las imágenes se sirven a través de `/api/images/products/[filename]`.

### Nota importante
En producción (Vercel), las imágenes deben estar incluidas en el repositorio (commiteadas con git). No se pueden subir a través del navegador ni de un panel de admin — se edita todo manualmente en los archivos.

---

## 4. Imágenes promocionales

### Ubicación
`content/promos/`

### Configuración
Las rutas se definen en `content/store-config.json`:
```json
"promoBanners": [
  "/api/images/promos/landscape-promo.webp",
  "/api/images/promos/square-promo-1.webp",
  "/api/images/promos/square-promo-2.webp"
]
```

### Layout
- **Desktop:** las 3 imágenes se muestran en un grid bento.
  - Índice `[0]` → landscape (16:9), ocupa el lado izquierdo (~66% del ancho)
  - Índices `[1]` y `[2]` → cuadradas (1:1), apiladas a la derecha (~33%)
  - Altura máxima: la que definas en el CSS (actualmente `512px`)
- **Mobile:** landscape arriba (16:9), las dos cuadradas abajo lado a lado (1:1)

### Cómo cambiar las promos
1. Coloca las imágenes nuevas en `content/promos/`.
2. Actualiza las rutas en `content/store-config.json` si cambiaste los nombres.
3. Si solo quieres 1 o 2 imágenes, deja los índices que no uses vacíos o con `null`.

---

## 5. Configuración de la tienda

Archivo: `content/store-config.json`

```json
{
  "name": "F&L Essentials",                    ← Nombre de la tienda (visible en header, footer, WhatsApp)
  "location": "Cotorro, La Habana, Cuba",       ← Dirección (se muestra al elegir recogida)
  "whatsappNumber": "+5358383303",              ← Número de WhatsApp (con código de país)
  "logoUrl": "/images/logo.webp",               ← Ruta del logo (desde la carpeta public/)
  "currency": {
    "code": "USD",
    "symbol": "$"
  },
  "promoBanners": [ ... ]                       ← Imágenes promocionales (ver sección 4)
}
```

### Cómo cambiar el logo
1. Coloca el archivo en `public/images/` (o donde prefieras dentro de `public/`).
2. Actualiza `logoUrl` en `store-config.json`.

Formatos aceptados: `.webp`, `.png`, `.jpg`. Tamaño recomendado: 200×200px (se muestra a 36×36px).

---

## 6. Secciones de la página

La página principal (`CatalogContainer.jsx`) tiene este orden:

```
┌─────────────────────────────────────┐
│            HEADER (fijo)            │
│  [Logo] [Categorías] [🔍] [🛈]    │
├─────────────────────────────────────┤
│         PROMO GRID (bento)          │
│  ┌──────────┐ ┌─────┬─────┐       │
│  │ Landscape │ │ 1:1 │ 1:1 │       │
│  └──────────┘ └─────┴─────┘       │
├─────────────────────────────────────┤
│        OFERTAS FLASH (si hay)       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │card │ │card │ │card │ │card │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
├─────────────────────────────────────┤
│            CATÁLOGO                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │card│ │card│ │card│ │card│ ...    │
│  └───┘ └───┘ └───┘ └───┘          │
├─────────────────────────────────────┤
│         FOOTER (mapa + redes)       │
└─────────────────────────────────────┘
```

### Títulos editables
Los títulos de las secciones están en `CatalogContainer.jsx`:

```jsx
// Línea ~246 — Título de Ofertas Flash
<h2 className="featured-title">Las Ofertas del Momento</h2>

// Línea ~263 — Título del Catálogo
<h2 className="featured-title" ...>Productos Disponibles</h2>
```

Puedes cambiar el texto entre las etiquetas `<h2>` por cualquier otro.

---

## 7. Colores y diseño

Todos los colores están definidos como variables CSS en `app/globals.css` dentro del bloque `:root`.

### Variables de color (modo claro)

```css
--bg-primary: #fcfbfa;        /* Fondo principal de la página */
--bg-secondary: #f5f2eb;      /* Fondo secundario (inputs, modales, tarjetas) */
--text-primary: #1c1a17;      /* Color del texto principal */
--text-secondary: #6e675f;    /* Color del texto secundario */
--accent-gold: #c59b6c;       /* Color de acento principal (precios, badges) */
--accent-rose: #dca391;       /* Color de acento secundario */
--accent-light: #fdfaf6;      /* Fondo claro para secciones destacadas */
--accent-hover: #b3885a;      /* Versión más oscura del acento dorado (hover) */
--border-color: #eae5dc;      /* Color de bordes y separadores */
```

### Otras variables

```css
--glass-bg: rgba(252, 251, 250, 0.85);    /* Fondo del header con efecto cristal */
--glass-border: rgba(28, 26, 23, 0.06);   /* Borde del header */
--shadow-sm: 0 2px 8px rgba(...);          /* Sombra pequeña */
--shadow-md: 0 10px 30px rgba(...);        /* Sombra mediana */
--shadow-lg: 0 20px 50px rgba(...);        /* Sombra grande */
--radius-sm: 8px;                          /* Borde redondeado pequeño */
--radius-md: 16px;                         /* Borde redondeado mediano */
--radius-lg: 24px;                         /* Borde redondeado grande */
```

### Cómo cambiar un color
1. Abre `app/globals.css`.
2. Localiza la variable en el bloque `:root`.
3. Cambia el valor HEX (ej: `#c59b6c` → `#ff6600`).
4. El cambio se aplica a todos los elementos que usen esa variable.

---

## 8. Fuentes y tipografía

Las fuentes se cargan desde Google Fonts en `app/layout.js`:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
```

Las variables de fuente están en `app/globals.css`:

```css
--font-sans: "Outfit", -apple-system, BlinkMacSystemFont, ...sans-serif;
--font-serif: "Playfair Display", Georgia, serif;
```

- `--font-sans` → Se usa para textos generales, precios, botones, inputs
- `--font-serif` → Se usa para títulos de sección (Ofertas Flash, Catálogo) y títulos de modal

### Cómo cambiar las fuentes
1. En `app/layout.js`, reemplaza la URL de Google Fonts por la(s) nueva(s) fuente(s).
2. En `app/globals.css`, actualiza `--font-sans` y/o `--font-serif` con los nombres nuevos.
3. Opcional: cambia también el `font-family` de elementos específicos en el CSS.

### Pesos (weights) disponibles
- **Outfit:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Playfair Display:** 400 (regular), 600 (semibold), 700 (bold)

---

## 9. Textos y títulos editables

| Texto | Dónde está | Cómo cambiarlo |
|---|---|---|
| Nombre de la tienda | `content/store-config.json` → `name` | Editar el JSON |
| Título de la pestaña | `app/layout.js` → `metadata.title` | Editar el string |
| Descripción SEO | `app/layout.js` → `metadata.description` | Editar el string |
| "Las Ofertas del Momento" | `app/CatalogContainer.jsx` línea ~246 | Editar el texto del `<h2>` |
| "Productos Disponibles" | `app/CatalogContainer.jsx` línea ~263 | Editar el texto del `<h2>` |
| "Tu Carrito" | `components/Cart.jsx` línea ~73 | Editar el texto del `<h2>` |
| "Mi Carrito" | `components/Cart.jsx` línea ~65 | Editar el botón flotante |
| "Datos del pedido" | `components/Cart.jsx` línea ~108 | Editar el `<h3>` |
| "Confirmar pedido por WhatsApp" | `components/Cart.jsx` línea ~178 | Editar el texto del `<a>` |
| Recogida / Envío labels | `components/Cart.jsx` líneas 125, 129 | Editar textos de los `<label>` |
| Métodos de pago | `components/Cart.jsx` línea 7 (`PAYMENT_OPTIONS`) | Editar el array |
| "Añadir al Carrito" | `components/ProductModal.jsx` línea ~111 | Editar el texto del botón |
| Placeholder "Buscar..." | `components/FilterHeader.jsx` línea ~101 | Editar `placeholder` |
| Placeholder "Tu nombre" | `components/Cart.jsx` línea ~112 | Editar `placeholder` |
| Placeholder "+53 5XXXXXXX" | `components/Cart.jsx` línea ~117 | Editar `placeholder` |
| Footer copyright | `app/CatalogContainer.jsx` línea ~410 | Editar el texto |

---

## 10. Carrito y checkout

### Cómo funciona
- El botón flotante "🛒 Mi Carrito" abre un drawer desde abajo.
- Los productos se guardan en `localStorage` del navegador (persisten aunque recargues).
- Al añadir productos, aparece un toast de confirmación.
- El checkout incluye: nombre, teléfono, recogida/envío, método de pago.
- Al confirmar, se abre WhatsApp con todos los datos y se vacía el carrito tras 0.5s.

### Métodos de pago
Se definen en `components/Cart.jsx` línea 7:
```js
const PAYMENT_OPTIONS = ["Efectivo USD", "Efectivo CUP", "Transferencia USD", "Transferencia CUP", "Zelle", "PayPal", "Otro"];
```
Agrega o quita opciones editando este array. La opción "Otro" muestra un input extra para que el usuario escriba su método.

### Cómo se reinicia el carrito
Al hacer clic en "Confirmar pedido por WhatsApp", se ejecuta `onClearCart()` después de 500ms. Esto:
1. Vacía el estado `cartItems`.
2. Elimina `flessentials_cart` del `localStorage`.

---

## 11. Mensaje de WhatsApp

Se genera en `components/Cart.jsx` dentro de la función `getWhatsAppLink()`.

### Estructura del mensaje

```
🛒 *Nuevo Pedido - [Nombre Tienda]*
──────────────────────────

👤 *Cliente:* [nombre]
📞 *Teléfono:* [teléfono]
📍 *Recogida:* En tienda
   *Dirección:* [dirección tienda]
💳 *Pago:* [método]

──────────────────────────
*Productos:*
• *2x* Perfume Floral Rose
  _Tamaño: 50 ml | Duración: 12 horas_
  $18.00 USD → *$36.00 USD*

──────────────────────────
*Total:* $36.00 USD

Muchas gracias. ¡Espero su confirmación!
```

### Campos incluidos
- Nombre del cliente
- Teléfono
- Tipo de entrega (recogida o envío)
- Dirección (de la tienda para recogida, o la ingresada para envío)
- Método de pago
- Atributos del producto (si tiene)
- Cantidad, precio unitario, subtotal por producto
- Total general

---

## 12. Atributos personalizados

Los atributos son pares `clave: valor` que se definen en el frontmatter del producto:

```yaml
attributes:
  Tamaño: "50 ml"
  Color: "Rosa"
  Material: "Acero inoxidable"
  Capacidad: "500 g"
  Duración: "12 horas"
```

### Dónde se muestran
1. **Modal del producto** — sección con filas de clave/valor.
2. **Mensaje de WhatsApp** — se incluyen como `_Clave: Valor | Clave: Valor_`.

### Cómo añadir atributos a un producto
Solo agrega el bloque `attributes` en el frontmatter con las claves que quieras. Cada producto puede tener atributos diferentes. No hay límite.

---

## 13. Precio rebajado / Ofertas

### Campo `originalPrice`
Si un producto tiene `originalPrice` mayor que `priceUSD`, se muestra:
- El precio original tachado (por ejemplo, `$25.00`)
- El precio actual destacado (por ejemplo, `$18.00`)
- Un badge rojo "Oferta" en la tarjeta

### Campo `offer`
Los productos con `offer: true` aparecen en la sección **"Ofertas Flash"** al inicio de la página (si hay al menos uno).

### Diferencia entre `featured` y `offer`
- **`featured: true`** → El producto aparece primero en el listado del catálogo y con el filtro "Destacados primero".
- **`offer: true`** → El producto aparece en la sección especial "Ofertas Flash" arriba del catálogo.

Puedes usar ambos a la vez, solo uno, o ninguno.

---

## 14. Categorías

Las categorías **se crean automáticamente** a partir del campo `category` de cada producto.

### Cómo crear una categoría nueva
1. En el frontmatter de cualquier producto, cambia o añade:
   ```yaml
   category: "Ropa"
   ```
2. Si ningún producto usaba "Ropa" antes, la categoría aparece automáticamente:
   - Como un pill en el header (junto a "Todos" y las demás categorías).
   - Como opción seleccionable en el modal de filtros.

### Cómo eliminar una categoría
1. Asegúrate de que ningún producto tenga esa categoría (edita o borra los productos que la usen).
2. La categoría desaparece automáticamente.

### Cómo renombrar una categoría
1. Edita el campo `category` en todos los productos que usen esa categoría.
2. El nombre nuevo reemplaza al anterior automáticamente.

---

## 15. Modo oscuro

El modo oscuro se activa automáticamente según la preferencia del sistema operativo (media query `prefers-color-scheme: dark`).

### Cómo personalizar el modo oscuro
En `app/globals.css`, dentro de `@media (prefers-color-scheme: dark)`, están las variables para el tema oscuro:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0e0d0c;
    --bg-secondary: #171513;
    --text-primary: #f5f2eb;
    /* ... etc ... */
  }
}
```

### Cómo desactivar el modo oscuro
Elimina o comenta todo el bloque `@media (prefers-color-scheme: dark)` de `app/globals.css`.

---

## 16. Comandos útiles

```bash
# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Verificar lint (reglas de código)
npm run lint

# Ver el resultado de la compilación localmente
npm start
```

### Notas para Vercel
- El proyecto se despliega en Vercel conectando el repositorio de git.
- En Vercel, los archivos de `content/` son de solo lectura (no se pueden escribir).
- Cualquier cambio en productos, imágenes o config debe hacerse mediante commit al repositorio.
- El build en Vercel ejecuta `npm run build` automáticamente.
