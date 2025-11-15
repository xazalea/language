# Azalea Language Architecture

## Overview

Azalea is a fully interpreted programming language written in C++ with WASM support for browser execution.

## Components

### 1. Lexer (`src/azalea.cpp`)

Tokenizes source code into:
- Keywords: `form`, `act`, `call`, `if`, `loop`, etc.
- Identifiers: variable and function names
- Literals: numbers, strings, booleans
- Symbols: `. , / ? ; !`

### 2. Parser (`src/azalea.cpp`)

Builds an Abstract Syntax Tree (AST) from tokens:
- Handles all language constructs
- Supports operator precedence for binary operations
- Parses expressions, statements, and blocks

### 3. Runtime (`src/azalea.cpp`)

Executes the AST:
- Variable scoping (local and global)
- Function calls
- Module system
- Built-in operations

### 4. Modules

Extensible module system:
- `net`: Networking (HTTP requests)
- `file`: File I/O operations
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

### Native Build

Compiles to native executable using g++/clang++:
```bash
make native
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

1. **Source Code** → Lexer → **Tokens**
2. **Tokens** → Parser → **AST**
3. **AST** → Runtime → **Execution**

## Memory Management

- Uses `std::shared_ptr` for automatic memory management
- WASM exports use `malloc`/`free` for C interop
- Scoped variable storage with stack-based scopes

## Platform Support

- **Native**: Linux, macOS, Windows (via C++ compiler)
- **Browser**: Via WebAssembly (Emscripten)
- **Node.js**: Via WASM (future: native addon)
- **Server**: Native binary or WASM runtime

## Extensibility

### Adding New Modules

1. Create a class inheriting from `Module`
2. Implement `call()` method
3. Register in `Runtime` constructor

### Adding New Operators

1. Add to `opPrecedence` map in `parseBinaryOp()`
2. Add evaluation logic in `Runtime::evaluate()` for `BINARY_OP`

### Adding New Keywords

1. Add to `keywords` vector in `Lexer`
2. Add parsing logic in `Parser`
3. Add evaluation logic in `Runtime`

## Performance Considerations

- Single-pass parsing
- AST caching (future optimization)
- Lazy evaluation (future optimization)
- JIT compilation (future optimization)

## Security

- Sandboxed execution (module-dependent)
- No direct memory access from Azalea code
- Type checking at runtime
- Scope isolation

## Future Enhancements

- Type system improvements
- Standard library
- Package manager
- Debugger
- Profiler
- REPL mode
- Syntax highlighting
- Language server protocol

