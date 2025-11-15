# Azalea Language Specification

## Core Philosophy
- Short, logical, Latin-like with light English roots
- Minimal symbols: only `. , / ? ; !`
- Not sentence-based, not verbose
- Extremely easy for beginners
- Extremely powerful for experts
- Fully interpreted, no compile step

## Word List

### Core Verbs
- `form` - declare/create variable
- `act` - function definition
- `call` - invoke function
- `give` - return/assign
- `say` - print/output
- `do` - execute block
- `end` - close block
- `if` - conditional
- `loop` - iteration
- `over` - comparison operator
- `from` - source/input
- `put` - assign/store
- `make` - create instance
- `on` - bind/listen
- `serve` - start server
- `view` - UI component
- `read` - file read
- `write` - file write

### Operators
- `over` - greater than (>)
- `under` - less than (<)
- `same` - equals (==)
- `not` - negation
- `and` - logical and
- `or` - logical or

### Types
- `num` - number
- `text` - string
- `list` - array
- `map` - object/dictionary
- `bool` - boolean
- `void` - no type

### Keywords
- `from` - import/input
- `to` - output/export
- `with` - parameters/options
- `as` - type cast/alias

## Grammar Rules

### Variable Declaration
```
form type name from value
form type name
```

### Function Definition
```
act name param1 param2 do
    statements
end
```

### Function Call
```
call name arg1 arg2
```

### Assignment
```
put value to name
name give value
```

### Conditional
```
if condition do
    statements
end

if condition do statements end else do statements end
```

### Loop
```
loop count do
    statements
end

loop list do
    statements
end
```

### Return
```
give value
```

### Print
```
say value
```

### Comparison
```
if a over b do
if a under b do
if a same b do
if a not same b do
```

### Module Access
```
call net get url
call file read path
call vm make core mem
call serve on port give handler
call view pane title text
```

## Examples

### Basic Variables
```
form num a from ten
form text u from user
form bool flag from true
```

### Functions
```
act sum a b do
    give a plus b
end

call sum five ten
```

### Conditionals
```
if a over b do
    say a
end
```

### Loops
```
loop ten do
    say step
end
```

### Networking
```
call net get https:/site.com put data
call net post url with data put result
```

### File Operations
```
call file read /sys/info put out
call file write path with data
```

### VM Creation
```
vm make core eight mem four_g
```

### Server
```
serve on four_zero_zero_zero give main
```

### UI
```
view pane title Sol text Lumen
view button text Click do call handler end
```

## Symbol Usage
- `.` - decimal point, method chaining
- `,` - list separator
- `/` - division, path separator
- `?` - optional/nullable
- `;` - statement separator (optional)
- `!` - assertion/required

## Comments
```
// single line comment
/* multi-line comment */
```

