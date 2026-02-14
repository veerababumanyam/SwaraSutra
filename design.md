# Apple Liquid Glass Design System
*Based on iOS 26, macOS Tahoe, and Apple Design 2025*

## Core Philosophy
The **Liquid Glass** design language represents a shift towards optical realism, fluidity, and expressive delight. Unlike previous iterations of flat or frosted glass, Liquid Glass emulates the physical properties of light passing through a refractive medium.

### Key Pillars
1.  **Optical Realism**: Elements don't just sit on top of a background; they interact with it. Controls and surfaces **refract** and **reflect** the content behind them, creating a sense of deep immersion.
2.  **Fluidity**: Interfaces are not static. Controls "fluidly morph" to react to user interaction. The system feels alive and organic.
3.  **Delight & Expression**: The design prioritizes "delightful" interactions, utilizing vibrant colors and dynamic motion to create an emotional connection.
4.  **Clarity**: Despite the rich visuals, the primary goal is clarity. The refractive nature of the glass is tuned to bring focus to content, not distract from it.

---

## Material System: Liquid Glass 2.0

### The Material
*   **Refraction**: Background elements are not just blurred; they are slightly distorted or shifted, mimicking thick, premium glass.
    *   **Spec**: `backdrop-filter: blur(32px) saturate(220%) brightness(1.1)`
*   **Deep Refraction (Active State)**: When pressed, the "glass" compresses, increasing density and refraction.
    *   **Spec**: `:active` state increases blur to `40px` and saturation to `240%`.
*   **Reflection**: Subtle specular highlights and reflections that change based on "light source" or device movement (3D effect).
*   **Transparency**: Variable opacity. Some elements are nearly clear ("stunning clear look"), while others are more opaque to provide contrast.

### Usage
*   **macOS Menu Bar**: Now fully transparent/refractive, making the display feel larger and less constrained.
*   **Sidebars**: Reflect the "depth" of the workspace.
*   **Toolbars (Floating Islands)**: Offer a "subtle hint" of content scrolling behind them, reinforcing the z-axis layering.

---

## Components & Elements

### App Icons
*   **Clear Look**: A new style where icons are rendered as 3D glass objects, taking on the color and lighting of the wallpaper behind them.
*   **Tinted**: Icons can be uniformly tinted with a specific color (using OKLCH for vibrancy) to match a theme.
*   **Dark/Light**: Updated standard appearances with enhanced depth.

### Dynamic Controls: Liquid Morphing
*   **Liquid Metal Morphing**: Buttons and sliders don't just change state; they physically morph. A play button flows into a pause button like liquid metal.
    *   **Spec**: Use `transition: all var(--ease-fluid)` (spring physics) combined with dynamic `border-radius` changes.
    *   **Interaction**: Hover effects should expand bounds slightly (`scale(1.02)`) while `active` states compress (`scale(0.98)`).
*   **Refractive Interactions**: When pressed, controls distort the background more deeply, simulating pressure on a gel or glass surface.

### Typography
*   **Adaptive Legibility**: Text on glass surfaces uses advanced blending modes or dynamic weight adjustments to ensure high contrast against any background.
*   **Lock Screen**: The time display is a headline example, dynamically adapting to the photo wallpaper (depth effect, color integration).

---

## Motion & Depth (Parallax)

*   **Parallax Depth**: Elements exist on distinct Z-layers.
    *   **Layer 0**: Wallpaper/Video Background
    *   **Layer 1 (Base Glass)**: Windows/Panels (`backdrop-filter: blur(32px)`)
    *   **Layer 2 (Floating)**: Toolbars/Modals (`translateZ(20px)`, slightly higher brightness)
    *   **Interaction**: Mouse movement creates subtle counter-movement between layers to simulate 3D space.
*   **Flow**: Transitions between apps and states are seamless. There are no hard cuts—everything flows from one state to another.

## Color System
*   **Vibrancy**: The system utilizes the **P3 Color Space** via **OKLCH** to achieve a "delightful" and distinctively vibrant gamut that sRGB cannot reproduce.
*   **Lighting**: Gradients are not static; they should "shimmer" or shift slightly on interaction to simulate light moving across the surface.

---

## References
*   [iOS 26 Preview](https://www.apple.com/os/ios/)
*   [macOS Tahoe Preview](https://www.apple.com/os/macos/)
*   [Apple Newsroom: New Software Design](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
