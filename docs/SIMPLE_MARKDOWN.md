# Azalea Simple Markdown

Azalea's markdown is **ultra simple** - as flexible as the rest of the language!

## Auto-Detection

Markdown is **automatically detected** and rendered:
- Files ending in `.md` are automatically rendered
- Content that looks like markdown (no Azalea keywords) is auto-rendered
- No need to explicitly call markdown functions!

## Ultra Simple Syntax

### Headers - Many Ways!

```
big Title
BIG Title
big: Title
medium Subtitle
small Section
# Traditional
## Also works
### All ways work!
```

### Bold Text - Super Flexible!

```
bold this text
strong this text
**traditional**
__also works__
```

### Lists - Just Write!

```
- item one
- item two
* also works
+ or this
item one
item two
1. numbered
2. also works
```

### Links - Natural Language!

```
link to https://example.com as Click here
https://example.com as My link
text -> url
text => url
[text](url)  // traditional
```

### Images - Easy!

```
image https://example.com/image.png
img https://example.com/image.png
image: https://example.com/image.png
![alt](url)  // traditional
```

### Code - Simple!

```
code variable name
code: some code here
`inline code`
```code block```
```

## Examples

### Just Write Markdown

```
big My Page Title

This is a paragraph with bold text and regular text.

- First item
- Second item
- Third item

That's it! Auto-rendered!
```

### In Azalea Code

```azalea
// Auto-detects and renders
form text page from "big Hello\nThis is content"
say page  // Automatically renders as HTML

// Or explicitly
call markdown parse "big Title\nContent here"

// Or serve a file
call markdown serve "page.md"
```

## Comparison

### Traditional Markdown
```markdown
# Title
## Subtitle
**bold** text
- item
[link](url)
```

### Azalea Simple Markdown
```
big Title
medium Subtitle
bold text
- item
link to url as link
```

**Much simpler!** Write naturally, Azalea understands!

