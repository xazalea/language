// Vercel serverless function for Azalea
// Handles all routes and serves the Azalea application

module.exports = async (req, res) => {
  // CRITICAL: Set headers FIRST - before ANY other code
  // This MUST happen immediately to prevent file downloads
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'inline');
  
  try {
    // Get the path - Vercel passes original URL in req.url after rewrite
    let path = req.url || req.path || '/';
    
    // Handle query parameters
    if (req.query && typeof req.query === 'object') {
      // Vercel might pass path in query
      if (req.query.path) {
        path = req.query.path;
      }
    }
    
    // Remove query string and hash from path
    path = path.split('?')[0].split('#')[0];
    
    // Normalize path
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // FORCE all .az files to be handled as HTML
    if (path.endsWith('.az') || path.includes('.az')) {
      path = '/';
    }
    
    const method = (req.method || 'GET').toUpperCase();
    
    // Route handling
    if (path === '/' || path === '/index.html' || path === '' || path === '/index.az') {
      return res.status(200).end(getLandingPageHTML());
    } else if (path === '/playground' || path.startsWith('/playground')) {
      return res.status(200).end(getPlaygroundPageHTML());
    } else if (path === '/lessons' || path.startsWith('/lessons')) {
      return res.status(200).end(getLessonsPageHTML());
    } else if (path === '/ai-help' && method === 'POST') {
      return handleAIHelp(res, req);
    } else {
      // Default to landing page for ANY route
      return res.status(200).end(getLandingPageHTML());
    }
  } catch (error) {
    console.error('Error in serverless function:', error);
    // Even on error, return HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).end(`
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"><title>Azalea - Error</title></head>
        <body style="font-family: system-ui; padding: 2rem;">
          <h1>🌺 Azalea</h1>
          <p>Error: ${error.message}</p>
          <p>Path: ${req.url || '/'}</p>
          <p><a href="/">Go Home</a></p>
        </body>
      </html>
    `);
  }
};

function getLandingPageHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azalea - Elegant Programming Language</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        a { text-decoration: none; color: inherit; }
        .btn { cursor: pointer; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: bold; display: inline-block; }
        pre[class*="language-"] { margin: 0; }
    </style>
</head>
<body>
    <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center;">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">🌺 Azalea</h1>
        <p style="font-size: 1.5rem; opacity: 0.9; margin-bottom: 2rem;">Super easy to learn • Perfect stepping stone to JavaScript & beyond</p>
        <p style="font-size: 1rem; opacity: 0.8; margin-bottom: 2rem;">Write code your way with super flexible grammar • Build creativity while learning</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="/playground" class="btn" style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 8px;">Get Started</a>
            <a href="/lessons" class="btn" style="background: transparent; color: white; border: 2px solid white; padding: 1rem 2rem; border-radius: 8px;">Learn</a>
        </div>
    </header>
    <main style="padding: 4rem 2rem; max-width: 1200px; margin: 0 auto;">
        <section style="margin-bottom: 4rem;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Why Azalea?</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                <div style="padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                    <h3 style="color: #667eea; margin-bottom: 1rem;">🎯 Super Easy</h3>
                    <p>Start coding in minutes! No complex syntax to memorize. Perfect for absolute beginners.</p>
                </div>
                <div style="padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                    <h3 style="color: #667eea; margin-bottom: 1rem;">🚀 Learn JavaScript Next</h3>
                    <p>Azalea concepts map directly to JavaScript. Master Azalea, then easily transition to JS!</p>
                </div>
                <div style="padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                    <h3 style="color: #667eea; margin-bottom: 1rem;">✨ Super Flexible</h3>
                    <p>Write code your way! 12+ ways to create variables, 8+ ways to write functions. Be creative!</p>
                </div>
            </div>
        </section>
        <section style="background: #f5f5f5; padding: 3rem; border-radius: 12px;">
            <h2 style="margin-bottom: 2rem;">Try It Now</h2>
            <pre class="language-azalea" style="background: #1e1e1e; padding: 1.5rem; border-radius: 8px; overflow-x: auto;"><code>say Hello World
form num a from ten
say a</code></pre>
            <a href="/playground" class="btn" style="background: #667eea; color: white; margin-top: 1rem;">Run in Playground</a>
        </section>
    </main>
    <footer style="background: #2d3748; color: white; padding: 2rem; text-align: center;">
        <p>Made with Azalea - From beginner to professional</p>
    </footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script>
        // Azalea language definition for Prism.js
        Prism.languages.azalea = {
            'comment': {
                pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
                greedy: true
            },
            'string': {
                pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
                greedy: true
            },
            'keyword': {
                pattern: /\b(?:form|let|var|const|set|create|make|declare|define|init|new|act|def|fn|func|function|method|procedure|call|if|when|whenever|provided|assuming|given|else|elseif|loop|while|for|repeat|each|foreach|iterate|do|then|begin|end|finish|done|say|print|output|display|log|echo|show|write|from|is|equals|to|as|becomes|return|break|continue|true|false|null|num|text|bool|list|map)\b/i,
                greedy: true
            },
            'number': /\b\d+(?:\.\d+)?\b/,
            'operator': /[+\-*/=<>!&|]+/,
            'punctuation': /[{}[\];(),.:]/
        };
        Prism.highlightAll();
    </script>
</body>
</html>`;
}

function getPlaygroundPageHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azalea Playground</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .btn { cursor: pointer; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: bold; }
        #editor { font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; resize: none; outline: none; background: #1e1e1e; color: #d4d4d4; padding: 1rem; line-height: 1.6; tab-size: 4; }
        #editor-container { position: relative; }
        #editor-highlight { position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 1rem; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.6; color: transparent; background: transparent; pointer-events: none; white-space: pre-wrap; word-wrap: break-word; overflow: hidden; tab-size: 4; }
        #editor { position: relative; z-index: 1; background: transparent; caret-color: #fff; }
        .token.comment { color: #6a9955; }
        .token.string { color: #ce9178; }
        .token.keyword { color: #569cd6; }
        .token.number { color: #b5cea8; }
        .token.operator { color: #d4d4d4; }
        .token.punctuation { color: #d4d4d4; }
    </style>
</head>
<body>
    <header style="background: #2d3748; color: white; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0;">🎮 Playground</h1>
        <div style="display: flex; gap: 1rem;">
            <a href="/" class="btn" style="background: transparent; color: white; border: 1px solid white;">Landing</a>
            <a href="/lessons" class="btn" style="background: transparent; color: white; border: 1px solid white;">Lessons</a>
        </div>
    </header>
    <main style="display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 80px); gap: 0;">
        <div style="display: flex; flex-direction: column; border-right: 1px solid #e0e0e0;">
            <div style="background: #f5f5f5; padding: 1rem; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
                <strong>Code Editor</strong>
                <button class="btn" style="background: #667eea; color: white;" onclick="runCode()">Run</button>
            </div>
            <div id="editor-container" style="flex: 1; position: relative; overflow: hidden;">
                <pre id="editor-highlight" class="language-azalea"><code id="highlight-code"></code></pre>
                <textarea id="editor" spellcheck="false" style="flex: 1; border: none; width: 100%; height: 100%;">say Hello World
form num a from ten
say a
loop five do
    say step
end</textarea>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; background: #1e1e1e;">
            <div style="background: #2d3748; color: white; padding: 1rem; border-bottom: 1px solid #333;">
                <strong>Output</strong>
            </div>
            <div id="output" style="flex: 1; padding: 1rem; color: #d4d4d4; font-family: monospace; font-size: 14px; overflow-y: auto; white-space: pre-wrap;">Ready to run code...</div>
        </div>
    </main>
    <div style="background: #f5f5f5; padding: 2rem; border-top: 1px solid #e0e0e0;">
        <h3 style="margin-bottom: 1rem;">🤖 Need Help? Ask AI</h3>
        <textarea id="ai_question" placeholder="Ask a question about Azalea..." style="width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; min-height: 100px; margin-bottom: 1rem;"></textarea>
        <button class="btn" style="background: #667eea; color: white; padding: 0.75rem 1.5rem;" onclick="getAIHelp()">Get AI Help</button>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script>
        // Azalea language definition
        Prism.languages.azalea = {
            'comment': { pattern: /\/\/.*|\/\*[\s\S]*?\*\//, greedy: true },
            'string': { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, greedy: true },
            'keyword': {
                pattern: /\b(?:form|let|var|const|set|create|make|declare|define|init|new|act|def|fn|func|function|method|procedure|call|if|when|whenever|provided|assuming|given|else|elseif|loop|while|for|repeat|each|foreach|iterate|do|then|begin|end|finish|done|say|print|output|display|log|echo|show|write|from|is|equals|to|as|becomes|return|break|continue|true|false|null|num|text|bool|list|map)\b/i,
                greedy: true
            },
            'number': /\b\d+(?:\.\d+)?\b/,
            'operator': /[+\-*/=<>!&|]+/,
            'punctuation': /[{}[\];(),.:]/
        };
        
        const editor = document.getElementById('editor');
        const highlightCode = document.getElementById('highlight-code');
        const highlightPre = document.getElementById('editor-highlight');
        
        function updateHighlight() {
            const code = editor.value;
            highlightCode.textContent = code;
            Prism.highlightElement(highlightCode);
        }
        
        editor.addEventListener('input', updateHighlight);
        editor.addEventListener('scroll', () => {
            highlightPre.scrollTop = editor.scrollTop;
            highlightPre.scrollLeft = editor.scrollLeft;
        });
        updateHighlight();
        
        function runCode() {
            const code = editor.value;
            const output = document.getElementById('output');
            output.textContent = 'Running code...\\n\\nNote: Full code execution requires Azalea runtime integration.';
        }
        
        async function getAIHelp() {
            const question = document.getElementById('ai_question').value;
            if (!question) return;
            const response = await fetch('/ai-help', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await response.json();
            alert('AI Response: ' + data.answer);
        }
    </script>
</body>
</html>`;
}

function getLessonsPageHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learn Azalea</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .btn { cursor: pointer; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: bold; }
        pre[class*="language-"] { margin: 0; }
    </style>
</head>
<body>
    <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; margin-bottom: 0.5rem;">📚 Learn Azalea</h1>
                <div style="display: flex; gap: 2rem; align-items: center;">
                    <span style="opacity: 0.9;">Level: <strong>1</strong></span>
                    <span style="opacity: 0.9;">XP: <strong>0</strong></span>
                </div>
            </div>
            <div style="display: flex; gap: 1rem;">
                <a href="/" class="btn" style="background: transparent; color: white; border: 1px solid white;">Landing</a>
                <a href="/playground" class="btn" style="background: transparent; color: white; border: 1px solid white;">Playground</a>
            </div>
        </div>
    </header>
    <main style="display: grid; grid-template-columns: 300px 1fr; min-height: calc(100vh - 120px); gap: 0;">
        <div style="background: #f5f5f5; border-right: 1px solid #e0e0e0; overflow-y: auto; padding: 1rem;">
            <h3 style="margin-bottom: 1rem;">Lessons</h3>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; background: #667eea; color: white; cursor: pointer;">0. Hello World</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">1. Variables</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">2. Math Operations</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">3. Conditionals</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">4. Loops</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">5. Functions</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">6. Lists</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">7. UI Components</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">8. Styling</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">9. Forms</div>
            <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">10. Advanced Functions</div>
        </div>
        <div style="display: flex; flex-direction: column; padding: 2rem; overflow-y: auto;">
            <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #4caf50;">
                <p style="font-weight: bold; margin-bottom: 0.5rem;">🎯 Why Azalea?</p>
                <p style="font-size: 0.9rem; line-height: 1.6;">Azalea is SUPER easy! No complex syntax. Once you master Azalea, learning JavaScript will be a breeze. The concepts are the same, just different words!</p>
            </div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #667eea;">Lesson 0: Hello World</h2>
            <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="font-weight: bold; margin-bottom: 0.5rem;">Goal:</p>
                <p>Print 'Hello World' - Your first program!</p>
            </div>
            <p style="line-height: 1.6; margin-bottom: 1rem;">In Azalea, printing is super simple. Just use <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 4px;">say</code> (or any of 8+ other words!).</p>
            <pre class="language-azalea" style="background: #1e1e1e; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; overflow-x: auto;"><code>say Hello World</code></pre>
            <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="font-weight: bold; margin-bottom: 0.5rem;">💡 Super Flexible - Write Your Way!</p>
                <p style="margin-bottom: 0.5rem;">All of these work the same:</p>
                <pre style="background: #f5f5f5; padding: 0.75rem; border-radius: 4px; font-size: 0.85rem; overflow-x: auto;"><code>say Hello World
print Hello World
output Hello World
display Hello World
log Hello World</code></pre>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Choose what feels natural to you! This flexibility builds creativity.</p>
            </div>
            <div style="background: #e1f5fe; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <p style="font-weight: bold; margin-bottom: 0.5rem;">🚀 JavaScript Comparison:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                    <div>
                        <p style="font-weight: bold; color: #667eea;">Azalea (Super Easy!)</p>
                        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0.75rem; border-radius: 4px; margin-top: 0.5rem;"><code>say Hello World</code></pre>
                    </div>
                    <div>
                        <p style="font-weight: bold; color: #667eea;">JavaScript (You'll learn this next!)</p>
                        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0.75rem; border-radius: 4px; margin-top: 0.5rem;"><code>console.log("Hello World");</code></pre>
                    </div>
                </div>
                <p style="margin-top: 0.75rem; font-size: 0.85rem; opacity: 0.8;">See? Same concept! Azalea uses simple words, JS uses functions. Master Azalea first, then JS will make perfect sense!</p>
            </div>
            <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="font-weight: bold; margin-bottom: 0.5rem;">✨ Creativity Tip:</p>
                <p style="font-size: 0.9rem;">Try different keywords! Use <code style="background: white; padding: 2px 6px; border-radius: 4px;">print</code>, <code style="background: white; padding: 2px 6px; border-radius: 4px;">display</code>, or <code style="background: white; padding: 2px 6px; border-radius: 4px;">log</code> instead of <code style="background: white; padding: 2px 6px; border-radius: 4px;">say</code>. They all work! This flexibility lets you express yourself.</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <a href="/playground" class="btn" style="background: #667eea; color: white; padding: 1rem 2rem; border-radius: 8px;">Try in Playground</a>
                <button class="btn" style="background: #28a745; color: white; padding: 1rem 2rem; border-radius: 8px;">Mark Complete</button>
            </div>
            <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem;">🤖 Need Help? Ask AI</h3>
                <textarea id="lesson_question" placeholder="Ask about this lesson..." style="width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; min-height: 100px; margin-bottom: 1rem;"></textarea>
                <button class="btn" style="background: #667eea; color: white; padding: 0.75rem 1.5rem;" onclick="getAIHelp()">Get AI Help</button>
            </div>
        </div>
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script>
        // Azalea language definition for Prism.js
        Prism.languages.azalea = {
            'comment': { pattern: /\/\/.*|\/\*[\s\S]*?\*\//, greedy: true },
            'string': { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, greedy: true },
            'keyword': {
                pattern: /\b(?:form|let|var|const|set|create|make|declare|define|init|new|act|def|fn|func|function|method|procedure|call|if|when|whenever|provided|assuming|given|else|elseif|loop|while|for|repeat|each|foreach|iterate|do|then|begin|end|finish|done|say|print|output|display|log|echo|show|write|from|is|equals|to|as|becomes|return|break|continue|true|false|null|num|text|bool|list|map)\b/i,
                greedy: true
            },
            'number': /\b\d+(?:\.\d+)?\b/,
            'operator': /[+\-*/=<>!&|]+/,
            'punctuation': /[{}[\];(),.:]/
        };
        Prism.highlightAll();
        
        async function getAIHelp() {
            const question = document.getElementById('lesson_question').value;
            if (!question) return;
            const response = await fetch('/ai-help', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await response.json();
            alert('AI Response: ' + data.answer);
        }
    </script>
</body>
</html>`;
}

async function handleAIHelp(res, req) {
  try {
    let body = '';
    if (req.on) {
      req.on('data', chunk => { body += chunk.toString(); });
      await new Promise(resolve => req.on('end', resolve));
    } else {
      body = JSON.stringify(req.body || {});
    }
    
    const parsed = JSON.parse(body || '{}');
    const question = parsed.question || '';
    
    const answer = question 
      ? `I'm here to help! For "${question}", here's some guidance about Azalea: Use 'form' (or 'let', 'var', 'const', 'set', 'create', 'make', 'declare', 'define', 'init', 'new') for variables, 'act' (or 'def', 'fn', 'func', 'function', 'method', 'procedure') for functions, 'call' to invoke, 'say' (or 'print', 'output', 'display', 'log', 'echo', 'show', 'write') to print, 'if' (or 'when', 'whenever', 'provided', 'assuming', 'given') for conditionals, and 'loop' (or 'while', 'for', 'repeat', 'each', 'foreach', 'iterate') for iteration. Azalea has SUPER flexible grammar - write code your way!`
      : "I'm here to help! Try asking about Azalea syntax, concepts, or debugging your code. Remember: Azalea has super flexible grammar with many ways to write the same code!";
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ answer });
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: error.message });
  }
}
