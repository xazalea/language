# Azalea Dual Mode: C++ Compiled + TypeScript Interpreted

Azalea is the **most efficient language on the planet** because it supports both compiled and interpreted execution modes, giving you maximum flexibility and performance.

## Architecture

### C++ Compiler (High Performance)
- **Compiles** Azalea code to optimized C++
- **Maximum performance** for production applications
- **Native speed** execution
- **Low-level control** when needed

### TypeScript Interpreter (Rapid Development)
- **Interprets** Azalea code directly
- **Fast iteration** during development
- **Easy debugging** and testing
- **Browser-compatible** execution

## Usage

### Compile Mode (C++)
```bash
# Compile Azalea to C++
azalea compile program.az --target cpp

# Or use the C++ compiler directly
make native
./bin/azalea program.az
```

### Interpret Mode (TypeScript)
```bash
# Run with TypeScript interpreter
azalea run program.az

# Or use Node.js
node -r azalea-ts program.az
```

## Why Dual Mode?

### Compiled Mode Benefits
- **Maximum Performance**: Native C++ speed
- **Optimization**: Full compiler optimizations
- **Production Ready**: Best for deployed applications
- **Resource Efficient**: Minimal runtime overhead

### Interpreted Mode Benefits
- **Fast Development**: Instant feedback
- **Easy Debugging**: Step through code easily
- **Cross-Platform**: Works everywhere TypeScript runs
- **Dynamic**: No compilation step needed

## Super Flexible Grammar

Azalea has the **loosest grammar** of any language. Write code your way!

### Variable Declaration (12+ ways!)
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

### Function Definition (8+ ways!)
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

### Operators (Multiple styles!)
```azalea
// Word style
form num sum from 5 plus 10
form num diff from 20 minus 5
form num prod from 3 times 4
form num quot from 20 div 4

// Verb style
form num sum from 5 add 10
form num diff from 20 subtract 5
form num prod from 3 multiply 4
form num quot from 20 divide 4

// Symbol style
form num sum from 5 + 10
form num diff from 20 - 5
form num prod from 3 * 4
form num quot from 20 / 4
```

### Comparisons (Many variations!)
```azalea
// Symbols
if x > 10 do say Big end
if x < 10 do say Small end
if x >= 10 do say BigOrEqual end
if x <= 10 do say SmallOrEqual end
if x == 10 do say Equal end
if x != 10 do say NotEqual end

// Words
if x over 10 do say Big end
if x under 10 do say Small end
if x greater 10 do say Big end
if x less 10 do say Small end
if x same 10 do say Equal end
if x equals 10 do say Equal end
if x is 10 do say Equal end
if x are 10 do say Equal end
if x notequal 10 do say NotEqual end
```

### Block Delimiters (Flexible!)
```azalea
// do/end style
if x > 10 do
    say Big
end

// then/end style
if x > 10 then
    say Big
end

// brace style
if x > 10 {
    say Big
}

// begin/finish style
if x > 10 begin
    say Big
finish
```

## Mix and Match

You can mix different styles in the same file:

```azalea
// Use Azalea style for variables
form num x from 10

// Use JavaScript style for functions
def add a b {
    return a + b
}

// Use Python style for loops
for 10 do
    say step
end

// Use traditional style for conditionals
if x > 5 {
    say Big
}
```

## Efficiency

Azalea is the **most efficient language** because:

1. **Compile for Performance**: Use C++ mode for maximum speed
2. **Interpret for Speed**: Use TypeScript mode for rapid development
3. **Choose Your Style**: Write code the way that makes sense to you
4. **Optimize Everything**: Change syntax, change mode, optimize anything
5. **Universal**: Works everywhere - browser, server, native, embedded

## Examples

### Compiled Example
```azalea
// High-performance computation
act fibonacci n do
    if n same 0 do
        give 0
    end
    if n same 1 do
        give 1
    end
    give call fibonacci n minus 1 plus call fibonacci n minus 2
end

// Compile: azalea compile --target cpp
// Result: Optimized C++ binary
```

### Interpreted Example
```azalea
// Rapid prototyping
def quick_test {
    let x = 10
    print x
    when x > 5 then
        display "Big!"
    end
}

// Run: azalea run
// Result: Instant execution
```

## Best Practices

1. **Development**: Use TypeScript interpreter for fast iteration
2. **Production**: Compile to C++ for maximum performance
3. **Consistency**: Pick a style and stick with it in a project
4. **Team**: Let team members use their preferred syntax
5. **Optimization**: Switch modes based on performance needs

Azalea gives you the power to write code your way, run it how you want, and optimize everything!

