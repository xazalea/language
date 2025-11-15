# Azalea Language

🌺 **Azalea** - An elegant, minimal, powerful interpreted programming language.

## Philosophy

- **Short, logical, Latin-like** with light English roots
- **Minimal symbols**: only `. , / ? ; !`
- **Not sentence-based, not verbose**
- **Extremely easy for beginners** - Kids can learn it!
- **Extremely powerful for experts** - Build complex systems
- **Fully interpreted, no compile step**
- **Hyper efficient** - Combines the best of major languages
- **Perfect for UI** - Beautiful, clean syntax
- **Great for backends** - Simple to complex APIs

## Quick Start

### Installation

```bash
# Build native interpreter
make native

# Build WASM for browser
make wasm

# Run examples
make examples
```

### Hello World

```azalea
say Hello World
form num a from 10
say a
```

**Numbers work!** You can use `10` or `ten` - both work perfectly!

### Functions

```azalea
act sum a b do
    give a plus b
end

call sum five ten
```

### Conditionals

```azalea
form num a from ten
form num b from five

if a over b do
    say a
end
```

### Loops

```azalea
loop ten do
    say step
end
```

## Language Features

### Core Words

- `form` - declare variable
- `act` - define function
- `call` - invoke function
- `give` - return value
- `say` - print output
- `if` - conditional
- `loop` - iteration
- `put` - assign value

### Types

- `num` - number
- `text` - string
- `bool` - boolean
- `list` - array
- `map` - object

### Modules

- `net` - networking
- `file` - file operations
- `vm` - virtual machine
- `serve` - web server
- `view` - UI components
- `play` - game engine

## Examples

See the `examples/` directory for:

### For Kids & Beginners
- `kids_hello.az` - Super simple hello world
- `kids_calculator.az` - Easy calculator

### UI Development
- `ui_simple.az` - Simple button example
- `ui_form.az` - Form with inputs
- `ui_app.az` - Complete UI app

### Backend Development
- `backend_simple.az` - Basic server
- `backend_complex.az` - Full API with routes

### Core Features
- `hello.az` - Basic hello world
- `functions.az` - Function definitions
- `conditionals.az` - If statements
- `loops.az` - Loop constructs

### Advanced
- `vm_example.az` - VM creation
- `server_example.az` - Web server
- `net_example.az` - Networking
- `file_example.az` - File operations
- `game_example.az` - Game logic
- `proxy_example.az` - Web proxy

## Web Interpreter

The web interpreter is available in `web/index.html`. To use it:

1. Build WASM: `make wasm`
2. Copy `bin/azalea.js` and `bin/azalea.wasm` to `web/`
3. Open `web/index.html` in a browser or serve it:
   ```bash
   cd web && python3 -m http.server 8000
   ```

## Deployment

### GitHub Pages

1. Build WASM: `make wasm`
2. Copy `bin/azalea.js` and `bin/azalea.wasm` to `web/`
3. Push to GitHub
4. Enable GitHub Pages for the `web/` directory

### Vercel

1. Create `vercel.json`:
```json
{
  "builds": [
    {
      "src": "web/**",
      "use": "@vercel/static"
    }
  ]
}
```

2. Deploy: `vercel --prod`

## Architecture

- **Lexer**: Tokenizes source code
- **Parser**: Builds AST from tokens
- **Runtime**: Executes AST with scoped variables
- **Modules**: Extensible module system for net, file, vm, serve, view, play

## Building

### Requirements

- C++17 compiler (g++ or clang++)
- Emscripten (for WASM builds)
- Make

### Build Commands

```bash
# Native build
make native

# WASM build
make wasm

# Both
make all

# Clean
make clean
```

## Key Features

### 🎨 **Flexible Syntax - Code Your Way!**
Write code in **any style** you prefer - all work perfectly:
- Variables: `form`, `let`, `var`, `const`, `set`
- Functions: `act`, `def`, `fn`, `func`, `function`
- Conditionals: `if`, `when`
- Loops: `loop`, `while`, `for`, `repeat`, `each`
- Operators: `plus`/`+`, `minus`/`-`, `times`/`*`, `div`/`/`
- Output: `say`, `print`, `output`, `display`

### 💅 **Full CSS Support - Stunning UIs!**
Complete CSS capabilities with shortcuts:
- All CSS properties supported
- Shortcuts: `bg` (background), `fg` (color), `p` (padding), `m` (margin)
- Gradients, shadows, animations, transitions
- Flexbox, Grid, positioning
- Hover effects and responsive design

### 🌐 **Perfect for UI Development**
- HTML-like components: `h1`, `p`, `button`, `div`, `section`
- Semantic HTML: `header`, `footer`, `nav`, `main`
- Modern layouts: `card`, `grid`, `row`, `col`
- Beautiful by default, fully customizable

## Documentation

- **[Language Specification](docs/language_spec.md)** - Complete syntax reference
- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started quickly
- **[For Kids](docs/FOR_KIDS.md)** - Super simple guide for beginners
- **[UI Guide](docs/UI_GUIDE.md)** - Build beautiful interfaces
- **[CSS Guide](docs/CSS_GUIDE.md)** - Full CSS styling reference
- **[Flexible Syntax](docs/FLEXIBLE_SYNTAX.md)** - Code your way guide
- **[Backend Guide](docs/BACKEND_GUIDE.md)** - Create powerful APIs
- **[Architecture](docs/ARCHITECTURE.md)** - How Azalea works

## License

MIT

