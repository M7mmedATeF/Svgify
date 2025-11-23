# 🎨 Svgify

<div style="display:flex; justify-content:center; margin-inline: auto; margin-block: 3rem 1rem; width: 100%;">
<img src="https://res.cloudinary.com/dclbtusww/image/upload/v1725670993/Sumcode/Svgify/spkctkwkydsmnvki85di.png" alt="Svgify Logo" style="width: 100%; object-fit: contain;" />
</div>
<br/>

`Svgify` is a lightweight React component designed to dynamically render and style SVG icons with smart color mixing and transparency preservation. It fetches SVG files and automatically adapts them to use `currentColor`, making them fully themeable.

## ✨ Key Updates (v4.0.0 - Beta)

### 🎨 Smart Color Mixing
- **Automatic transparency preservation** using CSS `color-mix()` function
- **Opacity detection** from both `opacity` attributes and color alpha channels
- **Duotone icon support** - preserves multi-color icons with varying transparency levels

### 🎯 Enhanced FontWeight Modes
- **`default`**: Preserves original icon structure (fill-only, stroke-only, or both)
- **`fill`**: Forces all elements to use fill only
- **`stroke`**: Forces all elements to use stroke only  
- **`both`**: Forces all elements to have both fill and stroke

### ⚛️ React 19 Compatible
- Fully tested and compatible with React 19.x
- Uses latest React patterns and hooks

### ⚡ Next.js Compatible
> **✅ NEW:** Full Next.js support (App Router & Pages Router)

Svgify now works seamlessly with Next.js! The library includes proper `"use client"` directives and is fully compatible with both the App Router and Pages Router.

**Quick Start for Next.js:**

1. Wrap your app with the `Svgifier` provider (in a client component)
2. Use the `Svgify` component in any client component

```jsx
// app/providers.tsx (App Router)
"use client";
import { Svgifier } from "@sumcode/svgify";

export function Providers({ children }) {
  return <Svgifier base_path="/assets/icons">{children}</Svgifier>;
}
```

```jsx
// components/MyIcon.tsx
"use client";
import Svgify from "@sumcode/svgify";

export function MyIcon() {
  return <Svgify IconName="home" Scale={1.5} />;
}
```

📚 **[See full Next.js documentation](#-nextjs-usage)** below for complete setup instructions.

## 🚀 Features

-   🎯 **Dynamic SVG Rendering:** Fetches and displays SVG icons based on the provided `IconName`
-   🎨 **Smart Color Mixing:** Automatically converts colors to use `currentColor` while preserving transparency
-   🌈 **Duotone Support:** Handles icons with multiple colors and transparency levels
-   💅 **Customizable Styling:** Supports inline styles, CSS classes, and different font weights
-   📏 **Scalable Icons:** Adjust the size of your icons with the `Scale` factor
-   ⚡ **Icons Caching:** Icons are cached in `localStorage` for better performance
-   🎭 **Class-based SVG Support:** Automatically inlines `<style>` blocks and removes classes

##

![npm version](https://img.shields.io/npm/v/@sumcode/svgify.svg?label=version&style=flat-square)
![npm downloads](https://img.shields.io/npm/dw/@sumcode/svgify.svg?color=red&style=flat-square)
![bundle size](https://img.shields.io/bundlephobia/min/@sumcode/svgify.svg?color=gold&style=flat-square)
![license](https://img.shields.io/npm/l/@sumcode/svgify.svg?color=orange&style=flat-square)
![dependencies](https://img.shields.io/librariesio/release/npm/@sumcode/svgify?style=flat-square)
![TypeScript](https://img.shields.io/npm/types/@sumcode/svgify.svg?style=flat-square)
![issues](https://img.shields.io/github/issues/M7mmedATeF/svgify.svg?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/M7mmedATeF/svgify.svg?style=social)

> **⚠️ Note:** The new color mixing and duotone features are in beta. Please report any issues you encounter.

## 📦 Installation

Install the package via npm:

```bash
npm install @sumcode/svgify
```

~~Add StyleSheet to your _`App.jsx`_ file:~~ (No longer needed in v4.0.0+)

```js
// import "@sumcode/svgify/styles"; // Not needed anymore
```

### 📁 Folder Structure

-   Create folder _`public/assets/icons`_
-   Add your _`YOUR_ICON_NAME.svg`_ files

```
.
└── my-project
    ├── node_modules
    ├── public
    │   └── assets
    │       └── icons 📂 (Add your svg icons here)
    │           └── YOUR_ICON_NAME.svg
    └── src
        └── app.jsx
```

## 🎯 Basic Usage

```jsx
import Svgify from "@sumcode/svgify";

function App() {
    return (
        <div style={{ color: "blue" }}>
            {/* Icon will inherit blue color */}
            <Svgify IconName="YOUR_ICON_NAME" Scale={1.2} />
        </div>
    );
}
```

## 🎨 FontWeight Modes

```jsx
import Svgify from "@sumcode/svgify";

function App() {
    return (
        <div>
            {/* Default: preserves original structure */}
            <Svgify IconName="icon" FontWeight="default" />
            
            {/* Fill only: forces fill on all elements */}
            <Svgify IconName="icon" FontWeight="fill" />
            
            {/* Stroke only: forces stroke on all elements */}
            <Svgify IconName="icon" FontWeight="stroke" />
            
            {/* Both: forces both fill and stroke */}
            <Svgify IconName="icon" FontWeight="both" />
        </div>
    );
}
```

## 🎨 Duotone Icons (Beta)

Svgify automatically handles duotone icons by preserving transparency:

```jsx
// Icon with opacity="0.5" will be rendered as:
// fill="color-mix(in srgb, currentColor 50%, transparent)"
<Svgify IconName="duotone-icon" />
```

## 🔄 Version Control (Recommended)

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Svgifier } from "@sumcode/svgify/SvgifyContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Svgifier version={1} clearForOldVersion>
            <App />
        </Svgifier>
    </StrictMode>
);
```

| Parameter            | Type      | Default          | Description                                                                     |
| :------------------- | :-------- | :--------------- | :------------------------------------------------------------------------------ |
| `version`            | `number`  | `1`              | Current icon version (increment to clear cache)                                 |
| `clearForOldVersion` | `boolean` | `false`          | Enable for upgrading from versions < 2.0.0                                      |
| `base_path`          | `string`  | `/assets/icons/` | Path to icons folder from public directory                                      |
| `FetchIcon`          | `function`| `axios.get`      | Custom fetch function (see section below)                                       |

## 🔧 Custom Fetching Function

```jsx
import { Svgifier } from "@sumcode/svgify/SvgifyContext";
import axios from "axios";

const FetchIcon = async (icon_path: string) => {
    return axios.get(`http://YOUR_SERVER.com/${icon_path}`);
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Svgifier
            base_path="/assets/iconization"
            version={2}
            FetchIcon={FetchIcon}
            clearForOldVersion
        >
            <App />
        </Svgifier>
    </StrictMode>
);
```

## 🌐 Next.js Usage

Svgify is fully compatible with Next.js 13+ (App Router) and Next.js 12 (Pages Router). Since the library uses browser APIs like `localStorage` and `DOMParser`, components must be marked as client components.

### App Router (Next.js 13+)

**Step 1:** Create a providers component

```jsx
// app/providers.tsx
"use client";

import { Svgifier } from "@sumcode/svgify";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Svgifier 
      base_path="/assets/icons"
      version={1}
      clearForOldVersion={true}
    >
      {children}
    </Svgifier>
  );
}
```

**Step 2:** Use in your root layout

```jsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Step 3:** Use Svgify in client components

```jsx
// components/MyComponent.tsx
"use client";

import Svgify from "@sumcode/svgify";

export function MyComponent() {
  return (
    <div>
      <Svgify IconName="home" Scale={1.5} />
      <Svgify IconName="user" className="text-blue-500" />
    </div>
  );
}
```

### Pages Router (Next.js 12)

**Step 1:** Wrap your app in `_app.tsx`

```jsx
// pages/_app.tsx
import { Svgifier } from "@sumcode/svgify";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Svgifier base_path="/assets/icons" version={1}>
      <Component {...pageProps} />
    </Svgifier>
  );
}
```

**Step 2:** Use Svgify in your pages or components

All components using Svgify must include the `"use client"` directive:

```jsx
// components/IconComponent.tsx
"use client";

import Svgify from "@sumcode/svgify";

export default function IconComponent() {
  return <Svgify IconName="settings" FontWeight="fill" />;
}
```

### Important Next.js Notes

- ✅ Always use `"use client"` directive in components that use Svgify
- ✅ Place SVG files in the `public/assets/icons/` directory
- ✅ Icons are cached in `localStorage` for better performance
- ⚠️ Server components cannot use Svgify (browser APIs required)

## ⚙️ Component Props

| Parameter         | Type                     | Default     | Description                                                      |
| :---------------- | :----------------------- | :---------- | :--------------------------------------------------------------- |
| `IconName`        | `string`*                | `""`        | Icon name without extension                                      |
| `FontWeight`      | `string`                 | `"default"` | Display mode: `"default"` \| `"fill"` \| `"stroke"` \| `"both"`  |
| `Scale`           | `number`                 | `1`         | Size multiplier (applied to font-size)                           |
| `className`       | `string`                 | `""`        | Custom CSS class for the wrapper span                            |
| `style`           | `React.CSSProperties`    | `{}`        | Inline styles for the wrapper span                               |
| `LoadingElement`  | `"" \| React.ReactNode`  | `""`        | Element shown while loading                                      |
| `NotFoundElement` | `"" \| React.ReactNode`  | `""`        | Element shown on error                                           |

## 🔍 How It Works

### Color Processing Pipeline
1. 📝 **Style Inlining**: Converts `<style>` blocks to inline styles
2. 👁️ **Opacity Detection**: Reads `opacity` attributes and color alpha channels
3. 🎨 **Color Mixing**: Replaces colors with `color-mix(in srgb, currentColor X%, transparent)`
4. ⚖️ **FontWeight Application**: Applies fill/stroke logic based on mode

### Example Transformation
```xml
<!-- Input SVG -->
<path opacity="0.5" fill="#FF0000" />

<!-- Output (processed by Svgify) -->
<path fill="color-mix(in srgb, currentColor 50%, transparent)" stroke="none" />
```

## 🧪 Testing

Exhaustive testing with 10K randomly generated icons: [🔗 Live Demo](https://svgify-exhaustive.netlify.app/)

## 📝 Changelog

### v4.0.0 (Beta)
- ✨ Smart color mixing with transparency preservation
- ✨ Duotone icon support
- ✨ Enhanced FontWeight modes (default, fill, stroke, both)
- ⚛️ React 19 compatibility
- ⚡ Next.js compatibility (App Router & Pages Router)
- 🚀 Removed CSS dependency
- 🐛 Fixed icon update on prop change

## 👨‍💻 Author

**Mohammed Atef**

-   💼 [LinkedIn](https://www.linkedin.com/in/m7mmed3atef/)
-   🐙 [Github](https://github.com/M7mmedATeF)
-   📧 [Email](mailto:mohammed.atef.ewais@gmail.com)

## 📄 License

MIT © [Mohammed Atef](https://github.com/M7mmedATeF)
