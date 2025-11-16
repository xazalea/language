# Azalea Markdown Support

Azalea's hybrid runtime includes built-in markdown support for easy static page hosting.

## Features

- **Parse markdown** to HTML
- **Serve markdown files** as static pages
- **Render markdown** with custom styling
- **Execute Azalea code** from markdown code blocks

## Usage

### Parse Markdown

```azalea
form text md from "# Hello World

This is **markdown**!

- Item 1
- Item 2"

form text html from call markdown parse md
say html
```

### Serve Markdown File

```azalea
// Serve a markdown file as HTML
form text html from call markdown serve "page.md"
say html
```

### With Custom Styling

```azalea
form text style from "
    body { background: #f5f5f5; }
    h1 { color: #667eea; }
"

form text html from call markdown render "page.md" style style
say html
```

## Markdown Syntax Supported

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Code**: `` `code` `` or ` ```code``` ``
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Lists**: `- item` or `* item` or `1. item`
- **Horizontal rules**: `---` or `***`
- **Paragraphs**: Automatic

## Static Page Hosting

### Simple Server

```azalea
// Serve markdown pages
act serve_page path do
    form text html from call markdown serve path
    call serve json html
end

call serve get "/" give serve_page "index.md"
call serve get "/about" give serve_page "about.md"
call serve on 3000
```

### With Routing

```azalea
// Route markdown files
call serve get "/" give serve_page "index.md"
call serve get "/docs" give serve_page "docs.md"
call serve get "/blog" give serve_page "blog.md"

call serve on 3000
say Markdown server running!
```

## Markdown with Azalea Code

Markdown files can contain Azalea code blocks:

```markdown
# My Page

Here's some code:

```azalea
say Hello from markdown!
form num count from 5
loop count do
    say step
end
```

The code will execute when the markdown is processed.
```

## Integration with Hybrid Runtime

The markdown module is part of the hybrid runtime, so it works with both:
- **TypeScript interpreter** - Fast parsing
- **WASM-compiled C++** - Maximum performance

Both runtimes execute markdown operations simultaneously for validation.

## Examples

See `examples/markdown_server.az` for a complete example of serving markdown pages.

