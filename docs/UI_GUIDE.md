# Azalea UI Development Guide

Azalea makes building beautiful UIs incredibly simple and clean.

## Philosophy

- **Minimal syntax** - No JSX, no templates, just clean code
- **Component-based** - Build reusable pieces
- **Style inline** - No separate CSS files needed
- **Works everywhere** - Browser, mobile, desktop

## Basic Components

### Text

```azalea
call view text "Hello World"
```

### Button

```azalea
call view button "Click Me" do
    say Clicked!
end
```

### Input Field

```azalea
call view input "name" placeholder "Enter name"
```

### Image

```azalea
call view image "/logo.png"
```

### Container (Pane/Box)

```azalea
call view pane do
    call view text "Inside the box"
end
```

## Styling

### Inline Styles

```azalea
call view button "Styled" style "color" "blue" style "size" "large"
```

### Style Object

```azalea
call view style "background" "red" style "padding" "20"
```

## Building Layouts

### Simple Layout

```azalea
call view pane do
    call view text "Title" style "size" "large"
    call view text "Subtitle"
    call view button "Action"
end
```

### Form Layout

```azalea
call view pane do
    call view text "Sign Up"
    call view input "email" placeholder "Email"
    call view input "password" placeholder "Password"
    call view button "Submit" do
        say Form submitted!
    end
end
```

### List Layout

```azalea
form list items from ["Item 1", "Item 2", "Item 3"]
call view list items
```

## Complete App Example

```azalea
act app do
    call view pane style "background" "white" do
        call view text "My App" style "size" "xlarge"
        
        call view pane style "margin" "20" do
            call view input "name" placeholder "Name"
            call view button "Greet" do
                say Hello!
            end
        end
        
        call view image "/logo.png"
    end
    call view show pane
end

call app
```

## Advanced Patterns

### Conditional Rendering

```azalea
form bool show_button from true

if show_button do
    call view button "Click"
end
```

### Dynamic Lists

```azalea
form list names from ["Alice", "Bob", "Charlie"]

loop names do
    call view text step
end
```

### Component Functions

```azalea
act card title text content do
    call view pane style "border" "1" do
        call view text title style "bold" "true"
        call view text content
    end
end

call card "Title" "Content here"
```

## Best Practices

1. **Keep it simple** - Azalea syntax is minimal for a reason
2. **Use functions** - Reuse components with `act` functions
3. **Style consistently** - Use the same style patterns
4. **Test in browser** - Use the web interpreter to see your UI
5. **Start small** - Build one component at a time

## Browser Integration

When running in browser, Azalea components automatically:
- Create DOM elements
- Handle events
- Apply styles
- Update the page

No framework needed - just Azalea!

## Next Steps

- Try the examples in `examples/ui_*.az`
- Build your own components
- Create a complete app
- Share what you build!

