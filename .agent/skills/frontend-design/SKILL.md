---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces that are accessible (WCAG 2.2 AA), responsive (Mobile-First), and premium "Liquid Glass 2.0" (macOS Tahoe & iOS 26 standard). Use this skill when the user asks to build web components, pages, artifacts, posters, or layouts. Generates creative, inclusive code that avoids generic AI aesthetics while prioritizing usability.
license: Complete terms in LICENSE.txt
---

This skill guides the creation of distinctive, production-grade frontend interfaces based on the **macOS Tahoe & iOS 26 Liquid Glass Design System**. We combine high-end aesthetics (refraction, vitality, "Clear Look") with strict adherence to **WCAG 2.2 AA** accessibility standards and **Mobile-First** methodologies.

## Core Philosophy: The Living Interface

A premium interface isn't just static pixels—it's a living, breathing layer that refracts the world behind it.
- **Vitality**: Colors should feel alive. Use `oklch` for vibrance.
- **Fluidity**: Elements morph and flow. Nothing teleports.
- **Refraction**: Surfaces aren't just transparent; they distort and amplify the content behind them.
- **Accessibility by Default**: High contrast (4.5:1) is mandatory, even on glass.

## 1. WCAG 2.2 AA Mandates

Every component generated must follow these non-negotiable standards:

### Perceivable
- **Contrast (1.4.3)**: Normal text must have a contrast ratio of at least **4.5:1** against its background. 
- **Non-Text Contrast (1.4.11)**: UI components (borders, icons, states) must have at least **3:1** contrast.
- **Text Reflow (1.4.10)**: Content must reflow without loss of function at 400% zoom (320px width).

### Operable
- **Keyboard Accessible (2.1.1)**: All functions must be keyboard-operable.
- **Target Size (2.5.5)**: Minimum **44x44px** for all interactive elements to meet Apple & WCAG standards.
- **Focus States (2.4.7)**: Replace default rings with custom, high-visibility `:focus-visible` styles (min 3px outline with offset).

### Understandable & Robust
- **Semantic Landmarks**: Use `<main>`, `<nav>`, `<header>`, `<footer>`, and `<section>` with proper `aria-label` where necessary.
- **Labeling**: Every input *must* have a programmatically associated `<label>`.

---

## 2. Technical Aesthetics: Liquid Glass 2.0 (Tahoe/iOS 26)

"Liquid Glass" uses precise `backdrop-filter` values and `oklch` colors to achieve a premium, vibrant feel while maintaining 4.5:1 contrast.

### The Accessible Glass Pattern
```css
/* macOS Tahoe / iOS 26 Liquid Glass */
.liquid-glass {
  /* 1. Base translucent material - slightly more transparent than iOS 18 */
  background: var(--glass-bg-light, oklch(98% 0.01 240 / 65%));
  
  /* 2. Precision blur & saturation for "Vitality" */
  /* Higher saturation mimics the "refraction" of colors behind */
  backdrop-filter: blur(32px) saturate(220%) brightness(1.1);
  -webkit-backdrop-filter: blur(32px) saturate(220%) brightness(1.1);
  
  /* 3. Definitive borders (Minimum 3:1 contrast) */
  /* Thinner, sharper borders for the "Crystal" look */
  border: 1px solid var(--glass-border-light, oklch(0% 0 0 / 20%));
  
  /* 4. Specular highlight for depth */
  border-top: 1px solid var(--glass-highlight, oklch(100% 0 0 / 50%));
  
  /* 5. Softness and Depth */
  border-radius: 24px; /* Larger radii for Tahoe style */
  box-shadow: 
    0 12px 40px var(--glass-shadow, oklch(0% 0 0 / 15%)),
    inset 0 1px 0 oklch(100% 0 0 / 30%);

  /* 6. Interaction Spring */
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Dark Mode Adjustment */
@media (prefers-color-scheme: dark) {
  :root {
    /* Deeper, richer dark glass */
    --glass-bg-light: oklch(18% 0.03 260 / 70%);
    --glass-border-light: oklch(100% 0 0 / 25%);
    --glass-highlight: oklch(100% 0 0 / 25%);
    --glass-shadow: oklch(0% 0 0 / 50%);
  }
}
```

### Prohibited Anti-Patterns
To prevent legibility failures shown in previous versions:
- **NO `text-muted-foreground` on Glass**: Standard muted grays often disappear on semi-transparent backgrounds. Use high-contrast tokens or explicit values (e.g., `oklch(20% 0 0 / 80%)`).
- **NO "Normal" weight for Light Text**: Light-on-dark text on glass requires a minimum `font-weight: 600` (semibold) to maintain clarity against backdrop blur noise.
- **NO Layered Transparency**: Avoid stacking multiple `glass-auto` elements without increasing the solid background opacity of the upper layer.
- **MANDATORY Border Contrast**: Every glass panel *must* have a border with at least 3:1 contrast to define the hit area and depth.

---

## 3. Implementation Workflow: Mobile-First & Fluid

Never use static pixel widths for containers. Use CSS Grid and `clamp()` for responsiveness.

### Fluid Typography & Spacing (System Variables)
Copy these exact variables to the `:root` of your project.

```css
:root {
  /* Fluid Typography Scale (vi based) */
  --fluid-h1: clamp(2rem, 5vi + 1rem, 4rem); /* Bolder headings */
  --fluid-h2: clamp(1.5rem, 4vi + 0.5rem, 2.75rem);
  --fluid-body: clamp(1rem, 2vi + 0.25rem, 1.25rem);
  --fluid-label: clamp(0.75rem, 1.5vi + 0.25rem, 1rem);
  
  /* Spacing Scale */
  --space-xs: clamp(0.5rem, 2vi, 0.75rem);
  --space-sm: clamp(1rem, 4vi, 1.5rem);
  --space-md: clamp(2rem, 6vi, 3rem);
  --space-lg: clamp(4rem, 10vi, 6rem);

  /* Colors (OKLCH) - The "Tinted" System */
  --text-primary: oklch(5% 0.01 240 / 98%);
  --text-secondary: oklch(25% 0.02 240 / 95%);
  
  /* System Accent - can be overridden by user wallpaper tint */
  --system-accent: oklch(62% 0.22 260); /* Default vivid blue-purple */
  --system-accent-fg: oklch(98% 0 0);
}
```

### Layout Logic
Default to mobile styles (stacked) and use `@media (min-width: ...)` to add complexity as horizontal space permits. Use `grid-template-areas` for clean, readable layout structures.

---

## 4. Interaction & Morphing

Animations must be smooth (using `oklch()` for color transitions and spring beziers) and elements should "morph" rather than just appear.

```css
/* Spring-like Micro-interaction */
.liquid-glass:hover {
  transform: scale(1.02) translateY(-2px);
  backdrop-filter: blur(40px) saturate(240%) brightness(1.15); /* Vitality flush */
}

.liquid-glass:active {
  transform: scale(0.98);
}

.liquid-glass:focus-visible {
  outline: 3px solid var(--system-accent, currentColor);
  outline-offset: 4px;
}

/* Morphing Container (for dynamic lists/modals) */
.liquid-morph {
  transition: width 0.5s var(--ease-spring), height 0.5s var(--ease-spring), background 0.3s ease;
}

/* MANDATORY Motion Preference Check (WCAG 2.2) */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 5. Premium Layout Patterns (Tahoe Style)

### The "Floating Island" Header
In macOS Tahoe and iOS 26, headers and toolbars float above the content, letting the app "breathe" around them.

```css
.tahoe-header {
  position: sticky;
  top: var(--space-xs);
  margin: 0 var(--space-sm); /* FLoating island effect */
  width: calc(100% - var(--space-sm) * 2);
  z-index: 1000;
  
  @extend .liquid-glass;
  border-radius: 9999px; /* Pill shape is standard now */
  padding: 0.75rem 2rem;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### "Immersive" Split (Side-by-Side)
Use this for detailed views where the sidebar provides context to a large, refractive main area.

```css
.tahoe-split {
  display: grid;
  gap: var(--space-md);
  height: 100dvh;
  padding: var(--space-sm);
  
  /* Mobile: Stacked */
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}

@media (min-width: 1024px) {
  .tahoe-split {
    /* Sidebar (fixed width) + Main Content (Fluid) */
    grid-template-columns: 320px 1fr;
    grid-template-rows: 1fr;
    
    /* The sidebar is glass, letting the wallpaper show through */
    aside {
      @extend .liquid-glass;
      height: 100%;
    }
    
    /* Main content might be a "card" or just open canvas */
    main {
       @extend .liquid-glass;
       /* Or transparent if it's a canvas */
    }
  }
}
```

## 6. Iconography: The "Clear Look" & Tints

Icons in iOS 26 are adaptable. They can be "filled", "outlined", or "tinted".

- **Clear Look**: Use thin strokes (1.5px or 2px) with `transparent` fill.
- **Tinted**: When active, icons fill with `--system-accent` and the symbol turns white/glass.

```css
.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  border-radius: 50%;
  padding: 12px;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: oklch(100% 0 0 / 10%); /* Subtle hover */
  color: var(--text-primary);
}

.icon-btn.active {
  background: var(--system-accent);
  color: var(--system-accent-fg);
  box-shadow: 0 4px 12px var(--system-accent, oklch(62% 0.22 260 / 40%));
}
```

---

## Aesthetic Guidelines Checkpoint

1.  **Refraction?** Does the glass feel thick and vibrant (blur 32px+, sat 220%+)?
2.  **Vitality?** Are colors using `oklch` for maximum gamut?
3.  **Floating?** Do headers and bars float (island style) rather than attaching to edges?
4.  **Accessible?** Is text 4.5:1? (Check `text-slate-500` vs background).
5.  **Mobile-First?** Does it work on a 320px iPhone SE?

NEVER use "generic" flat designs. Aim for depth, light, and material.