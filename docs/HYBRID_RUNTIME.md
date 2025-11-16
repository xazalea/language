# Azalea Hybrid Runtime

Azalea is a **true hybrid language** - it uses BOTH interpreted (TypeScript) AND compiled (WASM/C++) execution **simultaneously**.

## How It Works

### Dual Execution

When you run Azalea code, it executes in **both** runtimes at the same time:

1. **TypeScript Interpreter** - Fast startup, easy debugging, rapid iteration
2. **WASM-Compiled C++** - Maximum performance, native speed

### Execution Modes

#### Hybrid Mode (Default)
- Both runtimes execute the code simultaneously
- Results are validated against each other
- Uses WASM result (more performant) when both succeed
- Falls back to TypeScript if WASM fails
- Falls back to WASM if TypeScript fails

#### TypeScript Only
- Uses only the TypeScript interpreter
- Fastest startup time
- Best for development and debugging

#### WASM Only
- Uses only the compiled C++ runtime
- Maximum performance
- Best for production workloads

## Benefits

### 1. **Validation**
- Both runtimes execute the same code
- If results differ, you know there's a bug
- Ensures correctness across implementations

### 2. **Performance**
- TypeScript: Fast startup, good for quick iterations
- WASM: Maximum speed for production
- Hybrid: Best of both worlds

### 3. **Reliability**
- If one runtime fails, the other can still execute
- Automatic fallback ensures code always runs
- Cross-validation catches implementation bugs

### 4. **Development Experience**
- TypeScript for rapid development
- WASM for performance testing
- Both for validation

## Usage

### Web Playground

The web playground automatically uses hybrid mode:

```javascript
const runtime = new AzaleaHybridRuntime();
await runtime.initialize();
const results = await runtime.execute(code);
```

### Programmatic Use

```javascript
// Initialize hybrid runtime
const runtime = new AzaleaHybridRuntime();
const status = await runtime.initialize();

// Execute code (uses both runtimes)
const results = await runtime.execute(sourceCode);

// Check results
if (results.hybrid.success) {
    console.log('Output:', results.hybrid.output);
    console.log('Validated:', results.hybrid.validated);
    console.log('Runtime used:', results.hybrid.runtime);
}

// Profile performance
const profile = await runtime.executeWithProfiling(sourceCode);
console.log('TS time:', profile.ts.time, 'ms');
console.log('WASM time:', profile.wasm.time, 'ms');
```

## Architecture

```
┌─────────────────────────────────────┐
│      Azalea Source Code             │
└──────────────┬──────────────────────┘
               │
               ├──────────────────────┐
               │                      │
               ▼                      ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ TypeScript       │    │ WASM (C++)        │
    │ Interpreter      │    │ Compiled Runtime  │
    │                  │    │                   │
    │ - Fast startup   │    │ - Max performance │
    │ - Easy debug     │    │ - Native speed    │
    │ - Rapid iter     │    │ - Production     │
    └────────┬─────────┘    └────────┬─────────┘
             │                      │
             └──────────┬───────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Hybrid Results  │
              │                  │
              │ - Validated      │
              │ - Combined       │
              │ - Best available │
              └──────────────────┘
```

## Performance Comparison

| Operation | TypeScript | WASM | Hybrid |
|-----------|-----------|------|--------|
| Startup   | ⚡ Fast    | 🐌 Slow | ⚡ Fast |
| Execution | 🚀 Good    | ⚡⚡⚡ Excellent | ⚡⚡⚡ Excellent |
| Debugging | ✅ Easy    | ❌ Hard | ✅ Easy |
| Validation| ❌ None    | ❌ None | ✅ Both |

## When to Use Each Mode

### Use Hybrid Mode When:
- You want maximum reliability
- You need performance validation
- You're in production
- You want to catch implementation bugs

### Use TypeScript Only When:
- Rapid development
- Quick iterations
- Debugging
- WASM not available

### Use WASM Only When:
- Maximum performance needed
- Production workloads
- TypeScript unavailable
- Performance-critical code

## Implementation Details

### TypeScript Runtime
- Pure JavaScript/TypeScript
- No compilation needed
- Runs immediately
- Full source access for debugging

### WASM Runtime
- Compiled from C++ using Emscripten
- Near-native performance
- Optimized execution
- Production-ready

### Hybrid Coordination
- Both execute simultaneously
- Results are compared
- Best result is selected
- Errors are aggregated
- Performance is profiled

## Future Enhancements

- **Smart Routing**: Automatically route code to best runtime
- **Parallel Execution**: True parallel execution in Web Workers
- **Result Merging**: Combine results from both runtimes
- **Performance Learning**: Learn which runtime is better for each code pattern
- **Hot Switching**: Switch between runtimes based on performance

