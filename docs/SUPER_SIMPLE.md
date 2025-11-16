# SUPER SIMPLE Azalea

Azalea is now **SUPER SIMPLE** to write! No unnecessary keywords, just write naturally.

## Key Simplifications

### 1. No "call" Keyword Needed!

**Before:**
```azalea
call view h1 "Title"
call web fetch "https://api.example.com"
```

**Now - SUPER SIMPLE:**
```azalea
view h1 "Title"
web fetch "https://api.example.com"
```

Just write the module name directly!

### 2. Simple Variable Assignment

**Multiple ways - all work:**
```azalea
name = "Azalea"
name from "Azalea"
form name from "Azalea"
let name = "Azalea"
```

### 3. Simple Functions

**With braces:**
```azalea
greet name {
    say "Hello" name
}
```

**With do/end:**
```azalea
greet name do
    say "Hello" name
end
```

### 4. Simple Conditionals

```azalea
if count > 5 {
    say "Big!"
}
```

### 5. Simple Loops

```azalea
loop 5 {
    say step
}

each items {
    say step
}
```

## Complete Example - SUPER SIMPLE!

```azalea
// Variables
name = "Azalea"
count = 10

// Output
say "Hello World"
say name

// Module calls - NO "call" needed!
view h1 "Welcome"
view p "This is super simple!"

// Functions
greet name {
    say "Hello" name
}

// Conditionals
if count > 5 {
    say "Big number!"
}

// Loops
loop 5 {
    say step
}

// Complete webpage - SUPER SIMPLE!
web title "My Page"

view header {
    view h1 "Welcome"
    view nav {
        view a "/" "Home"
        view a "/about" "About"
    }
}

view main {
    view h2 "Content"
    view p "This is super simple!"
    
    view form {
        view input "name" placeholder "Name"
        view button "Submit" {
            web fetch "/api/submit" data
            say "Submitted!"
        }
    }
}
```

## Comparison

### Before (Still Works!)
```azalea
call view h1 "Title"
form name from "Azalea"
act greet name do
    say "Hello" name
end
```

### Now - SUPER SIMPLE!
```azalea
view h1 "Title"
name = "Azalea"
greet name {
    say "Hello" name
}
```

**Much simpler!** Write naturally, Azalea understands!

## All Module Calls Simplified

```azalea
// View module
view h1 "Title"
view button "Click" { say "Clicked!" }
view form { view input "name" }

// Web module
web title "Page"
web fetch "https://api.example.com"
web storage "key" "value"

// Net module
net get "https://api.example.com"

// File module
file read "file.txt"
file write "file.txt" "content"

// Serve module
serve on 3000
serve get "/" handler

// Play module
play game "MyGame"
play sprite "player"

// Markdown module
markdown parse "# Title"
markdown serve "page.md"
```

No "call" needed - just write the module name!

## Benefits

1. **Less typing** - No "call" keyword
2. **More natural** - Write like you speak
3. **Cleaner code** - Less clutter
4. **Still flexible** - All old syntax still works!

Azalea is now **SUPER SIMPLE** to write!

