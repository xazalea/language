# Flexible Syntax Guide

Azalea gives you **complete freedom** to write code your way. Multiple syntaxes for the same operation - choose what feels natural!

## Variable Declaration

All of these work identically:

```azalea
form num x from 10
let num x = 10
var num x is 10
const num x equals 10
set num x to 10
create num x from 10
```

## Function Definition

Choose your style:

```azalea
// Azalea style
act add a b do
    give a plus b
end

// JavaScript-like
def add a b {
    return a + b
}

// Python-like
fn add a b then
    return a + b
end

// Traditional
function add a b {
    return a + b
}
```

## Conditionals

Many ways to write if statements:

```azalea
// Azalea style
if x > 10 do
    say Big
end

// When style
when x > 10 then
    say Big
end

// Brace style
if x > 10 {
    say Big
}

// With else
if x > 10 do
    say Big
else do
    say Small
end

// Or
if x > 10 {
    say Big
} otherwise {
    say Small
}
```

## Loops

Multiple loop styles:

```azalea
// Azalea style
loop 10 do
    say step
end

// While loop
while x < 10 {
    say x
    x = x + 1
}

// For loop
for 10 do
    say step
end

// Repeat
repeat 5 do
    say step
end

// Each (for lists)
each items do
    say step
end
```

## Output

Many ways to print:

```azalea
say Hello
print World
output Test
display Result
log Debug
```

## Operators

### Arithmetic

```azalea
// Symbol style
form num sum from 5 + 10
form num diff from 20 - 5
form num prod from 3 * 4
form num quot from 20 / 4
form num mod from 20 % 3
form num pow from 2 ** 3

// Word style
form num sum from 5 plus 10
form num diff from 20 minus 5
form num prod from 3 times 4
form num quot from 20 div 4
form num mod from 20 mod 3
form num pow from 2 power 3

// Verb style
form num sum from 5 add 10
form num diff from 20 subtract 5
form num prod from 3 multiply 4
form num quot from 20 divide 4
```

### Comparison

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
if x equals 10 do say Equal end
if x same 10 do say Equal end
if x is 10 do say Equal end
if x are 10 do say Equal end
if x notequal 10 do say NotEqual end
```

### Logical

```azalea
// Symbols
if x > 5 && x < 10 do say Middle end
if x < 5 || x > 10 do say Outside end

// Words
if x > 5 and x < 10 do say Middle end
if x < 5 or x > 10 do say Outside end

// Alternative words
if x > 5 andalso x < 10 do say Middle end
if x < 5 orelse x > 10 do say Outside end
```

## Return Statements

```azalea
give result
return result
```

## Function Calls

```azalea
// Standard
call add 5 10

// Can also use parentheses (flexible)
call add(5, 10)

// Or mix
call add 5, 10
```

## CSS Styling

### Full Property Names

```azalea
call view div style "background-color" "blue"
                 style "font-size" "16px"
                 style "border-radius" "8px"
                 style "box-shadow" "0 2px 4px rgba(0,0,0,0.1)"
```

### Shortcuts

```azalea
call view div style "bg" "blue"        // background-color
                 style "fg" "white"    // color
                 style "w" "100px"     // width
                 style "h" "50px"      // height
                 style "m" "10px"      // margin
                 style "p" "20px"      // padding
                 style "b" "1px solid" // border
                 style "br" "8px"      // border-radius
                 style "fs" "16px"     // font-size
                 style "fw" "bold"     // font-weight
                 style "ff" "Arial"    // font-family
                 style "ta" "center"   // text-align
                 style "d" "flex"      // display
                 style "pos" "absolute" // position
                 style "z" "10"       // z-index
                 style "op" "0.8"      // opacity
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

## Best Practices

1. **Be consistent** - Pick a style and stick with it in a project
2. **Team preference** - Let your team choose their style
3. **Readability** - Use what's most readable for you
4. **Mix carefully** - Mixing styles is fine, but be consistent within functions

## Why Flexible Syntax?

- **Personal preference** - Write how you like
- **Team flexibility** - Different developers can use different styles
- **Learning curve** - Use familiar syntax from other languages
- **No errors** - All variations work perfectly
- **Freedom** - Express yourself in code!

