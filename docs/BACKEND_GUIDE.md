# Azalea Backend Development Guide

Build powerful backends with Azalea's clean, simple syntax.

## Philosophy

- **One language** - Frontend and backend in Azalea
- **Minimal setup** - No frameworks, no config files
- **Super fast** - Efficient execution
- **Easy to learn** - Simple syntax for complex operations

## Starting a Server

### Basic Server

```azalea
call serve on 3000
say Server running!
```

### With Handler

```azalea
act home req do
    give "Hello from Azalea!"
end

call serve get "/" give home
call serve on 3000
```

## Routes

### GET Route

```azalea
act get_users req do
    form list users from ["Alice", "Bob"]
    call serve json users
end

call serve get "/users" give get_users
```

### POST Route

```azalea
act create_user req do
    form text name from req
    say Creating user
    say name
    call serve json "Created"
end

call serve post "/users" give create_user
```

### PUT Route

```azalea
act update_user req do
    form text id from req
    say Updating user
    say id
    call serve json "Updated"
end

call serve put "/users/:id" give update_user
```

### DELETE Route

```azalea
act delete_user req do
    form text id from req
    say Deleting user
    say id
    call serve json "Deleted"
end

call serve delete "/users/:id" give delete_user
```

## Complete API Example

```azalea
// Users API
act get_users req do
    form list users from ["Alice", "Bob", "Charlie"]
    call serve json users
end

act create_user req do
    form text name from req
    say Creating
    say name
    call serve json "Created"
end

act update_user req do
    form text id from req
    say Updating
    say id
    call serve json "Updated"
end

// Routes
call serve get "/users" give get_users
call serve post "/users" give create_user
call serve put "/users/:id" give update_user
call serve delete "/users/:id" give delete_user

// Static files
call serve static "/public"

// Start server
call serve on 3000
say API ready!
```

## Advanced Patterns

### Request Parsing

```azalea
act handle_post req do
    form text body from req
    form text method from req
    say Method
    say method
    say Body
    say body
    call serve json "OK"
end
```

### Error Handling

```azalea
act safe_handler req do
    if req same "" do
        call serve json "Error: empty request"
    else do
        call serve json "OK"
    end
end
```

### Middleware Pattern

```azalea
act logger req do
    say Request received
    say req
end

act handler req do
    call logger req
    call serve json "Response"
end
```

## File Serving

```azalea
call serve static "/public"
call serve static "/assets"
```

## JSON Responses

```azalea
form map data from {}
put "name" to data "Alice"
put "age" to data 25

call serve json data
```

## Complex Backend Example

```azalea
// Database simulation
form map users from {}

act create_user req do
    form text name from req
    put name to users name
    call serve json "User created"
end

act get_user req do
    form text name from req
    form text user from users name
    call serve json user
end

act list_users req do
    call serve json users
end

// API routes
call serve post "/users" give create_user
call serve get "/users/:name" give get_user
call serve get "/users" give list_users

// Start
call serve on 3000
say Complex backend running!
```

## Best Practices

1. **Organize routes** - Group related routes together
2. **Use functions** - Keep handlers in `act` functions
3. **Handle errors** - Check inputs before processing
4. **Use JSON** - Standard format for APIs
5. **Test locally** - Run on localhost first

## Performance Tips

- Azalea is designed for efficiency
- Functions are fast
- Minimal overhead
- Perfect for microservices

## Deployment

### Local

```bash
./bin/azalea server.az
```

### Production

- Use process manager (PM2, systemd)
- Run on port 80/443 with reverse proxy
- Enable HTTPS
- Monitor logs

## Next Steps

- Try examples in `examples/backend_*.az`
- Build your own API
- Add database integration
- Deploy to production

