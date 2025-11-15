#!/bin/bash

# Azalea Language Build Script

set -e

echo "🌺 Building Azalea Language..."

# Check for Emscripten
if command -v emcc &> /dev/null; then
    echo "✓ Emscripten found"
    HAS_EMSCRIPTEN=true
else
    echo "⚠ Emscripten not found - skipping WASM build"
    HAS_EMSCRIPTEN=false
fi

# Create directories
mkdir -p build bin web

# Build native interpreter
echo "Building native interpreter..."
g++ -std=c++17 -Wall -Wextra -O2 -c src/azalea.cpp -o build/azalea.o
g++ -std=c++17 -Wall -Wextra -O2 -c src/main.cpp -o build/main.o
g++ build/azalea.o build/main.o -o bin/azalea

echo "✓ Native build complete: bin/azalea"

# Build WASM if Emscripten is available
if [ "$HAS_EMSCRIPTEN" = true ]; then
    echo "Building WASM..."
    emcc -std=c++17 -O2 \
         -s WASM=1 \
         -s EXPORTED_FUNCTIONS='["_azalea_execute","_azalea_print","_malloc","_free"]' \
         -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString"]' \
         -s ALLOW_MEMORY_GROWTH=1 \
         -s MODULARIZE=1 \
         -s EXPORT_NAME="'AzaleaModule'" \
         --bind \
         src/azalea.cpp src/main.cpp \
         -o web/azalea.js
    
    echo "✓ WASM build complete: web/azalea.js"
    
    # Copy WASM file if it exists separately
    if [ -f web/azalea.wasm ]; then
        echo "✓ WASM file: web/azalea.wasm"
    fi
fi

echo ""
echo "🌺 Build complete!"
echo ""
echo "Usage:"
echo "  Native: ./bin/azalea examples/hello.az"
if [ "$HAS_EMSCRIPTEN" = true ]; then
    echo "  Web:    Open web/index.html in a browser"
fi

