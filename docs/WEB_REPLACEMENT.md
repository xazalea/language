# Azalea Web Replacement - Complete HTML/CSS/JS Alternative

Azalea **completely replaces HTML, CSS, and JavaScript** for building webpages. You can do **ANYTHING** possible on the web, all in Azalea!

## Philosophy

- **No HTML needed** - Write everything in Azalea
- **No CSS files** - Style inline or with Azalea
- **No JavaScript** - All logic in Azalea
- **Complete replacement** - Do anything the web can do

## All HTML Elements Supported

### Semantic Elements
```azalea
call view header "Header content"
call view footer "Footer content"
call view nav "Navigation"
call view main "Main content"
call view article "Article"
call view section "Section"
call view aside "Sidebar"
```

### Text Elements
```azalea
call view h1 "Big Title"
call view h2 "Subtitle"
call view p "Paragraph"
call view span "Inline text"
call view strong "Bold"
call view em "Italic"
call view code "code"
call view pre "code block"
```

### Forms - ALL Form Elements
```azalea
call view form do
    call view input "name" placeholder "Name"
    call view input "email" type "email" placeholder "Email"
    call view textarea "message" placeholder "Message"
    call view select "country" do
        call view option "USA"
        call view option "Canada"
    end
    call view checkbox "agree"
    call view radio "option1"
    call view button "Submit"
end
```

### Tables
```azalea
call view table do
    call view tr do
        call view th "Name"
        call view th "Email"
    end
    call view tr do
        call view td "John"
        call view td "john@example.com"
    end
end
```

### Media
```azalea
call view video "/video.mp4" controls "true"
call view audio "/audio.mp3" controls "true"
call view img "/image.jpg" alt "Image"
call view iframe "https://example.com"
```

### Lists
```azalea
call view ul do
    call view li "Item 1"
    call view li "Item 2"
end

call view ol do
    call view li "First"
    call view li "Second"
end
```

## Web Module - DOM, Events, APIs

### DOM Manipulation
```azalea
// Query elements
call web query "#myId"
call web select ".myClass"

// Create elements
call web create "div"
call web element "button"

// Modify elements
call web append element content
call web update element "new content"
call web remove element
```

### Events - ALL Event Types
```azalea
// Click events
call web on "click" do
    say Clicked!
end

// Input events
call web on "input" do
    say Input changed!
end

// Keyboard events
call web on "keydown" do
    say Key pressed!
end

// Mouse events
call web on "mousemove" do
    say Mouse moved!
end

// Scroll events
call web on "scroll" do
    say Scrolled!
end
```

### Web APIs

#### Fetch API
```azalea
call web fetch "https://api.example.com/data" do
    call web storage "data" result
end

call web post "https://api.example.com/submit" data do
    say Posted!
end
```

#### Storage
```azalea
// LocalStorage
call web storage "key" "value"
call web load "key"

// SessionStorage
call web storage "key" "value" session "true"
```

#### WebSocket
```azalea
call web socket "wss://example.com" do
    call web send message
end
```

### Canvas & Graphics
```azalea
// Create canvas
call web canvas 800 600

// Draw shapes
call web draw "circle" 400 300 50
call web draw "rect" 100 100 200 150
call web draw "line" 0 0 800 600
```

### CSS & Styling
```azalea
// Inline styles
call view div style "background" "blue" style "color" "white" do
    call view p "Styled content"
end

// Classes
call view div class "container" do
    call view p "With class"
end

// IDs
call view div id "main" do
    call view p "With ID"
end

// Animations
call web animate element "fadeIn" 1000
```

## Complete Page Example

```azalea
// Complete webpage - NO HTML!
call web title "My Page"

call view header do
    call view h1 "Welcome"
    call view nav do
        call view a "/" "Home"
        call view a "/about" "About"
    end
end

call view main do
    call view section do
        call view h2 "Content"
        call view p "This is a complete webpage!"
        
        call view form do
            call view input "name" placeholder "Name"
            call view button "Submit" do
                call web fetch "/api/submit" data do
                    say Submitted!
                end
            end
        end
    end
end

call view footer do
    call view p "© 2025"
end

// Add interactivity
call web on "click" do
    say Clicked!
end

// Render page
call web page
```

## Advanced Features

### Web Workers
```azalea
call web worker "worker.az" do
    say Worker running!
end
```

### Geolocation
```azalea
call web geolocation do
    say Location: result
end
```

### Media API
```azalea
call web camera do
    call view video stream
end
```

### Share API
```azalea
call web share title "Title" text "Text" url "https://example.com"
```

## Comparison: HTML vs Azalea

### HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>Page</title>
</head>
<body>
    <h1>Title</h1>
    <p>Content</p>
    <button onclick="handleClick()">Click</button>
    <script>
        function handleClick() {
            console.log('Clicked!');
        }
    </script>
</body>
</html>
```

### Azalea (Same Result!)
```azalea
call web title "Page"
call view h1 "Title"
call view p "Content"
call view button "Click" do
    say Clicked!
end
call web page
```

**Much simpler!** No HTML, no separate JS files, everything in one language!

## Benefits

1. **One Language** - No need to learn HTML, CSS, AND JavaScript
2. **Simpler Syntax** - Cleaner than HTML/JS
3. **Type Safety** - Azalea's type system
4. **Hybrid Runtime** - Fast execution (TS + WASM)
5. **Complete Replacement** - Do anything the web can do

## Next Steps

- Build complete web apps in Azalea
- Replace all HTML/CSS/JS with Azalea
- Use Azalea for frontend AND backend
- One language for everything!

