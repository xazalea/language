// Vercel serverless function for Azalea
// Executes site.az to generate all HTML

const fs = require('fs');
const pathModule = require('path');

// Import Azalea runtime
let AzaleaRuntime;
try {
  // Try to load from compiled TypeScript
  const azaleaPath = path.join(__dirname, '../dist/azalea.js');
  if (fs.existsSync(azaleaPath)) {
    AzaleaRuntime = require(azaleaPath).AzaleaRuntime;
  } else {
    // Fallback: use source TypeScript (requires ts-node or compilation)
    AzaleaRuntime = require('../src/azalea.ts').AzaleaRuntime;
  }
} catch (e) {
  // If runtime not available, we'll use a simple fallback
  console.error('Azalea runtime not available:', e.message);
}

module.exports = async (req, res) => {
  // CRITICAL: Set headers FIRST - before ANY other code
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'inline');
  
  try {
    // Get the path - Vercel passes original URL in req.url after rewrite
    let path = req.url || req.path || '/';
    
    // Extract query parameters before removing them
    let codeParam = '';
    let lessonId = '';
    
    // Handle query parameters from req.query (Vercel parsed) or URL
    if (req.query && typeof req.query === 'object') {
      codeParam = req.query.code || '';
      lessonId = req.query.lesson || '';
      if (req.query.path) {
        path = req.query.path;
      }
    }
    
    // Also check URL directly for query params
    if (path.includes('?')) {
      const urlParts = path.split('?');
      path = urlParts[0];
      const queryString = urlParts[1].split('#')[0];
      const params = new URLSearchParams(queryString);
      if (params.get('lesson') && !lessonId) {
        lessonId = params.get('lesson');
      }
      if (params.get('code') && !codeParam) {
        codeParam = params.get('code');
      }
    }
    
    // Remove hash from path
    path = path.split('#')[0];
    
    // Normalize path
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // FORCE all .az files to be handled as HTML
    if (path.endsWith('.az') || path.includes('.az')) {
      path = '/';
    }
    
    const method = (req.method || 'GET').toUpperCase();
    
    // Execute site.az - Pure Azalea, no JavaScript needed
    if (AzaleaRuntime) {
      try {
        const siteAzPath = pathModule.join(__dirname, '../site.az');
        if (fs.existsSync(siteAzPath)) {
          let siteCode = fs.readFileSync(siteAzPath, 'utf8');
          
          // Get code from POST body (form-encoded)
          let codeFromBody = '';
          let lessonFromBody = '';
          if ((path === '/playground' || path === '/lessons') && method === 'POST') {
            if (req.body) {
              if (typeof req.body === 'string') {
                // Parse form data: code=...&lesson=...
                const codeMatch = req.body.match(/code=([^&]*)/);
                if (codeMatch) {
                  codeFromBody = decodeURIComponent(codeMatch[1].replace(/\+/g, ' '));
                }
                const lessonMatch = req.body.match(/lesson=([^&]*)/);
                if (lessonMatch) {
                  lessonFromBody = decodeURIComponent(lessonMatch[1].replace(/\+/g, ' '));
                }
              } else {
                if (req.body.code) {
                  codeFromBody = req.body.code;
                }
                if (req.body.lesson) {
                  lessonFromBody = req.body.lesson;
                }
              }
            }
          }
          const finalCode = codeFromBody || codeParam || '';
          const finalLesson = lessonFromBody || lessonId || '';
          
          // Inject path, code, and lesson into Azalea
          const escapedPath = path.replace(/"/g, '\\"');
          const escapedCode = finalCode.replace(/"/g, '\\"').replace(/\n/g, '\\n');
          const escapedLesson = finalLesson.replace(/"/g, '\\"');
          siteCode = siteCode.replace(/say call serve.*$/, `say call serve "${escapedPath}" "${escapedCode}" "${escapedLesson}"`);
          
          const runtime = new AzaleaRuntime();
          
          // Capture output
          const outputs = [];
          const originalLog = console.log;
          console.log = (...args) => {
            outputs.push(args.map(a => String(a)).join(' '));
            originalLog.apply(console, args);
          };
          
          // Execute
          const ast = runtime.parse(siteCode);
          runtime.execute(ast);
          
          console.log = originalLog;
          
          // Get view output (HTML from view components)
          const viewHTML = runtime.getViewOutput();
          if (viewHTML && viewHTML.includes('<!DOCTYPE html>')) {
            return res.status(200).end(viewHTML);
          }
          
          // Fallback to say outputs
          if (outputs.length > 0) {
            for (let i = outputs.length - 1; i >= 0; i--) {
              if (outputs[i] && outputs[i].includes('<!DOCTYPE html>')) {
                return res.status(200).end(outputs[i]);
              }
            }
            return res.status(200).end(outputs[outputs.length - 1]);
          }
        }
      } catch (azaleaError) {
        console.error('Error executing site.az:', azaleaError);
      }
    }
    
    // Fallback: Use JavaScript implementation if Azalea execution fails
    if (path === '/' || path === '/index.html' || path === '' || path === '/index.az') {
      return res.status(200).end(getLandingPageHTML());
    } else if (path === '/playground' || path.startsWith('/playground')) {
      return res.status(200).end(getPlaygroundPageHTML(codeParam));
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
            background: #F0DAD5;
            min-height: 100vh; 
            padding: 20px; 
        }
        .card {
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(66, 70, 88, 0.1);
            transition: all 0.3s ease;
        }
        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(66, 70, 88, 0.15);
        }
        .btn {
            background: #6C739C;
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #5a6085;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 115, 156, 0.3);
        }
        .btn-primary {
            background: #C56B62;
        }
        .btn-primary:hover {
            background: #b55a52;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1, h2, h3 { color: #424658; font-weight: 700; }
        p, span { color: #424658; }
        code {
            background: #F0DAD5;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            color: #424658;
        }
        pre {
            background: #424658;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            color: #F0DAD5;
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
    <header class="card p-6 mb-6" style="background: linear-gradient(135deg, #6C739C 0%, #D9A69F 100%);">
        <div class="container text-center">
            <h1 style="font-size: 4rem; margin-bottom: 16px; color: white;">🌺 Azalea</h1>
            <p style="font-size: 1.5rem; margin-bottom: 32px; color: white; opacity: 0.95;">Elegant, minimal, powerful programming language</p>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <a href="/playground" class="btn btn-primary">Get Started</a>
                <a href="/lessons" class="btn" style="background: rgba(255,255,255,0.2); border: 2px solid white;">Learn</a>
            </div>
        </div>
    </header>
    <main class="container">
        <section class="card p-6 mb-6">
            <h2 class="text-center mb-6" style="font-size: 2.5rem;">Why Azalea?</h2>
            <div class="grid-3">
                <div class="card p-4 text-center" style="background: #F0DAD5;">
                    <h3 style="color: #424658; margin-bottom: 16px; font-size: 1.5rem;">🎯 Super Easy</h3>
                    <p style="line-height: 1.6; color: #424658;">Start coding in minutes! No complex syntax to memorize. Perfect for absolute beginners.</p>
                </div>
                <div class="card p-4 text-center" style="background: #F0DAD5;">
                    <h3 style="color: #424658; margin-bottom: 16px; font-size: 1.5rem;">🚀 Learn JavaScript Next</h3>
                    <p style="line-height: 1.6; color: #424658;">Azalea concepts map directly to JavaScript. Master Azalea, then easily transition to JS!</p>
                </div>
                <div class="card p-4 text-center" style="background: #F0DAD5;">
                    <h3 style="color: #424658; margin-bottom: 16px; font-size: 1.5rem;">✨ Super Flexible</h3>
                    <p style="line-height: 1.6; color: #424658;">Write code your way! 12+ ways to create variables, 8+ ways to write functions. Be creative!</p>
                </div>
            </div>
        </section>
        <section class="card p-6">
            <h2 class="mb-4" style="font-size: 2rem;">Try It Now</h2>
            <pre><code>say Hello World
form num a from ten
say a</code></pre>
            <a href="/playground" class="btn btn-primary" style="margin-top: 16px;">Run in Playground</a>
        </section>
    </main>
    <footer class="card p-4" style="text-align: center; margin-top: 48px; background: #BABBB1; color: #424658;">
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
            background: #F0DAD5;
            min-height: 100vh; 
            padding: 20px; 
        }
        .card {
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(66, 70, 88, 0.1);
        }
        .btn {
            background: #6C739C;
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #5a6085;
            transform: translateY(-2px);
        }
        .btn-primary {
            background: #C56B62;
        }
        .btn-primary:hover {
            background: #b55a52;
        }
        textarea {
            background: #FFFFFF;
            border: 2px solid #BABBB1;
            color: #424658;
            padding: 16px;
            border-radius: 8px;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            resize: none;
            outline: none;
            width: 100%;
            height: 100%;
        }
        textarea:focus {
            border-color: #6C739C;
            box-shadow: 0 0 0 3px rgba(108, 115, 156, 0.1);
        }
        #output {
            background: #424658;
            border: 2px solid #BABBB1;
            color: #F0DAD5;
            padding: 16px;
            border-radius: 8px;
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
            background: #F0DAD5;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1, h2, h3 { color: #424658; font-weight: 700; }
        .container { max-width: 1400px; margin: 0 auto; }
    </style>
</head>
<body>
    <header class="card" style="padding: 20px; margin-bottom: 20px; background: linear-gradient(135deg, #6C739C 0%, #D9A69F 100%);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; color: white;">🎮 Playground</h1>
            <div style="display: flex; gap: 12px;">
                <a href="/" class="btn" style="background: rgba(255,255,255,0.2); border: 2px solid white;">Landing</a>
                <a href="/lessons" class="btn" style="background: rgba(255,255,255,0.2); border: 2px solid white;">Lessons</a>
            </div>
        </div>
    </header>
    <div class="container">
        <div class="grid-2 card" style="padding: 0;">
            <div class="panel">
                <div class="panel-header">
                    <strong style="color: #424658;">Code Editor</strong>
                    <button class="btn btn-primary" onclick="runCode()" style="padding: 8px 16px; font-size: 14px;">▶ Run</button>
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
                    <strong style="color: #424658;">Output</strong>
        </div>
                <div id="output">Ready to run code...</div>
            </div>
        </div>
        <div class="card" style="padding: 2rem; margin-top: 20px;">
            <h3 style="margin-bottom: 1rem; color: #424658;">🤖 Need Help? Ask AI</h3>
            <textarea id="ai_question" placeholder="Ask a question about Azalea..." style="width: 100%; padding: 1rem; border-radius: 8px; border: 2px solid #BABBB1; font-size: 14px; min-height: 100px; margin-bottom: 1rem; background: #FFFFFF; color: #424658;"></textarea>
            <button class="btn btn-primary" onclick="getAIHelp()" style="padding: 0.75rem 1.5rem;">Get AI Help</button>
    </div>
    </div>
    <script>
        // Embedded Azalea Runtime
        class AzaleaRuntime {
            constructor() {
                this.variables = new Map();
                this.output = [];
            }
            
            getValue(str) {
                str = str.trim();
                if (str === 'step') {
                    return this.loopStep !== undefined ? this.loopStep : 0;
                }
                if (this.variables.has(str)) {
                    return this.variables.get(str);
                }
                const numberWords = {
                    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
                    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
                };
                if (numberWords[str.toLowerCase()]) {
                    return numberWords[str.toLowerCase()];
                }
                if (!isNaN(parseFloat(str))) {
                    return parseFloat(str);
                }
                return str;
            }
            
            execute(source) {
                this.output = [];
                const lines = source.split('\\n');
                let i = 0;
                
                while (i < lines.length) {
                    const line = lines[i];
                    const trimmed = line.trim();
                    
                    if (!trimmed || trimmed.startsWith('//')) {
                        i++;
                        continue;
                    }
                    
                    // Handle say/print/output
                    const sayMatch = trimmed.match(/^(say|print|output|display|log|echo|show|write)\\s+(.+)$/i);
                    if (sayMatch) {
                        const value = this.getValue(sayMatch[2]);
                        this.output.push(String(value));
                        i++;
                        continue;
                    }
                    
                    // Handle form/let/var (variable declaration)
                    const varMatch = trimmed.match(/^(form|let|var|const|set|create|make|declare|define|init|new)\\s+(num|text|bool)?\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s+(from|is|equals|=|to|as|becomes)\\s+(.+)$/i);
                    if (varMatch) {
                        const varName = varMatch[3];
                        const value = this.getValue(varMatch[5]);
                        this.variables.set(varName, value);
                        i++;
                        continue;
                    }
                    
                    // Handle loops
                    const loopMatch = trimmed.match(/^loop\\s+(\\d+|[a-zA-Z_][a-zA-Z0-9_]*)\\s+do$/i);
                    if (loopMatch) {
                        let count = this.getValue(loopMatch[1]);
                        count = parseInt(count);
                        
                        // Find matching 'end'
                        let depth = 1;
                        let loopEnd = i + 1;
                        for (let j = i + 1; j < lines.length; j++) {
                            const l = lines[j].trim();
                            if (l === 'end' || l === '}' || l === 'finish' || l === 'done') {
                                depth--;
                                if (depth === 0) {
                                    loopEnd = j;
                                    break;
                                }
                            } else if (l.match(/^(loop|if)\\s+.*\\s+do$/i)) {
                                depth++;
                            }
                        }
                        
                        // Execute loop body
                        for (let step = 0; step < count; step++) {
                            this.loopStep = step;
                            for (let j = i + 1; j < loopEnd; j++) {
                                const loopLine = lines[j].trim();
                                if (!loopLine || loopLine.startsWith('//')) continue;
                                
                                const loopSayMatch = loopLine.match(/^(say|print|output|display|log|echo|show|write)\\s+(.+)$/i);
                                if (loopSayMatch) {
                                    const value = this.getValue(loopSayMatch[2]);
                                    this.output.push(String(value));
                                }
                                
                                const loopVarMatch = loopLine.match(/^(form|let|var|const|set|create|make|declare|define|init|new)\\s+(num|text|bool)?\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s+(from|is|equals|=|to|as|becomes)\\s+(.+)$/i);
                                if (loopVarMatch) {
                                    const varName = loopVarMatch[3];
                                    const value = this.getValue(loopVarMatch[5]);
                                    this.variables.set(varName, value);
                                }
                            }
                        }
                        
                        i = loopEnd + 1;
                        continue;
                    }
                    
                    i++;
                }
            }
        }
        
        let runtime = null;
        let azaleaReady = false;
        
        function initAzalea() {
            try {
                runtime = new AzaleaRuntime();
                azaleaReady = true;
                return true;
            } catch (e) {
                console.error('Init error:', e);
                azaleaReady = false;
                return false;
            }
        }
        
        window.addEventListener('load', () => {
            initAzalea();
            // Load code from URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const codeParam = urlParams.get('code');
            if (codeParam) {
                document.getElementById('editor').value = decodeURIComponent(codeParam);
            }
        });
        
        async function runCode() {
            const code = document.getElementById('editor').value;
            const output = document.getElementById('output');
            
            if (!azaleaReady || !runtime) {
                output.textContent = 'Initializing runtime...';
                if (!initAzalea()) {
                    output.textContent = 'Error: Failed to initialize runtime.';
                    return;
                }
            }
            
            try {
                output.textContent = 'Running...';
                
                // Create fresh runtime instance
                runtime = new AzaleaRuntime();
                runtime.execute(code);
                
                if (runtime.output.length > 0) {
                    output.textContent = runtime.output.join('\\n');
                } else {
                    output.textContent = 'Code executed successfully (no output)\\n\\nTip: Use "say" to print: say Hello World';
                }
            } catch (e) {
                output.textContent = 'Error: ' + e.message + '\\n\\nMake sure your code is valid Azalea syntax.';
                console.error(e);
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
            background: #F0DAD5;
            min-height: 100vh; 
            padding: 20px; 
        }
        .card {
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(66, 70, 88, 0.1);
        }
        .lesson-card {
            background: #F0DAD5;
            border: 2px solid #BABBB1;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .lesson-card:hover {
            background: #DEA785;
            border-color: #6C739C;
        }
        .lesson-card.active {
            background: #6C739C;
            border-color: #C56B62;
            color: white;
        }
        .btn {
            background: #6C739C;
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #5a6085;
            transform: translateY(-2px);
        }
        .btn-primary {
            background: #C56B62;
        }
        .btn-primary:hover {
            background: #b55a52;
        }
        .btn-success {
            background: #6C739C;
        }
        pre {
            background: #424658;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            color: #F0DAD5;
            font-family: 'Fira Code', monospace;
            margin: 16px 0;
        }
        h1, h2, h3 { color: #424658; font-weight: 700; }
        p { color: #424658; line-height: 1.6; }
        code {
            background: #F0DAD5;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            color: #424658;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 0;
            min-height: calc(100vh - 100px);
        }
        .sidebar { padding: 20px; overflow-y: auto; background: #FFFFFF; border-radius: 12px 0 0 12px; }
        .content { padding: 32px; overflow-y: auto; background: #FFFFFF; border-radius: 0 12px 12px 0; }
        .container { max-width: 1400px; margin: 0 auto; }
        .info-box {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            border-left: 4px solid;
        }
        .info-box.goal { background: #F0DAD5; border-color: #6C739C; }
        .info-box.hint { background: #F0DAD5; border-color: #DEA785; }
        .info-box.tip { background: #F0DAD5; border-color: #C56B62; }
        .info-box.exercise { background: #F0DAD5; border-color: #6C739C; }
        .code-editor {
            background: #424658;
            border: 2px solid #BABBB1;
            color: #F0DAD5;
            padding: 16px;
            border-radius: 8px;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            width: 100%;
            min-height: 120px;
            margin: 16px 0;
            resize: vertical;
        }
        .exercise-output {
            background: #F0DAD5;
            border: 2px solid #6C739C;
            color: #424658;
            padding: 16px;
            border-radius: 8px;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            min-height: 60px;
            white-space: pre-wrap;
            margin-top: 8px;
        }
        .exercise-success {
            background: #6C739C;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-top: 12px;
            display: none;
        }
        textarea {
            background: #FFFFFF;
            border: 2px solid #BABBB1;
            color: #424658;
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
    <header class="card" style="padding: 20px; margin-bottom: 20px; background: linear-gradient(135deg, #6C739C 0%, #D9A69F 100%);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; margin-bottom: 8px; color: white;">📚 Learn Azalea</h1>
                <div style="display: flex; gap: 24px; align-items: center;">
                    <span style="color: white; opacity: 0.9;">Level: <strong id="level">1</strong></span>
                    <span style="color: white; opacity: 0.9;">XP: <strong id="xp">0</strong></span>
                </div>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="/" class="btn" style="background: rgba(255,255,255,0.2); border: 2px solid white;">Landing</a>
                <a href="/playground" class="btn" style="background: rgba(255,255,255,0.2); border: 2px solid white;">Playground</a>
            </div>
        </div>
    </header>
    <div class="container">
        <div class="grid-2 card" style="padding: 0;">
            <div class="sidebar">
                <h3 style="margin-bottom: 16px; color: #424658;">Lessons</h3>
                <div class="lesson-card active" onclick="loadLesson(0)">0. Hello World</div>
                <div class="lesson-card" onclick="loadLesson(1)">1. Variables</div>
                <div class="lesson-card" onclick="loadLesson(2)">2. Math Operations</div>
                <div class="lesson-card" onclick="loadLesson(3)">3. Conditionals</div>
                <div class="lesson-card" onclick="loadLesson(4)">4. Loops</div>
                <div class="lesson-card" onclick="loadLesson(5)">5. Functions</div>
                <div class="lesson-card" onclick="loadLesson(6)">6. Lists</div>
                <div class="lesson-card" onclick="loadLesson(7)">7. UI Components</div>
                <div class="lesson-card" onclick="loadLesson(8)">8. Styling</div>
                <div class="lesson-card" onclick="loadLesson(9)">9. Forms</div>
                <div class="lesson-card" onclick="loadLesson(10)">10. Advanced</div>
        </div>
            <div class="content" id="lesson-content">
                <div class="info-box goal">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">🎯 Why Azalea?</p>
                    <p style="color: #424658; font-size: 0.9rem;">Azalea is SUPER easy! No complex syntax. Once you master Azalea, learning JavaScript will be a breeze. The concepts are the same, just different words!</p>
            </div>
                <h2 style="font-size: 2rem; margin-bottom: 16px;">Lesson 0: Hello World</h2>
                <div class="info-box goal">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">Goal:</p>
                    <p style="color: #424658;">Print 'Hello World' - Your first program!</p>
            </div>
                <p style="margin-bottom: 16px;">In Azalea, printing is super simple. Just use <code>say</code> (or any of 8+ other words like <code>print</code>, <code>output</code>, <code>display</code>, <code>log</code>!).</p>
                <pre><code>say Hello World</code></pre>
                <div class="info-box hint">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">💡 Hint:</p>
                    <p style="color: #424658;">Use the 'say' keyword to print text. You can also use: print, output, display, log, echo, show, write - they all work the same!</p>
            </div>
                <div class="info-box tip">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">✨ Try This:</p>
                    <p style="color: #424658;">Try using different keywords: <code>print Hello World</code> or <code>display Hello World</code> - they all work!</p>
                    </div>
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <a href="/playground" class="btn btn-primary">Try in Playground</a>
                    <button class="btn btn-success" onclick="completeLesson(0)">Mark Complete</button>
                    </div>
                <div class="card" style="padding: 1.5rem; margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #424658;">🤖 Need Help? Ask AI</h3>
                    <textarea id="lesson_question" placeholder="Ask about this lesson..."></textarea>
                    <button class="btn btn-primary" onclick="getAIHelp()" style="padding: 0.75rem 1.5rem;">Get AI Help</button>
                </div>
            </div>
            </div>
            </div>
    <script>
        const lessons = [
            {
                title: "Hello World",
                goal: "Print 'Hello World' - Your first program!",
                code: "say Hello World",
                hint: "Use the 'say' keyword to print text. You can also use: print, output, display, log, echo, show, write - they all work the same!",
                tip: "Try using different keywords: print Hello World or display Hello World - they all work!",
                explanation: "In Azalea, printing is super simple. Just use 'say' (or any of 8+ other words!).",
                exercise: "Try printing your name! Use 'say' followed by your name.",
                exerciseHint: "Example: say Alice",
                testCode: (output) => output.length > 0 && output.some(o => o.toLowerCase().includes('hello') || o.toLowerCase().includes('world'))
            },
            {
                title: "Variables",
                goal: "Create a variable and print it",
                code: "form num age from 10\nsay age",
                hint: "Use 'form' to create variables, 'num' for numbers. You can also use: let, var, const, set, create, make, declare, define, init, new!",
                tip: "Variables can hold numbers, text, or other values. Try: form text name from Alice",
                explanation: "Variables store values. Use 'form' (or 11+ other keywords!) to create them. 'num' means number, 'text' means string.",
                exercise: "Create a variable called 'name' with your name, then print it!",
                exerciseHint: "Use: form text name from YourName then say name",
                testCode: (output, vars) => vars.has('name') || vars.has('age') || output.length > 0
            },
            {
                title: "Math Operations",
                goal: "Add two numbers and print the result",
                code: "form num a from 10\nform num b from 5\nsay a plus b",
                hint: "Use 'plus' for addition. Also try: minus, times, div (division). You can use +, -, *, / too!",
                tip: "Math is easy! Try: say 10 plus 5, or say 10 times 3",
                explanation: "Azalea supports all math operations. Use words (plus, minus, times, div) or symbols (+, -, *, /).",
                exercise: "Calculate 20 minus 7 and print the result!",
                exerciseHint: "Use: say 20 minus 7",
                testCode: (output) => output.some(o => o.includes('13'))
            },
            {
                title: "Conditionals",
                goal: "Check if age is over 10",
                code: "form num age from 15\nif age over 10 do\n    say You are old enough\nend",
                hint: "Use 'if' for conditionals. Comparison words: over (>), under (<), same (==). You can also use: when, whenever, provided, assuming, given!",
                tip: "Try different comparisons: if age same 15, if age under 20",
                explanation: "Conditionals let you make decisions. Use 'if' with comparisons like 'over', 'under', 'same'.",
                exercise: "Create a variable 'score' with value 85. If score is over 80, print 'Great job!'",
                exerciseHint: "form num score from 85\\nif score over 80 do\\n    say Great job!\\nend",
                testCode: (output) => output.some(o => o.toLowerCase().includes('great') || o.toLowerCase().includes('job'))
            },
            {
                title: "Loops",
                goal: "Count from 0 to 4",
                code: "loop 5 do\n    say step\nend",
                hint: "Use 'loop' with a number to repeat. 'step' is the current count (0, 1, 2, 3, 4). You can also use: while, for, repeat, each, foreach, iterate!",
                tip: "Try: loop 10 do say step - counts from 0 to 9!",
                explanation: "Loops repeat code. 'loop 5' runs 5 times. 'step' is the current iteration number (starts at 0).",
                exercise: "Use a loop to count from 0 to 9!",
                exerciseHint: "loop 10 do\\n    say step\\nend",
                testCode: (output) => output.length >= 10 && output.includes('0') && output.includes('9')
            },
            {
                title: "Functions",
                goal: "Create a function that greets someone",
                code: "act greet name do\n    say Hello\n    say name\nend\n\ncall greet Alice",
                hint: "Use 'act' to define functions, 'call' to use them. You can also use: def, fn, func, function, method, procedure!",
                tip: "Functions can take multiple parameters: act add a b do give a plus b end",
                explanation: "Functions are reusable code blocks. Define with 'act', call with 'call'. Use 'give' to return values.",
                exercise: "Create a function called 'add' that takes two numbers and prints their sum. Then call it with 5 and 3.",
                exerciseHint: "Note: Functions are advanced. For now, try: say 5 plus 3",
                testCode: (output) => output.some(o => o.includes('8'))
            },
            {
                title: "Lists",
                goal: "Create a list and print all items",
                code: "form list names from [Alice, Bob, Charlie]\nloop names do\n    say step\nend",
                hint: "Use 'list' type for arrays. Loop over lists to access each item. 'step' is the current item in the loop.",
                tip: "Lists can hold any type: form list numbers from [1, 2, 3, 4, 5]",
                explanation: "Lists store multiple values. Use square brackets []. Loop over them to access each item.",
                exercise: "Create a list of numbers [1, 2, 3, 4, 5] and print each one using a loop.",
                exerciseHint: "form list numbers from [1, 2, 3, 4, 5]\\nloop numbers do\\n    say step\\nend",
                testCode: (output) => output.length >= 3
            },
            {
                title: "UI Components",
                goal: "Create a button that prints when clicked",
                code: "call view button Click Me do\n    say Button clicked!\nend",
                hint: "Use 'view' module to create UI. 'button' creates a button. The 'do' block runs when clicked.",
                tip: "Try other UI elements: call view input name, call view text Hello",
                explanation: "Azalea can create UI! Use 'view' module with element names like 'button', 'input', 'text'.",
                exercise: "Note: UI components work in full Azalea apps. For now, practice with say statements!",
                exerciseHint: "Try: say I can create buttons!",
                testCode: (output) => output.length > 0
            },
            {
                title: "Styling",
                goal: "Create a styled div",
                code: "call view div style background blue style color white do\n    call view text Hello\nend",
                hint: "Use 'style' keyword to add CSS. You can add multiple styles: style background blue style color white",
                tip: "Try different styles: style padding 20, style border-radius 8",
                explanation: "Style UI elements with the 'style' keyword. Add any CSS property you want!",
                exercise: "Note: Styling works with UI components. Practice with say for now!",
                exerciseHint: "say Styling makes things beautiful!",
                testCode: (output) => output.length > 0
            },
            {
                title: "Forms",
                goal: "Create an input and submit button",
                code: "call view input name placeholder Enter name\ncall view button Submit do\n    say Form submitted!\nend",
                hint: "Use 'input' for text fields. Add 'placeholder' for hint text. Buttons can have actions in 'do' blocks.",
                tip: "Try different input types: call view input email type email",
                explanation: "Forms collect user input. Use 'input' for fields, 'button' for actions.",
                exercise: "Practice with say: say Forms collect user input!",
                exerciseHint: "say Forms collect user input!",
                testCode: (output) => output.length > 0
            },
            {
                title: "Advanced Functions",
                goal: "Create a calculator function",
                code: "act calculate a b op do\n    if op same plus do\n        give a plus b\n    end\nend\n\ncall calculate 10 5 plus put result\nsay result",
                hint: "Functions can take multiple parameters. Use 'give' to return values. Use 'put' to store the result.",
                tip: "Try making it handle multiple operations: if op same minus do give a minus b end",
                explanation: "Advanced functions can make decisions and return values. Use 'give' to return, 'put' to store results.",
                exercise: "Calculate 6 times 7 and print the result!",
                exerciseHint: "Use: say 6 times 7",
                testCode: (output) => output.some(o => o.includes('42'))
            }
        ];
        
        let currentLesson = 0;
        let xp = 0;
        let level = 1;
        
        // Embedded Azalea Runtime (same as playground)
        class AzaleaRuntime {
            constructor() {
                this.variables = new Map();
                this.output = [];
            }
            
            getValue(str) {
                str = str.trim();
                if (str === 'step') {
                    return this.loopStep !== undefined ? this.loopStep : 0;
                }
                if (this.variables.has(str)) {
                    return this.variables.get(str);
                }
                const numberWords = {
                    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
                    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
                };
                if (numberWords[str.toLowerCase()]) {
                    return numberWords[str.toLowerCase()];
                }
                if (!isNaN(parseFloat(str))) {
                    return parseFloat(str);
                }
                return str;
            }
            
            execute(source) {
                this.output = [];
                const lines = source.split('\\n');
                let i = 0;
                
                while (i < lines.length) {
                    const line = lines[i];
                    const trimmed = line.trim();
                    
                    if (!trimmed || trimmed.startsWith('//')) {
                        i++;
                        continue;
                    }
                    
                    // Handle say/print/output with math
                    const sayMatch = trimmed.match(/^(say|print|output|display|log|echo|show|write)\\s+(.+)$/i);
                    if (sayMatch) {
                        let value = sayMatch[2].trim();
                        const mathMatch = value.match(/^(.+?)\\s+(plus|minus|times|div|\\+|\\-|\\*|\\/)\\s+(.+)$/i);
                        if (mathMatch) {
                            const left = this.getValue(mathMatch[1]);
                            const op = mathMatch[2].toLowerCase();
                            const right = this.getValue(mathMatch[3]);
                            if (op === 'plus' || op === '+') value = left + right;
                            else if (op === 'minus' || op === '-') value = left - right;
                            else if (op === 'times' || op === '*') value = left * right;
                            else if (op === 'div' || op === '/') value = left / right;
                            this.output.push(String(value));
                        } else {
                            value = this.getValue(value);
                            this.output.push(String(value));
                        }
                        i++;
                        continue;
                    }
                    
                    // Handle form/let/var (variable declaration) with math
                    const varMatch = trimmed.match(/^(form|let|var|const|set|create|make|declare|define|init|new)\\s+(num|text|bool)?\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s+(from|is|equals|=|to|as|becomes)\\s+(.+)$/i);
                    if (varMatch) {
                        const varName = varMatch[3];
                        let value = varMatch[5].trim();
                        const varMathMatch = value.match(/^(.+?)\\s+(plus|minus|times|div|\\+|\\-|\\*|\\/)\\s+(.+)$/i);
                        if (varMathMatch) {
                            const left = this.getValue(varMathMatch[1]);
                            const op = varMathMatch[2].toLowerCase();
                            const right = this.getValue(varMathMatch[3]);
                            if (op === 'plus' || op === '+') value = left + right;
                            else if (op === 'minus' || op === '-') value = left - right;
                            else if (op === 'times' || op === '*') value = left * right;
                            else if (op === 'div' || op === '/') value = left / right;
                        } else {
                            value = this.getValue(value);
                        }
                        this.variables.set(varName, value);
                        i++;
                        continue;
                    }
                    
                    // Handle conditionals
                    const ifMatch = trimmed.match(/^if\\s+(.+?)\\s+(over|under|same|>|<|==)\\s+(.+?)\\s+do$/i);
                    if (ifMatch) {
                        const left = this.getValue(ifMatch[1]);
                        const op = ifMatch[2].toLowerCase();
                        const right = this.getValue(ifMatch[3]);
                        let condition = false;
                        if (op === 'over' || op === '>') condition = left > right;
                        else if (op === 'under' || op === '<') condition = left < right;
                        else if (op === 'same' || op === '==') condition = left == right;
                        
                        let depth = 1;
                        let ifEnd = i + 1;
                        for (let j = i + 1; j < lines.length; j++) {
                            const l = lines[j].trim();
                            if (l === 'end' || l === '}' || l === 'finish' || l === 'done') {
                                depth--;
                                if (depth === 0) {
                                    ifEnd = j;
                                    break;
                                }
                            } else if (l.match(/^(loop|if)\\s+.*\\s+do$/i)) {
                                depth++;
                            }
                        }
                        
                        if (condition) {
                            for (let j = i + 1; j < ifEnd; j++) {
                                const ifLine = lines[j].trim();
                                if (!ifLine || ifLine.startsWith('//')) continue;
                                
                                const ifSayMatch = ifLine.match(/^(say|print|output|display|log|echo|show|write)\\s+(.+)$/i);
                                if (ifSayMatch) {
                                    let value = ifSayMatch[2].trim();
                                    const ifMathMatch = value.match(/^(.+?)\\s+(plus|minus|times|div|\\+|\\-|\\*|\\/)\\s+(.+)$/i);
                                    if (ifMathMatch) {
                                        const left = this.getValue(ifMathMatch[1]);
                                        const op = ifMathMatch[2].toLowerCase();
                                        const right = this.getValue(ifMathMatch[3]);
                                        if (op === 'plus' || op === '+') value = left + right;
                                        else if (op === 'minus' || op === '-') value = left - right;
                                        else if (op === 'times' || op === '*') value = left * right;
                                        else if (op === 'div' || op === '/') value = left / right;
                                    } else {
                                        value = this.getValue(value);
                                    }
                                    this.output.push(String(value));
                                }
                            }
                        }
                        i = ifEnd + 1;
                        continue;
                    }
                    
                    // Handle loops
                    const loopMatch = trimmed.match(/^loop\\s+(\\d+|[a-zA-Z_][a-zA-Z0-9_]*)\\s+do$/i);
                    if (loopMatch) {
                        let count = this.getValue(loopMatch[1]);
                        count = parseInt(count);
                        
                        let depth = 1;
                        let loopEnd = i + 1;
                        for (let j = i + 1; j < lines.length; j++) {
                            const l = lines[j].trim();
                            if (l === 'end' || l === '}' || l === 'finish' || l === 'done') {
                                depth--;
                                if (depth === 0) {
                                    loopEnd = j;
                                    break;
                                }
                            } else if (l.match(/^(loop|if)\\s+.*\\s+do$/i)) {
                                depth++;
                            }
                        }
                        
                        for (let step = 0; step < count; step++) {
                            this.loopStep = step;
                            for (let j = i + 1; j < loopEnd; j++) {
                                const loopLine = lines[j].trim();
                                if (!loopLine || loopLine.startsWith('//')) continue;
                                
                                const loopSayMatch = loopLine.match(/^(say|print|output|display|log|echo|show|write)\\s+(.+)$/i);
                                if (loopSayMatch) {
                                    let value = loopSayMatch[2].trim();
                                    if (value === 'step') {
                                        value = step;
                                    } else {
                                        const loopMathMatch = value.match(/^(.+?)\\s+(plus|minus|times|div|\\+|\\-|\\*|\\/)\\s+(.+)$/i);
                                        if (loopMathMatch) {
                                            const left = this.getValue(loopMathMatch[1]);
                                            const op = loopMathMatch[2].toLowerCase();
                                            const right = this.getValue(loopMathMatch[3]);
                                            if (op === 'plus' || op === '+') value = left + right;
                                            else if (op === 'minus' || op === '-') value = left - right;
                                            else if (op === 'times' || op === '*') value = left * right;
                                            else if (op === 'div' || op === '/') value = left / right;
                                        } else {
                                            value = this.getValue(value);
                                        }
                                    }
                                    this.output.push(String(value));
                                }
                                
                                const loopVarMatch = loopLine.match(/^(form|let|var|const|set|create|make|declare|define|init|new)\\s+(num|text|bool)?\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s+(from|is|equals|=|to|as|becomes)\\s+(.+)$/i);
                                if (loopVarMatch) {
                                    const varName = loopVarMatch[3];
                                    let value = loopVarMatch[5].trim();
                                    if (value === 'step') {
                                        value = step;
                                    } else {
                                        value = this.getValue(value);
                                    }
                                    this.variables.set(varName, value);
                                }
                            }
                        }
                        
                        i = loopEnd + 1;
                        continue;
                    }
                    
                    i++;
                }
            }
        }
        
        function runLessonCode(code, outputEl) {
            try {
                const runtime = new AzaleaRuntime();
                runtime.execute(code);
                if (runtime.output.length > 0) {
                    outputEl.textContent = runtime.output.join('\\n');
                } else {
                    outputEl.textContent = 'Code executed (no output)';
                }
                return runtime;
            } catch (e) {
                outputEl.textContent = 'Error: ' + e.message;
                return null;
            }
        }
        
        function loadLesson(index) {
            currentLesson = index;
            const lesson = lessons[index];
            
            // Update sidebar
            document.querySelectorAll('.lesson-card').forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            
            // Update content
            document.getElementById('lesson-content').innerHTML = \`
                <div class="info-box goal">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">🎯 Why Azalea?</p>
                    <p style="color: #424658; font-size: 0.9rem;">Azalea is SUPER easy! No complex syntax. Once you master Azalea, learning JavaScript will be a breeze. The concepts are the same, just different words!</p>
                </div>
                <h2 style="font-size: 2rem; margin-bottom: 16px;">Lesson \${index}: \${lesson.title}</h2>
                <div class="info-box goal">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">Goal:</p>
                    <p style="color: #424658;">\${lesson.goal}</p>
                </div>
                <p style="margin-bottom: 16px;">\${lesson.explanation}</p>
                
                <h3 style="margin-top: 24px; margin-bottom: 12px; color: #424658;">📝 Example Code</h3>
                <pre><code>\${lesson.code}</code></pre>
                <div style="margin: 16px 0;">
                    <textarea id="example-editor-\${index}" class="code-editor" spellcheck="false">\${lesson.code}</textarea>
                    <button class="btn btn-primary" onclick="runExampleCode(\${index})" style="margin-top: 8px;">▶ Run Example</button>
                    <div id="example-output-\${index}" class="exercise-output" style="display: none;"></div>
                </div>
                
                <div class="info-box hint">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">💡 Hint:</p>
                    <p style="color: #424658;">\${lesson.hint}</p>
                </div>
                <div class="info-box tip">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">✨ Try This:</p>
                    <p style="color: #424658;">\${lesson.tip}</p>
                </div>
                
                <div class="info-box exercise" style="margin-top: 32px;">
                    <p style="font-weight: bold; margin-bottom: 8px; color: #424658;">🎯 Your Turn - Practice Exercise:</p>
                    <p style="color: #424658; margin-bottom: 12px;">\${lesson.exercise}</p>
                    <p style="color: #424658; font-size: 0.9rem; opacity: 0.8; margin-bottom: 12px;">💡 Hint: \${lesson.exerciseHint}</p>
                    <textarea id="exercise-editor-\${index}" class="code-editor" spellcheck="false" placeholder="Write your code here..."></textarea>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button class="btn btn-primary" onclick="runExercise(\${index})">▶ Run My Code</button>
                        <button class="btn btn-success" onclick="checkExercise(\${index})">✓ Check Answer</button>
                    </div>
                    <div id="exercise-output-\${index}" class="exercise-output" style="display: none;"></div>
                    <div id="exercise-success-\${index}" class="exercise-success">
                        🎉 Excellent! You got it right! +10 bonus XP
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <a href="/playground?code=\${encodeURIComponent(lesson.code)}" class="btn btn-primary">Open in Playground</a>
                    <button class="btn btn-success" onclick="completeLesson(\${index})">Mark Complete</button>
                </div>
                <div class="card" style="padding: 1.5rem; margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #424658;">🤖 Need Help? Ask AI</h3>
                    <textarea id="lesson_question" placeholder="Ask about this lesson..."></textarea>
                    <button class="btn btn-primary" onclick="getAIHelp()" style="padding: 0.75rem 1.5rem;">Get AI Help</button>
                </div>
            \`;
        }
        
        function runExampleCode(index) {
            const editor = document.getElementById(\`example-editor-\${index}\`);
            const output = document.getElementById(\`example-output-\${index}\`);
            output.style.display = 'block';
            runLessonCode(editor.value, output);
        }
        
        function runExercise(index) {
            const editor = document.getElementById(\`exercise-editor-\${index}\`);
            const output = document.getElementById(\`exercise-output-\${index}\`);
            output.style.display = 'block';
            runLessonCode(editor.value, output);
        }
        
        function checkExercise(index) {
            const editor = document.getElementById(\`exercise-editor-\${index}\`);
            const output = document.getElementById(\`exercise-output-\${index}\`);
            const success = document.getElementById(\`exercise-success-\${index}\`);
            const lesson = lessons[index];
            
            output.style.display = 'block';
            const runtime = runLessonCode(editor.value, output);
            
            if (runtime && lesson.testCode) {
                const passed = lesson.testCode(runtime.output, runtime.variables);
                if (passed) {
                    success.style.display = 'block';
                    xp += 10;
                    document.getElementById('xp').textContent = xp;
                    if (xp >= level * 100) {
                        level++;
                        document.getElementById('level').textContent = level;
                    }
                } else {
                    success.style.display = 'none';
                    output.textContent = output.textContent + '\\n\\n❌ Not quite right. Try again! Check the hint above.';
                }
            } else {
                success.style.display = 'none';
            }
        }
        
        function completeLesson(index) {
            xp += 50;
            if (xp >= level * 100) {
                level++;
            }
            document.getElementById('xp').textContent = xp;
            document.getElementById('level').textContent = level;
            alert(\`Lesson \${index} completed! +50 XP. Total XP: \${xp}\`);
        }
        
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
