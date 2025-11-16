# Azalea - The Universal Language

Azalea combines the **best features** from all popular languages into one **super simple** language that works for **everything**.

## One Language for Everything

### Static Sites
```azalea
// Generate static HTML
h1 Welcome
p This is a static site
```

### Frontend (React/Vue/Angular replacement)
```azalea
// Build interactive UIs
header {
    h1 My App
    nav {
        a / Home
        a /about About
    }
}

main {
    form {
        input name placeholder Name
        button Submit {
            web fetch /api/submit data
        }
    }
}
```

### Backend Servers (Node.js/Express replacement)
```azalea
// Build APIs and servers
serve get / {
    give "Hello World"
}

serve post /api/users {
    form data from request.body
    give data
}

serve on 3000
```

### APIs (REST/GraphQL)
```azalea
// REST API
serve get /api/users {
    give users
}

serve post /api/users {
    form user from request.body
    users.append user
    give user
}

// GraphQL-like queries
query users {
    filter age > 18
    give result
}
```

### CLI Tools (Python/Bash replacement)
```azalea
// Command line tools
act main args {
    each args {
        say step
    }
}
```

### Data Processing (Python/Pandas replacement)
```azalea
// Process data
form data from file.read "data.json"
each data {
    if step.age > 18 {
        adults.append step
    }
}
```

## Features from Popular Languages

### Python Simplicity
```azalea
// Python-like simplicity
name = "Azalea"
count = 10
items = [1, 2, 3]

each items {
    say step
}
```

### JavaScript Flexibility
```azalea
// JavaScript-like flexibility
act callback {
    say "Called!"
}

web on "click" callback
```

### Go Concurrency
```azalea
// Go-like goroutines
go {
    say "Running in parallel"
}

// Channels
form ch from channel
ch.send "message"
form msg from ch.receive
```

### Rust Safety
```azalea
// Rust-like safety
form result from safe {
    form data from risky.operation
    give data
}

if result.error {
    say result.error
} else {
    say result.value
}
```

### TypeScript Types
```azalea
// TypeScript-like types
form num count from 10
form text name from "Azalea"
form list items from [1, 2, 3]
```

### SQL Queries
```azalea
// SQL-like queries
form users from query {
    select * from users
    where age > 18
    order by name
}
```

### Shell Scripting
```azalea
// Shell-like commands
run "ls -la"
run "git status"
form output from run "echo Hello"
```

## Use Cases

### 1. Static Site Generator
```azalea
// Generate static HTML
each pages {
    form html from render page
    file.write page.path html
}
```

### 2. Frontend Framework
```azalea
// React-like components
act Button text {
    button text {
        web on "click" {
            say "Clicked!"
        }
    }
}

Button "Click Me"
```

### 3. Backend API
```azalea
// Express-like API
serve get /api/users {
    give users
}

serve post /api/users {
    form user from request.body
    users.append user
    give user
}
```

### 4. Web Server
```azalea
// Full web server
serve static "/public"
serve get "/" {
    give render "index.html"
}
serve on 8080
```

### 5. CLI Tool
```azalea
// Command line tool
act main args {
    if args.length > 0 {
        say "Hello" args[0]
    } else {
        say "Hello World"
    }
}
```

### 6. Data Processing
```azalea
// Process CSV
form data from csv.read "data.csv"
form filtered from data.filter { step.age > 18 }
csv.write "filtered.csv" filtered
```

### 7. Database Operations
```azalea
// Database queries
form db from database.connect "postgres://..."
form users from db.query "SELECT * FROM users"
each users {
    say step.name
}
```

### 8. Microservices
```azalea
// Microservice
serve get /health {
    give { status: "ok" }
}

serve post /process {
    form result from process request.body
    give result
}
```

## Grammar Doesn't Matter

Write **any way** you want:

```azalea
// All of these work the same:
say Hello World
say Hello World 5
5 say Hello World
say. Hello World
say.Hello World 5

// Variables
name = Azalea
name from Azalea
form name from Azalea

// Functions
greet name { say Hello name }
greet name do say Hello name end

// HTML
h1 Title
view h1 Title
h1 "Title"
```

## Performance

- **Hybrid Runtime**: TypeScript (fast startup) + WASM (maximum speed)
- **Compiled**: Can compile to native code
- **Efficient**: No overhead, direct execution

## One Language to Rule Them All

Replace:
- **Python** - for scripting and data processing
- **JavaScript/TypeScript** - for frontend and backend
- **Go** - for servers and concurrency
- **Rust** - for safety and performance
- **SQL** - for database queries
- **Bash** - for shell scripting
- **HTML/CSS** - for web pages

All in **one simple language**!

