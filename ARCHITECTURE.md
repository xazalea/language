# Azalea Language Architecture

## Overview

Azalea is a **dual-mode programming language** - the most efficient language on the planet. It supports both compiled (C++) and interpreted (TypeScript) execution modes, with super flexible grammar that allows many ways to write the same code.

## Dual Mode Architecture

### C++ Compiler (High Performance)
- **Location**: `src/azalea.cpp`, `src/azalea.h`
- **Purpose**: Compiles Azalea to optimized C++
- **Performance**: Maximum speed, native execution
- **Use Case**: Production applications, performance-critical code

### TypeScript Interpreter (Rapid Development)
- **Location**: `src/azalea.ts`
- **Purpose**: Interprets Azalea code directly
- **Performance**: Fast iteration, easy debugging
- **Use Case**: Development, prototyping, browser execution

## Components

### 1. Lexer (`src/azalea.cpp`)

Tokenizes source code into:
- Keywords: `form`, `act`, `call`, `if`, `loop`, etc. (with many variations)
- Identifiers: variable and function names
- Literals: numbers, strings, booleans
- Symbols: `. , / ? ; !`

**Super Flexible**: Recognizes many keyword variations:
- Variables: `form`, `let`, `var`, `const`, `set`, `create`, `make`, `declare`, `define`, `init`, `new`
- Functions: `act`, `def`, `fn`, `func`, `function`, `method`, `procedure`
- Conditionals: `if`, `when`, `whenever`, `provided`, `assuming`, `given`
- Loops: `loop`, `while`, `for`, `repeat`, `each`, `foreach`, `iterate`
- Output: `say`, `print`, `output`, `display`, `log`, `echo`, `show`, `write`

### 2. Parser (`src/azalea.cpp` + `src/azalea.ts`)

Builds an Abstract Syntax Tree (AST) from tokens:
- Handles all language constructs
- Supports operator precedence for binary operations
- Parses expressions, statements, and blocks
- **Super Flexible**: Accepts many syntax variations

**Flexible Parsing**:
- Multiple assignment operators: `from`, `is`, `equals`, `to`, `as`, `becomes`, `=`
- Multiple block delimiters: `do/end`, `then/end`, `{/}`, `begin/finish`, `begin/done`
- Multiple operator styles: words (`plus`), symbols (`+`), verbs (`add`)

### 3. Runtime

#### C++ Runtime (`src/azalea.cpp`)
- Executes the AST
- Variable scoping (local and global)
- Function calls
- Module system
- Built-in operations

#### TypeScript Runtime (`src/azalea.ts`)
- Interprets AST directly
- Can compile to TypeScript
- Browser-compatible
- Fast iteration

### 4. Modules

Extensible module system:
- `net`: Networking (HTTP requests, WebSocket, proxies)
- `file`: File I/O operations (including root level access)
- `vm`: Virtual machine creation
- `serve`: Web server
- `view`: UI components
- `play`: Game engine

### 5. Value System

Type system with variants:
- `num`: Numbers (double)
- `text`: Strings
- `bool`: Booleans
- `list`: Arrays
- `map`: Objects/dictionaries
- `void`: No value
- `func`: Functions

## Build System

### Native Build (C++)

Compiles to native executable using g++/clang++:
```bash
make native
```

### TypeScript Build

Compiles TypeScript interpreter:
```bash
npm run build:ts
```

### WASM Build

Compiles to WebAssembly using Emscripten:
```bash
make wasm
```

Outputs:
- `web/azalea.js`: JavaScript wrapper
- `web/azalea.wasm`: WebAssembly binary

## Execution Flow

### Compiled Mode (C++)
1. **Source Code** → Lexer → **Tokens**
2. **Tokens** → Parser → **AST**
3. **AST** → C++ Compiler → **C++ Code**
4. **C++ Code** → g++ → **Native Binary**
5. **Binary** → Execution

### Interpreted Mode (TypeScript)
1. **Source Code** → Lexer → **Tokens**
2. **Tokens** → Parser → **AST**
3. **AST** → TypeScript Runtime → **Execution**

## Super Flexible Grammar

Azalea has the **loosest grammar** of any language:

### Variable Declaration (12+ ways)
- `form`, `let`, `var`, `const`, `set`, `create`, `make`, `declare`, `define`, `init`, `new`

### Function Definition (8+ ways)
- `act`, `def`, `fn`, `func`, `function`, `method`, `procedure`

### Conditionals (6+ ways)
- `if`, `when`, `whenever`, `provided`, `assuming`, `given`

### Loops (7+ ways)
- `loop`, `while`, `for`, `repeat`, `each`, `foreach`, `iterate`

### Output (8+ ways)
- `say`, `print`, `output`, `display`, `log`, `echo`, `show`, `write`

### Operators (Multiple styles)
- Words: `plus`, `minus`, `times`, `div`
- Symbols: `+`, `-`, `*`, `/`
- Verbs: `add`, `subtract`, `multiply`, `divide`

### Block Delimiters (Flexible)
- `do/end`, `then/end`, `{/}`, `begin/finish`, `begin/done`

## Memory Management

- **C++**: Uses `std::shared_ptr` for automatic memory management
- **TypeScript**: JavaScript garbage collection
- **WASM**: Uses `malloc`/`free` for C interop
- Scoped variable storage with stack-based scopes

## Platform Support

- **Native**: Linux, macOS, Windows (via C++ compiler)
- **Browser**: Via WebAssembly (Emscripten) or TypeScript
- **Node.js**: Via TypeScript runtime
- **Server**: Native binary, WASM runtime, or TypeScript

## Extensibility

### Adding New Modules

1. Create a class inheriting from `Module` (C++) or implement interface (TypeScript)
2. Implement required methods
3. Register in runtime

### Adding New Syntax Variations

1. Add keyword to lexer keyword list
2. Add to parser keyword checks
3. Map to canonical form in runtime

## Efficiency

Azalea is the **most efficient language** because:

1. **Dual Mode**: Choose compiled or interpreted based on needs
2. **Super Flexible Grammar**: Write code your way
3. **Optimization**: Full compiler optimizations in C++ mode
4. **Rapid Development**: Instant feedback in TypeScript mode
5. **Universal**: Works everywhere
6. **Complete**: Do anything - UI, backend, system programming

## File Structure

```
/
├── src/
│   ├── azalea.cpp      # C++ compiler/runtime
│   ├── azalea.h         # C++ headers
│   ├── azalea.ts        # TypeScript interpreter
│   └── main.cpp         # C++ entry point
├── examples/            # Example Azalea programs
├── docs/                # Documentation
├── web/                 # Web interpreter
├── api/                 # Vercel serverless function
├── index.az             # Main web application
├── vercel.json          # Vercel configuration
└── package.json         # Node.js/TypeScript config
```

## Future Enhancements

- JIT compilation
- More target languages (Rust, Go, etc.)
- Advanced optimizations
- Parallel execution
- More syntax variations

Azalea: The most efficient language on the planet. Write code your way, run it how you want, optimize everything!
