# Azalea Command Reference

Complete reference for all Azalea commands, including basic operations, file access, networking, proxies, and advanced features.

## Core Commands

### Variables
```azalea
form type name from value    // Declare and initialize
form type name               // Declare without initialization
put value to name            // Assign value
name give value              // Alternative assignment
```

### Functions
```azalea
act name param1 param2 do    // Define function
    statements
end

call name arg1 arg2          // Call function
give value                   // Return value
```

### Control Flow
```azalea
if condition do              // Conditional
    statements
end

if condition do statements end else do statements end

loop count do                // Loop with count
    statements
end

loop list do                 // Loop over list
    statements
end
```

### Output
```azalea
say value                    // Print to console
say "Hello World"            // Print string
say variable                 // Print variable
```

## File Operations

### Basic File Access
```azalea
call file read path put content      // Read file
call file write path with data       // Write file
call file exists path put result     // Check if file exists
call file delete path                // Delete file
```

### Root Level File Access
```azalea
// Access files from root directory
call file read "/etc/passwd" put content
call file read "/var/log/system.log" put log
call file read "/root/config.json" put config

// Write to root locations (requires permissions)
call file write "/tmp/azalea_temp.txt" with data
```

### File System Operations
```azalea
call file list path put files        // List directory contents
call file mkdir path                 // Create directory
call file rmdir path                 // Remove directory
call file copy source to dest       // Copy file
call file move source to dest        // Move/rename file
call file size path put size         // Get file size
call file type path put type         // Get file type (file/dir)
```

### Advanced File Operations
```azalea
call file append path with data      // Append to file
call file read_lines path put lines  // Read file as list of lines
call file write_lines path with lines // Write list as lines
call file chmod path with mode       // Change permissions
call file chown path with owner      // Change owner
```

## Networking

### HTTP Requests
```azalea
call net get url put response        // GET request
call net post url with data put response  // POST request
call net put url with data put response   // PUT request
call net delete url put response     // DELETE request
```

### Advanced Networking
```azalea
call net request method url with data put response  // Custom method
call net header name value                          // Set header
call net timeout seconds                            // Set timeout
call net ssl verify true                            // SSL verification
```

### WebSocket
```azalea
call net ws connect url put socket  // Connect WebSocket
call net ws send socket with message // Send message
call net ws receive socket put message // Receive message
call net ws close socket             // Close connection
```

## Proxy Operations

### Create Proxy
```azalea
// Simple HTTP proxy
act proxy_handler req do
    form text url from req
    call net get url put data
    give data
end

call serve proxy "/proxy" give proxy_handler
```

### Advanced Proxy
```azalea
// Proxy with authentication
act secure_proxy req do
    form text url from req
    form text auth from "Bearer token123"
    call net header "Authorization" auth
    call net get url put response
    give response
end

// Reverse proxy
act reverse_proxy target do
    act handler req do
        form text path from req
        form text full_url from target plus path
        call net get full_url put data
        give data
    end
    give handler
end

call serve proxy "/api" give call reverse_proxy "https://api.example.com"
```

### Proxy Features
```azalea
call proxy make from url             // Create proxy instance
call proxy forward request           // Forward request
call proxy cache enable              // Enable caching
call proxy rate_limit requests per second // Rate limiting
call proxy filter block url_pattern  // URL filtering
```

## System Operations

### Process Management
```azalea
call sys exec command put output     // Execute system command
call sys spawn command               // Spawn background process
call sys kill pid                    // Kill process
call sys list_processes put processes // List running processes
```

### Environment
```azalea
call sys env name put value          // Get environment variable
call sys env_set name value          // Set environment variable
call sys cwd put directory           // Get current working directory
call sys chdir path                  // Change directory
```

### System Info
```azalea
call sys hostname put name           // Get hostname
call sys platform put os             // Get OS platform
call sys arch put architecture       // Get architecture
call sys memory put mem_info         // Get memory info
call sys cpu put cpu_info            // Get CPU info
```

## Database Operations

### SQL Database
```azalea
call db connect url put connection   // Connect to database
call db query connection with sql put results // Execute query
call db insert connection table with data // Insert data
call db update connection table with data // Update data
call db delete connection table with condition // Delete data
call db close connection             // Close connection
```

### NoSQL Database
```azalea
call db create collection name       // Create collection
call db insert collection with data  // Insert document
call db find collection with query put results // Find documents
call db update collection with query and data // Update documents
call db delete collection with query // Delete documents
```

## Advanced Features

### Virtual Machine
```azalea
call vm make core 4 mem 8_g          // Create VM with 4 cores, 8GB RAM
call vm start vm_id                   // Start VM
call vm stop vm_id                    // Stop VM
call vm status vm_id put status      // Get VM status
call vm exec vm_id with command put output // Execute in VM
```

### Cryptography
```azalea
call crypto hash data with algorithm put hash // Hash data
call crypto encrypt data with key put encrypted // Encrypt
call crypto decrypt encrypted with key put data // Decrypt
call crypto sign data with key put signature // Sign data
call crypto verify data signature with key put valid // Verify signature
```

### Date and Time
```azalea
call time now put timestamp          // Get current timestamp
call time format timestamp with format put formatted // Format date
call time parse date_string put timestamp // Parse date
call time add timestamp with duration put new_time // Add duration
```

### JSON Operations
```azalea
call json parse string put object    // Parse JSON string
call json stringify object put string // Convert to JSON string
call json get object path put value  // Get nested value
call json set object path value       // Set nested value
```

### Regular Expressions
```azalea
call regex match pattern text put result // Match pattern
call regex replace pattern text with replacement put result // Replace
call regex find_all pattern text put matches // Find all matches
```

## Module System

### Import/Export
```azalea
from module import function          // Import function
from module import *                 // Import all
to module export function            // Export function
```

### Custom Modules
```azalea
// Create module
act my_module do
    act function1 do
        give "result"
    end
    give {function1: function1}
end

// Use module
form map module from call my_module
call module function1 put result
```

## Error Handling

```azalea
try do
    call risky_operation
end catch error do
    say "Error occurred:"
    say error
end

// Assert
assert condition "Error message"

// Guard
guard condition "Error message"
```

## Concurrency

```azalea
call async function arg1 arg2 put future // Run async
call await future put result            // Wait for result
call parallel tasks put results         // Run in parallel
call sleep seconds                      // Sleep
```

## Examples

### Complete Proxy Server
```azalea
act proxy_server target_url do
    act handler req do
        form text method from req method
        form text path from req path
        form text full_url from target_url plus path
        
        if method same "GET" do
            call net get full_url put response
        end
        if method same "POST" do
            call net post full_url with req body put response
        end
        
        give response
    end
    give handler
end

call serve proxy "/api" give call proxy_server "https://api.example.com"
call serve on 3000
```

### File Server
```azalea
act file_server root_path do
    act handler req do
        form text path from root_path plus req path
        call file read path put content
        give content
    end
    give handler
end

call serve static "/files" give call file_server "/var/www"
call serve on 3000
```

### System Monitor
```azalea
act monitor do
    call sys memory put mem
    call sys cpu put cpu
    call sys list_processes put processes
    
    say "Memory:"
    say mem
    say "CPU:"
    say cpu
    say "Processes:"
    say processes
end

loop 10 do
    call monitor
    call sleep 1
end
```

## Command Categories

### Basic Commands
- `form`, `put`, `give`, `say`
- `if`, `loop`, `act`, `call`
- `from`, `to`, `with`, `as`

### File Commands
- `file read`, `file write`, `file exists`
- `file list`, `file mkdir`, `file copy`
- `file chmod`, `file chown`

### Network Commands
- `net get`, `net post`, `net put`, `net delete`
- `net ws connect`, `net ws send`
- `proxy make`, `proxy forward`

### System Commands
- `sys exec`, `sys spawn`, `sys kill`
- `sys env`, `sys cwd`, `sys hostname`
- `sys memory`, `sys cpu`

### Advanced Commands
- `vm make`, `vm start`, `vm exec`
- `crypto hash`, `crypto encrypt`
- `db connect`, `db query`
- `json parse`, `json stringify`
- `regex match`, `regex replace`
- `async`, `await`, `parallel`

This comprehensive command set makes Azalea a powerful, standalone programming language capable of handling everything from basic operations to advanced system-level tasks.

