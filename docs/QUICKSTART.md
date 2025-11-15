# Azalea Quick Start Guide

## Installation

### Prerequisites

- C++17 compiler (g++ or clang++)
- Make
- Emscripten (optional, for WASM builds)

### Build

```bash
# Build native interpreter
make native

# Build WASM for browser
make wasm

# Build both
make all
```

## Running Code

### Command Line

```bash
# Run a file
./bin/azalea examples/hello.az

# Run inline code
./bin/azalea -e "say Hello World"
```

### Web Browser

1. Build WASM: `make wasm`
2. Open `web/index.html` in a browser
3. Write code and click "Run"

## Language Basics

### Variables

```azalea
form num a from ten
form text name from "Alice"
form bool flag from true
```

### Functions

```azalea
act greet name do
    say Hello
    say name
end

call greet "World"
```

### Conditionals

```azalea
form num a from ten
form num b from five

if a over b do
    say a
    say is greater
end
```

### Loops

```azalea
loop ten do
    say step
end
```

### Arithmetic

```azalea
form num a from five
form num b from three
form num sum from a plus b
form num prod from a times b
```

### Comparisons

```azalea
if a over b do say a end
if a under b do say b end
if a same b do say equal end
```

## Examples

See `examples/` directory for complete examples:
- `hello.az` - Hello World
- `functions.az` - Function definitions
- `conditionals.az` - If statements
- `loops.az` - Loop constructs
- `vm_example.az` - VM creation
- `server_example.az` - Web server
- `ui_example.az` - UI components
- `net_example.az` - Networking
- `file_example.az` - File operations

## Deployment

### GitHub Pages

1. Build WASM: `make wasm`
2. Commit and push to GitHub
3. Enable GitHub Pages for `web/` directory

### Vercel

1. Build WASM: `make wasm`
2. Deploy: `vercel --prod`

The `vercel.json` is already configured.

