# CSS Styling Guide - Stunning UIs Made Easy

Azalea supports **full CSS** with shortcuts and beautiful defaults. Create stunning UIs effortlessly!

## Basic Styling

### Inline Styles

```azalea
call view div style "background" "blue"
                 style "color" "white"
                 style "padding" "20px"
```

### Shortcuts

```azalea
call view div style "bg" "blue"      // background
                 style "fg" "white"   // color
                 style "p" "20px"     // padding
                 style "m" "10px"     // margin
```

## Colors

### Named Colors

```azalea
style "color" "red"
style "background" "blue"
style "border-color" "green"
```

### Hex Colors

```azalea
style "background" "#667eea"
style "color" "#ffffff"
```

### RGB/RGBA

```azalea
style "background" "rgb(102, 126, 234)"
style "background" "rgba(102, 126, 234, 0.8)"
```

### Gradients

```azalea
style "background" "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
style "background" "radial-gradient(circle, #667eea, #764ba2)"
```

## Layout

### Flexbox

```azalea
call view div style "display" "flex"
                 style "justify-content" "center"
                 style "align-items" "center"
                 style "flex-direction" "column"
                 style "gap" "1rem"
```

### Grid

```azalea
call view div style "display" "grid"
                 style "grid-template-columns" "repeat(3, 1fr)"
                 style "gap" "2rem"
                 style "grid-auto-rows" "minmax(100px, auto)"
```

### Position

```azalea
style "position" "absolute"
style "position" "relative"
style "position" "fixed"
style "position" "sticky"
style "top" "0"
style "left" "0"
style "right" "0"
style "bottom" "0"
style "z-index" "10"
```

## Typography

```azalea
style "font-family" "Arial, sans-serif"
style "font-size" "16px"
style "font-weight" "bold"
style "font-style" "italic"
style "text-align" "center"
style "line-height" "1.6"
style "letter-spacing" "1px"
style "text-transform" "uppercase"
style "text-decoration" "underline"
```

## Spacing

```azalea
// Margin
style "margin" "10px"
style "margin-top" "20px"
style "margin-bottom" "20px"
style "margin-left" "10px"
style "margin-right" "10px"

// Padding
style "padding" "20px"
style "padding-top" "10px"
style "padding-bottom" "10px"
style "padding-left" "15px"
style "padding-right" "15px"
```

## Borders & Shadows

```azalea
// Borders
style "border" "1px solid #ccc"
style "border-radius" "8px"
style "border-top" "2px solid blue"
style "border-bottom" "2px solid red"

// Shadows
style "box-shadow" "0 2px 4px rgba(0,0,0,0.1)"
style "box-shadow" "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)"
style "text-shadow" "2px 2px 4px rgba(0,0,0,0.3)"
```

## Effects

### Transitions

```azalea
style "transition" "all 0.3s ease"
style "transition" "background 0.3s, transform 0.3s"
style "transition-property" "all"
style "transition-duration" "0.3s"
style "transition-timing-function" "ease-in-out"
```

### Transforms

```azalea
style "transform" "translateX(10px)"
style "transform" "translateY(-10px)"
style "transform" "scale(1.1)"
style "transform" "rotate(45deg)"
style "transform" "translate(10px, 20px) rotate(45deg) scale(1.1)"
```

### Animations

```azalea
style "animation" "pulse 2s infinite"
style "animation-name" "fadeIn"
style "animation-duration" "1s"
style "animation-iteration-count" "infinite"
style "animation-timing-function" "ease-in-out"
```

### Opacity

```azalea
style "opacity" "0.8"
style "opacity" "1"
```

## Hover Effects

```azalea
call view button "Hover Me" style "background" "#667eea"
                            style "transition" "all 0.3s"
                            style "hover" "background: #5568d3; transform: translateY(-2px)"
```

## Responsive Design

```azalea
// Width and Height
style "width" "100%"
style "max-width" "1200px"
style "min-width" "300px"
style "height" "100vh"
style "max-height" "500px"

// Media queries (via classes)
style "width" "100%"
style "max-width" "1200px"
```

## Complete Example

```azalea
act stunning_card do
    call view card style "background" "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                   style "color" "white"
                   style "padding" "3rem"
                   style "border-radius" "20px"
                   style "box-shadow" "0 20px 60px rgba(0,0,0,0.3)"
                   style "max-width" "500px"
                   style "margin" "0 auto"
                   style "transition" "transform 0.3s"
                   style "hover" "transform: scale(1.05)" do
        
        call view h1 style "font-size" "2.5rem"
                     style "font-weight" "bold"
                     style "margin-bottom" "1rem"
                     style "text-shadow" "2px 2px 4px rgba(0,0,0,0.3)" do
            "Stunning Card"
        end
        
        call view p style "line-height" "1.6"
                     style "opacity" "0.9" do
            "Beautiful UI with full CSS support"
        end
        
        call view button "Click Me" style "background" "white"
                                    style "color" "#667eea"
                                    style "border" "none"
                                    style "padding" "1rem 2rem"
                                    style "border-radius" "8px"
                                    style "font-size" "1.1rem"
                                    style "cursor" "pointer"
                                    style "margin-top" "2rem"
                                    style "transition" "all 0.3s"
                                    style "hover" "background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2)" do
            say Clicked!
        end
    end
end

call stunning_card
```

## CSS Property Reference

### All Supported Properties

- **Layout**: `display`, `position`, `top`, `bottom`, `left`, `right`, `z-index`
- **Flexbox**: `flex`, `flex-direction`, `justify-content`, `align-items`, `gap`
- **Grid**: `grid-template-columns`, `grid-template-rows`, `grid-gap`
- **Sizing**: `width`, `height`, `max-width`, `max-height`, `min-width`, `min-height`
- **Spacing**: `margin`, `padding` (and all variants)
- **Colors**: `color`, `background`, `background-color`, `background-image`
- **Borders**: `border`, `border-radius`, `border-color`, `border-width`
- **Typography**: `font-family`, `font-size`, `font-weight`, `text-align`, `line-height`
- **Effects**: `box-shadow`, `text-shadow`, `opacity`, `transform`, `transition`, `animation`
- **And many more!**

## Tips for Stunning UIs

1. **Use gradients** - They look modern and beautiful
2. **Add shadows** - Depth makes UIs pop
3. **Smooth transitions** - Everything feels better animated
4. **Consistent spacing** - Use rem/px consistently
5. **Color harmony** - Use color palettes
6. **Responsive** - Use percentages and max-widths
7. **Hover effects** - Interactive elements feel alive

Create stunning UIs with Azalea's full CSS support!

