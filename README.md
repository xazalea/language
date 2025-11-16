# Azalea - The Universal Language

🌺 **Azalea** - One language for everything. Combines the best features from Python, JavaScript, Go, Rust, SQL, and more.

## One Language for Everything

- **Static Sites** - Generate HTML (replaces Jekyll/Hugo)
- **Frontend** - Build UIs (replaces React/Vue/Angular)
- **Backend** - Build APIs and servers (replaces Node.js/Express)
- **Databases** - Query databases (replaces SQL)
- **CLI Tools** - Build command-line tools (replaces Python/Bash)
- **Data Processing** - Process CSV/data (replaces Pandas)
- **Concurrency** - Go-like goroutines and channels
- **Shell Scripting** - Run system commands

## Philosophy

- **Hybrid Runtime**: TypeScript (fast startup) + WASM (maximum speed) = True Hybrid
- **Grammar Almost Doesn't Matter**: Write any way you want - ultra flexible
- **Super Easy to Write**: No quotes needed, no "call" needed, write naturally
- **Combines Popular Languages**: Python simplicity + JavaScript flexibility + Go concurrency + Rust safety + SQL queries
- **Extremely efficient**: Hybrid runtime gives you best of both worlds
- **One language**: Replace Python, JavaScript, Go, SQL, Bash, HTML/CSS/JS - all in one!

## Dual Mode Architecture

### C++ Compiler (High Performance)
- Compiles Azalea to optimized C++
- Maximum performance for production
- Native speed execution
- Low-level control

### TypeScript Interpreter (Rapid Development)
- Interprets Azalea code directly
- Fast iteration during development
- Easy debugging and testing
- Browser-compatible execution

## Super Flexible Grammar

Azalea has the **loosest grammar** of any language. Write code your way!

### Variables (12+ ways!)
```azalea
form num x from 10
let num x = 10
var num x is 10
const num x equals 10
set num x to 10
create num x from 10
make num x = 10
declare num x as 10
define num x = 10
init num x = 10
new num x = 10
```

### Functions (8+ ways!)
```azalea
act add a b do
    give a plus b
end

def add a b {
    return a + b
}

fn add a b then
    return a + b
end

function add a b {
    return a + b
}

method add a b do
    give a plus b
end

procedure add a b {
    return a + b
}
```

### Conditionals (6+ ways!)
```azalea
if x > 10 do
    say Big
end

when x > 10 then
    say Big
end

whenever x > 10 do
    say Big
end

provided x > 10 {
    say Big
}

assuming x > 10 do
    say Big
end

given x > 10 {
    say Big
}
```

### Loops (7+ ways!)
```azalea
loop 10 do
    say step
end

while x < 10 {
    say x
}

for 10 do
    say step
end

repeat 5 do
    say step
end

each items do
    say step
end

foreach items {
    say step
}

iterate items do
    say step
end
```

### Output (8+ ways!)
```azalea
say Hello
print World
output Test
display Result
log Debug
echo Message
show Data
write Text
```

## Quick Start

### Installation

```bash
# Build C++ compiler
make native

# Build TypeScript interpreter
npm install
npm run build:ts

# Build WASM for browser
make wasm
```

### Hello World

```azalea
say Hello World
form num a from ten
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

- `form`/`let`/`var`/`const`/`set`/`create`/`make`/`declare`/`define`/`init`/`new` - declare variable
- `act`/`def`/`fn`/`func`/`function`/`method`/`procedure` - define function
- `call` - invoke function
- `give`/`return`/`yield`/`send` - return value
- `say`/`print`/`output`/`display`/`log`/`echo`/`show`/`write` - print output
- `if`/`when`/`whenever`/`provided`/`assuming`/`given` - conditional
- `loop`/`while`/`for`/`repeat`/`each`/`foreach`/`iterate` - iteration
- `put`/`assign`/`update` - assign value

### Types

- `num` - number
- `text` - string
- `bool` - boolean
- `list` - array
- `map` - object
- `void` - no type

### Modules - Universal Language Features

**Web & Frontend:**
- `view` - UI components (replaces HTML/CSS/JS)
- `web` - Web APIs, DOM, events (replaces JavaScript)
- `serve` - Web server (replaces Express/Node.js)
- `markdown` - Markdown rendering (replaces static site generators)

**Backend & APIs:**
- `net` - Networking (replaces HTTP clients)
- `file` - File operations (replaces fs modules)
- `database` - Database operations (replaces SQL/ORM)
- `query` - SQL-like queries (replaces SQL)

**Data & Processing:**
- `csv` - CSV processing (replaces Pandas)
- `file` - File I/O (replaces Python file operations)

**Concurrency:**
- `go` - Goroutines (replaces Go concurrency)
- `channel` - Channels (replaces Go channels)

**System:**
- `run` - Shell commands (replaces Bash/Python subprocess)
- `vm` - Virtual machine

**Other:**
- `play` - Game engine

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
- `flexible_syntax.az` - All the flexible syntax variations

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

### Vercel

The website is configured for Vercel deployment:
- `api/index.js` - Serverless function
- `vercel.json` - Routing configuration
- All `.az` files are routed through the function to prevent downloads

Deploy:
```bash
vercel --prod
```

## Building

### Requirements

- C++17 compiler (g++ or clang++)
- Node.js 20.x
- TypeScript 5.x
- Emscripten (for WASM builds)
- Make

### Build Commands

```bash
# Native C++ build
make native

# TypeScript build
npm run build:ts

# WASM build
make wasm

# All builds
npm run build:all
```

## Key Features

### 🎨 **Super Flexible Syntax - Write Your Way!**
Write code in **any style** you prefer - all work perfectly:
- Variables: `form`, `let`, `var`, `const`, `set`, `create`, `make`, `declare`, `define`, `init`, `new`
- Functions: `act`, `def`, `fn`, `func`, `function`, `method`, `procedure`
- Conditionals: `if`, `when`, `whenever`, `provided`, `assuming`, `given`
- Loops: `loop`, `while`, `for`, `repeat`, `each`, `foreach`, `iterate`
- Operators: `plus`/`+`, `minus`/`-`, `times`/`*`, `div`/`/`
- Output: `say`, `print`, `output`, `display`, `log`, `echo`, `show`, `write`

### ⚡ **True Hybrid Runtime - Maximum Efficiency**
- **Uses BOTH TypeScript AND WASM simultaneously** - true hybrid execution
- **TypeScript Interpreter** - Fast startup, easy debugging, rapid development
- **WASM-Compiled C++** - Maximum performance, near-native speed
- **Automatic validation** - Both runtimes execute and validate each other
- **Smart fallback** - If one fails, the other continues
- **Most efficient language** on the planet - best of both worlds

### 💅 **Full CSS Support - Stunning UIs!**
Complete CSS capabilities with shortcuts:
- All CSS properties supported
- Shortcuts: `bg` (background), `fg` (color), `p` (padding), `m` (margin)
- Gradients, shadows, animations, transitions
- Flexbox, Grid, positioning
- Hover effects and responsive design

## Documentation

- **[Language Specification](docs/language_spec.md)** - Complete syntax reference
- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started quickly
- **[For Kids](docs/FOR_KIDS.md)** - Super simple guide for beginners
- **[UI Guide](docs/UI_GUIDE.md)** - Build beautiful interfaces
- **[CSS Guide](docs/CSS_GUIDE.md)** - Full CSS styling reference
- **[Flexible Syntax](docs/FLEXIBLE_SYNTAX.md)** - All syntax variations
- **[Dual Mode](docs/DUAL_MODE.md)** - C++ + TypeScript architecture
- **[Command Reference](docs/AZALEA_COMMANDS.md)** - All commands
- **[Backend Guide](docs/BACKEND_GUIDE.md)** - Create powerful APIs
- **[Architecture](ARCHITECTURE.md)** - How Azalea works

## Why Azalea is the Most Efficient Language

1. **Dual Mode**: Compile for performance, interpret for speed
2. **Super Flexible Grammar**: Write code your way
3. **Universal**: Works everywhere - browser, server, native, embedded
4. **Optimizable**: Change syntax, change mode, optimize anything
5. **Complete**: Do anything - UI, backend, system programming, everything

## License

MIT
