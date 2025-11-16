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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh; 
            padding: 20px; 
            position: relative; 
            overflow-x: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2), transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        .matte {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            border-radius: 16px;
        }
        .matte-strong {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(30px) saturate(200%);
            -webkit-backdrop-filter: blur(30px) saturate(200%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        }
        .matte-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(15px) saturate(150%);
            -webkit-backdrop-filter: blur(15px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
            transition: all 0.3s ease;
        }
        .matte-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px 0 rgba(31, 38, 135, 0.2);
            background: rgba(255, 255, 255, 0.12);
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .btn-primary {
            background: rgba(255, 255, 255, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        h1, h2, h3 { color: white; font-weight: 700; }
        p, span { color: rgba(255, 255, 255, 0.9); }
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            color: #fff;
        }
        pre {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            font-family: 'Fira Code', monospace;
        }
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
        }
        .text-center { text-align: center; }
        .p-6 { padding: 48px; }
        .p-4 { padding: 32px; }
        .mb-6 { margin-bottom: 48px; }
        .mb-4 { margin-bottom: 24px; }
    </style>
</head>
<body>
    <header class="matte-strong p-6 mb-6">
        <div class="container text-center">
            <h1 style="font-size: 4rem; margin-bottom: 16px;">🌺 Azalea</h1>
            <p style="font-size: 1.5rem; margin-bottom: 32px; opacity: 0.95;">Elegant, minimal, powerful programming language</p>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <a href="/playground" class="btn btn-primary">Get Started</a>
                <a href="/lessons" class="btn">Learn</a>
            </div>
        </div>
    </header>
    <main class="container">
        <section class="matte p-6 mb-6">
            <h2 class="text-center mb-6" style="font-size: 2.5rem;">Why Azalea?</h2>
            <div class="grid-3">
                <div class="matte-card p-4 text-center">
                    <h3 style="color: #fff; margin-bottom: 16px; font-size: 1.5rem;">🎯 Super Easy</h3>
                    <p style="line-height: 1.6;">Start coding in minutes! No complex syntax to memorize. Perfect for absolute beginners.</p>
                </div>
                <div class="matte-card p-4 text-center">
                    <h3 style="color: #fff; margin-bottom: 16px; font-size: 1.5rem;">🚀 Learn JavaScript Next</h3>
                    <p style="line-height: 1.6;">Azalea concepts map directly to JavaScript. Master Azalea, then easily transition to JS!</p>
                </div>
                <div class="matte-card p-4 text-center">
                    <h3 style="color: #fff; margin-bottom: 16px; font-size: 1.5rem;">✨ Super Flexible</h3>
                    <p style="line-height: 1.6;">Write code your way! 12+ ways to create variables, 8+ ways to write functions. Be creative!</p>
                </div>
            </div>
        </section>
        <section class="matte p-6">
            <h2 class="mb-4" style="font-size: 2rem;">Try It Now</h2>
            <pre><code>say Hello World
form num a from ten
say a</code></pre>
            <a href="/playground" class="btn btn-primary" style="margin-top: 16px;">Run in Playground</a>
        </section>
    </main>
    <footer class="matte p-4" style="text-align: center; margin-top: 48px;">
        <p>Made with Azalea - From beginner to professional</p>
    </footer>
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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh; 
            padding: 20px; 
            position: relative; 
            overflow-x: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2), transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        .matte {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            border-radius: 16px;
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        textarea {
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 16px;
            border-radius: 12px;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            resize: none;
            outline: none;
            width: 100%;
            height: 100%;
        }
        textarea:focus {
            border-color: rgba(255, 255, 255, 0.4);
            background: rgba(0, 0, 0, 0.4);
        }
        #output {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 16px;
            border-radius: 12px;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            white-space: pre-wrap;
            overflow-y: auto;
            height: 100%;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            min-height: calc(100vh - 100px);
        }
        .panel {
            display: flex;
            flex-direction: column;
            padding: 16px;
        }
        .panel-header {
            background: rgba(255, 255, 255, 0.1);
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1, h2, h3 { color: white; font-weight: 700; }
        .container { position: relative; z-index: 1; }
    </style>
</head>
<body>
    <header class="matte" style="padding: 20px; margin-bottom: 20px;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0;">🎮 Playground</h1>
            <div style="display: flex; gap: 12px;">
                <a href="/" class="btn">Landing</a>
                <a href="/lessons" class="btn">Lessons</a>
            </div>
        </div>
    </header>
    <div class="grid-2 matte" style="padding: 0;">
        <div class="panel">
            <div class="panel-header">
                <strong style="color: white;">Code Editor</strong>
                <button class="btn" onclick="runCode()" style="padding: 8px 16px; font-size: 14px;">▶ Run</button>
            </div>
            <textarea id="editor" spellcheck="false">say Hello World
form num a from ten
say a
loop five do
    say step
end</textarea>
            </div>
        <div class="panel">
            <div class="panel-header">
                <strong style="color: white;">Output</strong>
            </div>
            <div id="output">Ready to run code...</div>
        </div>
    </div>
    <div class="matte" style="padding: 2rem; margin-top: 20px;">
        <h3 style="margin-bottom: 1rem;">🤖 Need Help? Ask AI</h3>
        <textarea id="ai_question" placeholder="Ask a question about Azalea..." style="width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); font-size: 14px; min-height: 100px; margin-bottom: 1rem; background: rgba(0,0,0,0.2); color: white;"></textarea>
        <button class="btn" onclick="getAIHelp()" style="padding: 0.75rem 1.5rem;">Get AI Help</button>
    </div>
    <script src="/azalea-browser.js"></script>
    <script src="/azalea-hybrid.js"></script>
    <script>
        let hybridRuntime = null;
        let azaleaReady = false;
        
        async function initAzalea() {
            try {
                hybridRuntime = new AzaleaHybridRuntime();
                const status = await hybridRuntime.initialize();
                azaleaReady = status.hybrid;
            } catch (e) {
                console.error('Init error:', e);
            }
        }
        
        window.addEventListener('load', initAzalea);
        
        async function runCode() {
            if (!azaleaReady || !hybridRuntime) {
                await initAzalea();
            }
            const code = document.getElementById('editor').value;
            const output = document.getElementById('output');
            try {
                output.textContent = 'Running...';
                const results = await hybridRuntime.execute(code);
                if (results.hybrid && results.hybrid.success) {
                    output.textContent = results.hybrid.output.join('\\n') || 'No output';
                } else {
                    output.textContent = 'Error: ' + results.errors.map(e => e.error).join('\\n');
                }
            } catch (e) {
                output.textContent = 'Error: ' + e.message;
            }
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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh; 
            padding: 20px; 
            position: relative; 
            overflow-x: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2), transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        .matte {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            border-radius: 16px;
        }
        .matte-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .matte-card:hover {
            background: rgba(255, 255, 255, 0.12);
        }
        .matte-card.active {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        pre {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            font-family: 'Fira Code', monospace;
        }
        h1, h2, h3 { color: white; font-weight: 700; }
        p { color: rgba(255, 255, 255, 0.9); line-height: 1.6; }
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            color: #fff;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 0;
            min-height: calc(100vh - 100px);
        }
        .sidebar { padding: 20px; overflow-y: auto; }
        .content { padding: 32px; overflow-y: auto; }
        .container { position: relative; z-index: 1; }
        textarea {
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-size: 14px;
            width: 100%;
            min-height: 100px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <header class="matte" style="padding: 20px; margin-bottom: 20px;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; margin-bottom: 8px;">📚 Learn Azalea</h1>
                <div style="display: flex; gap: 24px; align-items: center;">
                    <span style="opacity: 0.9; color: white;">Level: <strong>1</strong></span>
                    <span style="opacity: 0.9; color: white;">XP: <strong>0</strong></span>
                </div>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="/" class="btn">Landing</a>
                <a href="/playground" class="btn">Playground</a>
            </div>
        </div>
    </header>
    <div class="grid-2 matte" style="padding: 0;">
        <div class="sidebar">
            <h3 style="margin-bottom: 16px; color: white;">Lessons</h3>
            <div class="matte-card active">0. Hello World</div>
            <div class="matte-card">1. Variables</div>
            <div class="matte-card">2. Math Operations</div>
            <div class="matte-card">3. Conditionals</div>
            <div class="matte-card">4. Loops</div>
            <div class="matte-card">5. Functions</div>
            <div class="matte-card">6. Lists</div>
            <div class="matte-card">7. UI Components</div>
            <div class="matte-card">8. Styling</div>
            <div class="matte-card">9. Forms</div>
            <div class="matte-card">10. Advanced Functions</div>
        </div>
        <div class="content">
            <div class="matte" style="padding: 16px; margin-bottom: 24px; background: rgba(76, 175, 80, 0.2); border-color: rgba(76, 175, 80, 0.3);">
                <p style="font-weight: bold; margin-bottom: 8px; color: white;">🎯 Why Azalea?</p>
                <p style="color: white; font-size: 0.9rem;">Azalea is SUPER easy! No complex syntax. Once you master Azalea, learning JavaScript will be a breeze. The concepts are the same, just different words!</p>
            </div>
            <h2 style="font-size: 2rem; margin-bottom: 16px; color: white;">Lesson 0: Hello World</h2>
            <div class="matte" style="padding: 16px; margin-bottom: 24px; background: rgba(33, 150, 243, 0.2); border-color: rgba(33, 150, 243, 0.3);">
                <p style="font-weight: bold; margin-bottom: 8px; color: white;">Goal:</p>
                <p style="color: white;">Print 'Hello World' - Your first program!</p>
            </div>
            <p style="margin-bottom: 16px;">In Azalea, printing is super simple. Just use <code>say</code> (or any of 8+ other words!).</p>
            <pre><code>say Hello World</code></pre>
            <div class="matte" style="padding: 16px; margin: 24px 0; background: rgba(255, 193, 7, 0.2); border-color: rgba(255, 193, 7, 0.3);">
                <p style="font-weight: bold; margin-bottom: 8px; color: white;">💡 Hint:</p>
                <p style="color: white;">Use the 'say' keyword to print text</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="/playground" class="btn">Try in Playground</a>
                <button class="btn" style="background: rgba(40, 167, 69, 0.3); border-color: rgba(40, 167, 69, 0.4);">Mark Complete</button>
            </div>
            <div class="matte" style="padding: 1.5rem; margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem;">🤖 Need Help? Ask AI</h3>
                <textarea id="lesson_question" placeholder="Ask about this lesson..."></textarea>
                <button class="btn" onclick="getAIHelp()" style="padding: 0.75rem 1.5rem;">Get AI Help</button>
            </div>
        </div>
    </div>
    <script>
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
