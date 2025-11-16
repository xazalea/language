# Azalea Super Flexible Grammar

Azalea has the **loosest grammar** of any programming language. Write code your way - there are many ways to write the same thing!

## Philosophy

- **No wrong way**: All syntaxes work
- **Personal preference**: Use what feels natural
- **Team flexibility**: Different developers can use different styles
- **Learning curve**: Use familiar syntax from other languages
- **Express yourself**: Code is art, write it your way

## Variable Declaration (12+ Ways!)

All of these are identical:

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

## Function Definition (8+ Ways!)

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

// Method style
method add a b do
    give a plus b
end

// Procedure style
procedure add a b {
    return a + b
}
```

## Conditionals (6+ Ways!)

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

// Whenever style
whenever x > 10 do
    say Big
end

// Provided style
provided x > 10 {
    say Big
}

// Assuming style
assuming x > 10 do
    say Big
end

// Given style
given x > 10 {
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

## Loops (7+ Ways!)

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

// Foreach
foreach items {
    say step
}

// Iterate
iterate items do
    say step
end
```

## Output (8+ Ways!)

Many ways to print:

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

## Operators (Multiple Styles!)

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
if x same 10 do say Equal end
if x equals 10 do say Equal end
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

## Return Statements (4+ Ways!)

```azalea
give result
return result
yield result
send result
```

## Block Delimiters (Flexible!)

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

// begin/done style
if x > 10 begin
    say Big
done
```

## Assignment (Many Variations!)

```azalea
// from
form num x from 10

// is
form num x is 10

// equals
form num x equals 10

// to
form num x to 10

// as
form num x as 10

// becomes
form num x becomes 10

// = symbol
form num x = 10
```

## Function Calls (Flexible!)

```azalea
// Standard
call add 5 10

// Can also use parentheses (flexible)
call add(5, 10)

// Or mix
call add 5, 10

// Without call keyword (if function is defined)
add 5 10
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

// Use Azalea style for output
say Result
```

## Why Super Flexible Grammar?

1. **Personal Preference**: Write how you like
2. **Team Flexibility**: Different developers can use different styles
3. **Learning Curve**: Use familiar syntax from other languages
4. **No Errors**: All variations work perfectly
5. **Freedom**: Express yourself in code!
6. **Efficiency**: Choose the syntax that makes you most productive

## Complete Keyword List

### Variable Declaration
- `form`, `let`, `var`, `const`, `set`, `create`, `make`, `declare`, `define`, `init`, `new`

### Function Definition
- `act`, `def`, `fn`, `func`, `function`, `method`, `procedure`

### Conditionals
- `if`, `when`, `whenever`, `provided`, `assuming`, `given`

### Loops
- `loop`, `while`, `for`, `repeat`, `each`, `foreach`, `iterate`

### Output
- `say`, `print`, `output`, `display`, `log`, `echo`, `show`, `write`

### Return
- `give`, `return`, `yield`, `send`

### Assignment
- `from`, `is`, `equals`, `to`, `as`, `becomes`, `=`

### Block Start
- `do`, `then`, `when`, `begin`, `{`

### Block End
- `end`, `finish`, `done`, `}`

### Operators
- `plus`/`+`/`add`, `minus`/`-`/`subtract`, `times`/`*`/`multiply`, `div`/`/`/`divide`
- `over`/`>`/`greater`, `under`/`<`/`less`, `same`/`==`/`equals`/`is`/`are`
- `and`/`&&`/`andalso`, `or`/`||`/`orelse`

## Examples

### Same Code, Different Styles

**Style 1: Azalea Native**
```azalea
form num x from ten
act add a b do
    give a plus b
end
if x over five do
    say Big
end
loop ten do
    say step
end
```

**Style 2: JavaScript-like**
```azalea
let x = 10
def add a b {
    return a + b
}
if x > 5 {
    say Big
}
for 10 do
    say step
end
```

**Style 3: Python-like**
```azalea
var x = 10
fn add a b then
    return a + b
end
when x > 5 then
    say Big
end
repeat 10 do
    say step
end
```

**Style 4: Mixed**
```azalea
form num x from 10
function add a b {
    return a + b
}
provided x > 5 {
    display "Big"
}
iterate 10 do
    log step
end
```

All of these are **identical** in functionality!

## Best Practices

1. **Be consistent** - Pick a style and stick with it in a project
2. **Team preference** - Let your team choose their style
3. **Readability** - Use what's most readable for you
4. **Mix carefully** - Mixing styles is fine, but be consistent within functions
5. **Express yourself** - Code is art, write it your way!

Azalea gives you the freedom to write code exactly how you want. There's no wrong way - only your way!

