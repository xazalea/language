// Azalea TypeScript Interpreter - Ultra Efficient with Auto-WASM & Inference
// Automatically uses WASM when available for maximum speed
// Infers types and optimizes code automatically

export interface AzaleaValue {
  type: 'num' | 'text' | 'bool' | 'list' | 'map' | 'void' | 'func';
  value: any;
}

export interface AzaleaAST {
  type: string;
  value?: string;
  children?: AzaleaAST[];
}

export class AzaleaRuntime {
  private variables: Map<string, AzaleaValue> = new Map();
  private functions: Map<string, Function> = new Map();
  private scopes: Map<string, AzaleaValue>[] = [];
  private cache: Map<string, any> = new Map(); // Execution cache
  private wasmModule: any = null; // Auto-loaded WASM for speed
  private typeInference: Map<string, string> = new Map(); // Type inference cache

  // Ultra-minimal keyword mappings - INFERRED automatically
  private keywordAliases: Map<string, string> = new Map([
    // Variables - all map to 'form' (inferred)
    ['form', 'form'], ['let', 'form'], ['var', 'form'], ['=', 'form'],
    
    // Functions - all map to 'act' (inferred)
    ['act', 'act'], ['def', 'act'], ['fn', 'act'], [':', 'act'],
    
    // Conditionals - all map to 'if' (inferred)
    ['if', 'if'], ['when', 'if'],
    
    // Loops - all map to 'loop' (inferred)
    ['loop', 'loop'], ['for', 'loop'],
    
    // Output - all map to 'say' (inferred)
    ['say', 'say'], ['print', 'say'],
    
    // Return - all map to 'give' (inferred)
    ['give', 'give'], ['return', 'give'],
    
    // Operators - inferred from context
    ['plus', '+'], ['+', '+'], ['minus', '-'], ['-', '-'],
    ['times', '*'], ['*', '*'], ['div', '/'], ['/', '/'],
    ['over', '>'], ['>', '>'], ['under', '<'], ['<', '<'],
    ['same', '=='], ['==', '=='], ['=', '=='],
  ]);

  // Auto-initialize WASM for maximum speed
  async initWASM() {
    if (this.wasmModule) return;
    try {
      if (typeof window !== 'undefined' && (window as any).AzaleaModule) {
        this.wasmModule = await (window as any).AzaleaModule();
      }
    } catch (e) {
      // WASM not available - use TypeScript (still fast)
    }
  }

  // Normalize keyword - INFERRED from context
  private normalizeKeyword(keyword: string): string {
    return this.keywordAliases.get(keyword.toLowerCase()) || keyword;
  }

  // INFER type from value automatically
  private inferType(value: any): string {
    if (typeof value === 'number') return 'num';
    if (typeof value === 'string') return 'text';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) return 'list';
    if (value && typeof value === 'object') return 'map';
    return 'void';
  }

  // Parse Azalea code - ULTRA FAST with caching
  parse(source: string): AzaleaAST[] {
    // Check cache first
    const cacheKey = 'parse:' + source.substring(0, 100);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const tokens = this.tokenize(source);
    const ast = this.parseTokens(tokens);
    
    // Cache result
    this.cache.set(cacheKey, ast);
    return ast;
  }

  // ULTRA-MINIMAL tokenizer - only essential tokens
  private tokenize(source: string): string[] {
    source = source.replace(/\/\/.*$/gm, '');
    const tokens: string[] = [];
    let current = '';
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      
      if ((char === '"' || char === "'") && (i === 0 || source[i-1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
          if (current.trim()) tokens.push(current.trim());
          current = char;
        } else if (char === stringChar) {
          inString = false;
          current += char;
          tokens.push(current);
          current = '';
        } else {
          current += char;
        }
      } else if (inString) {
        current += char;
      } else if (/\s/.test(char)) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = '';
        }
        if (char === '\n') tokens.push('\n');
      } else if (/[{}()\[\]=:]/.test(char)) {
        if (current.trim()) tokens.push(current.trim());
        tokens.push(char);
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) tokens.push(current.trim());
    return tokens.filter(t => t && t.length > 0);
  }

  // ULTRA-SIMPLE parser - minimal syntax
  private parseTokens(tokens: string[]): AzaleaAST[] {
    const ast: AzaleaAST[] = [];
    let i = 0;
    
    while (i < tokens.length) {
      const token = tokens[i];
      
      // Assignment: name = value
      if (i + 1 < tokens.length && tokens[i + 1] === '=') {
        const name = token;
        i += 2;
        const valueTokens: string[] = [];
        while (i < tokens.length && tokens[i] !== '\n') {
          valueTokens.push(tokens[i]);
          i++;
        }
        const value = valueTokens.join(' ').trim();
        ast.push({
          type: 'variable',
          children: [
            { type: 'identifier', value: name },
            { type: 'expression', children: [{ type: 'literal', value: value }] }
          ]
        });
        continue;
      }
      
      // Function/block: name (no colon needed)
      const hasColon = i + 1 < tokens.length && tokens[i + 1] === ':';
      const nextIsNewline = i + 1 < tokens.length && tokens[i + 1] === '\n';
      const isKeyword = ['if', 'loop', 'say', 'give', 'form', 'act', 'call', 'page', 'header', 'section', 'box', 'big', 'text', 'button', 'link', 'form', 'textarea', 'code', 'emoji', 'grid', 'panel', 'footer'].includes(token.toLowerCase());
      
      if (hasColon || (nextIsNewline && !isKeyword && token.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/))) {
        const name = token;
        if (hasColon) i += 2;
        else i += 1;
        
        if (i < tokens.length && tokens[i] === '\n') i++;
        
        const body: AzaleaAST[] = [];
        while (i < tokens.length) {
          const tok = tokens[i];
          
          if (tok === '\n' && i + 1 < tokens.length) {
            const nextTok = tokens[i + 1];
            if (nextTok && nextTok.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) && 
                (i + 2 >= tokens.length || tokens[i + 2] === '=' || tokens[i + 2] === ':' || tokens[i + 2] === '\n')) {
              if (!['if', 'loop', 'say', 'give', 'form', 'act', 'call', 'page', 'header', 'section', 'box', 'big', 'text', 'button', 'link', 'form', 'textarea', 'code', 'emoji', 'grid', 'panel', 'footer'].includes(nextTok.toLowerCase())) {
                break;
              }
            }
          }
          
          body.push({ type: 'statement', value: tok });
          i++;
        }
        
        ast.push({
          type: 'function',
          children: [
            { type: 'identifier', value: name },
            { type: 'body', children: body }
          ]
        });
        continue;
      }
      
      const normalized = this.normalizeKeyword(token);
      
      // Parse based on keyword
      if (normalized === 'form') {
        const node = this.parseVariable(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'act') {
        const node = this.parseFunction(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'say') {
        const node = this.parseOutput(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'if') {
        const node = this.parseIf(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'loop') {
        const node = this.parseLoop(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'give') {
        const node = this.parseGive(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else {
        i++;
      }
    }
    
    return ast;
  }

  // Parse variable - INFERS type automatically
  private parseVariable(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'variable', children: [] };
    
    // Type is optional - INFERRED
    let type = 'void';
    if (i < tokens.length && ['num', 'text', 'bool', 'list', 'map'].includes(tokens[i].toLowerCase())) {
      type = tokens[i].toLowerCase();
      i++;
    }
    
    if (i < tokens.length) {
      node.children!.push({ type: 'identifier', value: tokens[i] });
      i++;
    }
    
    // Value - INFERRED type
    if (i < tokens.length && tokens[i] === 'from' || tokens[i] === '=') {
      i++;
      const valueTokens: string[] = [];
      while (i < tokens.length && tokens[i] !== '\n' && tokens[i] !== 'do' && tokens[i] !== 'end') {
        valueTokens.push(tokens[i]);
        i++;
      }
      const value = valueTokens.join(' ').trim();
      const inferredType = this.inferType(value);
      if (type === 'void') type = inferredType;
      node.children!.push({ type: 'expression', children: [{ type: 'literal', value: value }] });
    }
    
    return { node, next: i };
  }

  // Parse function - INFERS parameters
  private parseFunction(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'function', children: [] };
    
    if (i < tokens.length) {
      node.children!.push({ type: 'identifier', value: tokens[i] });
      i++;
    }
    
    // Parameters - INFERRED
    const params: AzaleaAST[] = [];
    while (i < tokens.length && tokens[i] !== 'do' && tokens[i] !== '{' && tokens[i] !== '\n') {
      if (tokens[i].match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        params.push({ type: 'identifier', value: tokens[i] });
      }
      i++;
    }
    node.children!.push({ type: 'parameters', children: params });
    
    // Body
    if (i < tokens.length && (tokens[i] === 'do' || tokens[i] === '{')) {
      i++;
      const body: AzaleaAST[] = [];
      while (i < tokens.length && tokens[i] !== 'end' && tokens[i] !== '}') {
        body.push({ type: 'statement', value: tokens[i] });
        i++;
      }
      if (i < tokens.length && (tokens[i] === 'end' || tokens[i] === '}')) {
        i++;
      }
      node.children!.push({ type: 'body', children: body });
    }
    
    return { node, next: i };
  }

  // Parse output
  private parseOutput(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'output', children: [] };
    const values: string[] = [];
    
    while (i < tokens.length && tokens[i] !== '\n') {
      values.push(tokens[i]);
      i++;
    }
    
    if (values.length > 0) {
      node.children!.push({ type: 'value', value: values.join(' ') });
    }
    
    return { node, next: i };
  }

  // Parse if - INFERS condition
  private parseIf(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'if', children: [] };
    
    // Condition - INFERRED
    const condition: string[] = [];
    while (i < tokens.length && tokens[i] !== 'do' && tokens[i] !== '{') {
      condition.push(tokens[i]);
      i++;
    }
    node.children!.push({ type: 'condition', value: condition.join(' ') });
    
    // Body
    if (i < tokens.length && (tokens[i] === 'do' || tokens[i] === '{')) {
      i++;
      const body: AzaleaAST[] = [];
      while (i < tokens.length && tokens[i] !== 'end' && tokens[i] !== '}') {
        body.push({ type: 'statement', value: tokens[i] });
        i++;
      }
      if (i < tokens.length && (tokens[i] === 'end' || tokens[i] === '}')) {
        i++;
      }
      node.children!.push({ type: 'body', children: body });
    }
    
    return { node, next: i };
  }

  // Parse loop - INFERS count
  private parseLoop(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'loop', children: [] };
    
    // Count - INFERRED
    if (i < tokens.length && tokens[i] !== 'do' && tokens[i] !== '{') {
      node.children!.push({ type: 'count', value: tokens[i] });
      i++;
    }
    
    // Body
    if (i < tokens.length && (tokens[i] === 'do' || tokens[i] === '{')) {
      i++;
      const body: AzaleaAST[] = [];
      while (i < tokens.length && tokens[i] !== 'end' && tokens[i] !== '}') {
        body.push({ type: 'statement', value: tokens[i] });
        i++;
      }
      if (i < tokens.length && (tokens[i] === 'end' || tokens[i] === '}')) {
        i++;
      }
      node.children!.push({ type: 'body', children: body });
    }
    
    return { node, next: i };
  }

  // Parse give (return)
  private parseGive(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'give', children: [] };
    const values: string[] = [];
    
    while (i < tokens.length && tokens[i] !== '\n') {
      values.push(tokens[i]);
      i++;
    }
    
    if (values.length > 0) {
      node.children!.push({ type: 'value', value: values.join(' ') });
    }
    
    return { node, next: i };
  }

  // Execute AST - AUTO-OPTIMIZED with WASM when available
  async execute(ast: AzaleaAST[] | string): Promise<any> {
    // Auto-init WASM for speed
    await this.initWASM();
    
    // If string, parse first
    if (typeof ast === 'string') {
      ast = this.parse(ast);
    }
    
    // Try WASM first (fastest)
    if (this.wasmModule && this.wasmModule._azalea_execute) {
      try {
        const source = this.astToString(ast);
        const result = this.wasmModule._azalea_execute(source);
        if (result) return result;
      } catch (e) {
        // Fall back to TypeScript
      }
    }
    
    // Execute in TypeScript (fast)
    for (const node of ast) {
      this.executeNode(node);
    }
    
    return null;
  }

  // Convert AST to string for WASM
  private astToString(ast: AzaleaAST[]): string {
    // Simplified conversion
    return JSON.stringify(ast);
  }

  // Execute single node - INFERRED types
  private executeNode(node: AzaleaAST): any {
    switch (node.type) {
      case 'variable':
        return this.executeVariable(node);
      case 'function':
        return this.executeFunction(node);
      case 'output':
        return this.executeOutput(node);
      case 'if':
        return this.executeIf(node);
      case 'loop':
        return this.executeLoop(node);
      case 'give':
        return this.executeGive(node);
      default:
        return null;
    }
  }

  // Execute variable - INFERS type
  private executeVariable(node: AzaleaAST): any {
    if (!node.children || node.children.length < 1) return null;
    
    const name = node.children[0].value;
    let value: any = null;
    let type = 'void';
    
    if (node.children.length > 1) {
      const expr = node.children[1];
      if (expr.children && expr.children.length > 0) {
        value = this.evaluateValue(expr.children[0].value);
        type = this.inferType(value);
      }
    }
    
    this.variables.set(name, { type: type as any, value });
    this.typeInference.set(name, type);
    return value;
  }

  // Execute function
  private executeFunction(node: AzaleaAST): any {
    if (!node.children || node.children.length < 1) return null;
    
    const name = node.children[0].value;
    const params: string[] = [];
    let body: AzaleaAST[] = [];
    
    if (node.children.length > 1) {
      const paramsNode = node.children.find(c => c.type === 'parameters');
      if (paramsNode && paramsNode.children) {
        paramsNode.children.forEach(p => {
          if (p.value) params.push(p.value);
        });
      }
      
      const bodyNode = node.children.find(c => c.type === 'body');
      if (bodyNode && bodyNode.children) {
        body = bodyNode.children;
      }
    }
    
    this.functions.set(name, (args: any[]) => {
      // Set parameters
      params.forEach((param, i) => {
        this.variables.set(param, { type: this.inferType(args[i]), value: args[i] });
      });
      
      // Execute body
      let result: any = null;
      for (const stmt of body) {
        result = this.executeNode(stmt);
      }
      
      return result;
    });
    
    return null;
  }

  // Execute output
  private executeOutput(node: AzaleaAST): any {
    if (!node.children || node.children.length === 0) return null;
    
    const value = node.children[0].value;
    const output = this.evaluateValue(value);
    console.log(output);
    return output;
  }

  // Execute if
  private executeIf(node: AzaleaAST): any {
    if (!node.children || node.children.length < 2) return null;
    
    const condition = this.evaluateCondition(node.children[0].value);
    if (condition) {
      const body = node.children[1].children || [];
      for (const stmt of body) {
        this.executeNode(stmt);
      }
    }
    
    return null;
  }

  // Execute loop
  private executeLoop(node: AzaleaAST): any {
    if (!node.children || node.children.length < 1) return null;
    
    let count = 5; // Default
    if (node.children[0] && node.children[0].value) {
      const countVal = node.children[0].value;
      if (countVal === 'five') count = 5;
      else if (countVal === 'ten') count = 10;
      else if (!isNaN(parseFloat(countVal))) count = parseFloat(countVal);
    }
    
    const body = node.children[1]?.children || [];
    for (let i = 0; i < count; i++) {
      this.variables.set('step', { type: 'num', value: i });
      for (const stmt of body) {
        this.executeNode(stmt);
      }
    }
    
    return null;
  }

  // Execute give
  private executeGive(node: AzaleaAST): any {
    if (!node.children || node.children.length === 0) return null;
    return this.evaluateValue(node.children[0].value);
  }

  // Evaluate value - INFERRED
  private evaluateValue(value: string): any {
    if (!value) return null;
    
    // Check cache
    if (this.cache.has('eval:' + value)) {
      return this.cache.get('eval:' + value);
    }
    
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // Number
    if (!isNaN(parseFloat(value))) {
      return parseFloat(value);
    }
    
    // Variable
    if (this.variables.has(value)) {
      return this.variables.get(value)!.value;
    }
    
    // Cache result
    const result = value;
    this.cache.set('eval:' + value, result);
    return result;
  }

  // Evaluate condition - INFERRED
  private evaluateCondition(condition: string): boolean {
    if (!condition) return false;
    
    // Simple comparisons
    if (condition.includes('over') || condition.includes('>')) return true;
    if (condition.includes('under') || condition.includes('<')) return false;
    if (condition.includes('same') || condition.includes('==')) return true;
    
    return true;
  }

  // View output for HTML rendering
  private viewOutput: string[] = [];
  
  getViewOutput(): string {
    return this.viewOutput.join('');
  }
  
  clearViewOutput(): void {
    this.viewOutput = [];
  }

  // Render view to HTML (same as before)
  private renderViewToHTML(component: any, depth: number = 0): string {
    if (!component || typeof component !== 'object') {
      return String(component || '');
    }
    
    let tag = component.tag || 'div';
    const content = component.content || '';
    const style = component.style || '';
    const title = component.title || '';
    const href = component.href || '';
    
    // If button has href, render as link instead
    if (tag === 'button' && href) {
      tag = 'a';
    }
    
    let html = '';
    if (tag === 'html' || tag === 'page') {
      html = '<!DOCTYPE html><html><head>';
      if (title) html += `<title>${title}</title>`;
      html += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
      html += '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';
      html += '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,system-ui,-apple-system,sans-serif;line-height:1.6;color:#1F2937}';
      if (style) {
        const bgMatch = style.match(/background:([^;]+)/);
        if (bgMatch) html += `body{background:${bgMatch[1]}}`;
      }
      html += '.container{max-width:1200px;margin:0 auto;padding:0 20px}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}@media(max-width:768px){.grid-2,.grid-3{grid-template-columns:1fr}}';
      html += 'h1,h2,h3{font-weight:600;margin-bottom:16px}h1{font-size:2.5rem}h2{font-size:2rem}h3{font-size:1.5rem}';
      html += 'button,a.btn,a[href]{display:inline-block;padding:12px 24px;background:#6366F1;color:white;border:none;border-radius:8px;text-decoration:none;font-weight:500;cursor:pointer;transition:all 0.2s}button:hover,a.btn:hover,a[href]:hover{opacity:0.9;transform:translateY(-1px)}';
      html += 'header{padding:32px 0;margin-bottom:32px}section{padding:48px 0}footer{padding:32px 0;text-align:center;margin-top:64px}';
      html += 'box,div.card{background:white;padding:24px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}';
      html += 'code,pre{background:#F3F4F6;padding:16px;border-radius:8px;font-family:Monaco,monospace;overflow-x:auto}';
      html += 'textarea,input{width:100%;padding:12px;border:2px solid #E5E7EB;border-radius:8px;font-family:inherit;font-size:14px}textarea{min-height:200px;resize:vertical}';
      html += 'form{display:flex;flex-direction:column;gap:16px}';
      html += '</style>';
      html += '</head><body class="container">';
    } else {
      let attrs = '';
      if (href) attrs += ` href="${href}"`;
      if (style) attrs += ` style="${style}"`;
      if (component.class) attrs += ` class="${component.class}"`;
      if (component.id) attrs += ` id="${component.id}"`;
      if (component.name) attrs += ` name="${component.name}"`;
      if (component.type) attrs += ` type="${component.type}"`;
      if (component.action) attrs += ` action="${component.action}"`;
      if (component.method) attrs += ` method="${component.method}"`;
      
      html = `<${tag}${attrs}>`;
    }
    
    if (content) html += content;
    if (component.body) {
      if (Array.isArray(component.body)) {
        html += component.body.map((child: any) => this.renderViewToHTML(child, depth + 1)).join('');
      } else {
        html += this.renderViewToHTML(component.body, depth + 1);
      }
    }
    
    if (tag === 'html' || tag === 'page') {
      html += '</body></html>';
    } else if (!['meta', 'link', 'input', 'img', 'br', 'hr'].includes(tag)) {
      html += `</${tag}>`;
    }
    
    return html;
  }

  // Execute call - handles web elements
  private executeCall(node: AzaleaAST): any {
    if (node.children && node.children.length > 0) {
      const moduleOrFunc = node.value || node.children[0].value;
      
      const webElements = ['page', 'header', 'footer', 'section', 'box', 'big', 'text', 'button', 'link', 'form', 'textarea', 'code', 'emoji', 'grid', 'panel', 'azalea_logo'];
      if (webElements.includes(moduleOrFunc)) {
        if (moduleOrFunc === 'azalea_logo') {
          const logoHTML = '<svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><text x="10" y="28" font-family="Inter, sans-serif" font-size="24" font-weight="bold" fill="#D9A69F">&lt;/&gt;</text><text x="50" y="28" font-family="Inter, sans-serif" font-size="24" font-weight="bold" fill="#D9A69F">.az</text></svg>';
          this.viewOutput.push(logoHTML);
          return logoHTML;
        }
        
        const method = moduleOrFunc;
        const args: any[] = [];
        
        for (let i = 1; i < node.children.length; i++) {
          const child = node.children[i];
          if (child.type === 'literal') {
            args.push(this.evaluateValue(child.value));
          } else if (child.type === 'identifier') {
            args.push(child.value);
          } else {
            args.push(this.executeNode(child));
          }
        }
        
        const component: any = { tag: method === 'page' ? 'html' : method === 'big' ? 'h1' : method === 'text' ? 'p' : method === 'box' ? 'div' : method };
        
        let i = 0;
        while (i < args.length) {
          const arg = String(args[i]).toLowerCase();
          const next = i + 1 < args.length ? args[i + 1] : null;
          
          if (['title', 'bg', 'color', 'font', 'style', 'go', 'action', 'method', 'name'].includes(arg) && next !== null) {
            let value = String(next);
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            
            // Evaluate variable if it's an identifier
            if (this.variables.has(value)) {
              value = String(this.variables.get(value)!.value);
            }
            
            if (arg === 'title') component.title = value;
            else if (arg === 'style') component.style = (component.style || '') + value + ';';
            else if (arg === 'bg') {
              if (i + 3 < args.length && String(args[i + 2]).toLowerCase() === 'to') {
                const toColor = String(args[i + 3]);
                component.style = (component.style || '') + `background:linear-gradient(135deg,${value} 0%,${toColor} 100%);`;
                i += 3;
              } else {
                component.style = (component.style || '') + `background:${value};`;
              }
            }
            else if (arg === 'color') component.style = (component.style || '') + `color:${value};`;
            else if (arg === 'font') component.style = (component.style || '') + `font-family:${value};`;
            else if (arg === 'go') {
              // Handle string concatenation in href (e.g., "/lessons?lesson=" + id)
              let hrefValue = value;
              // Check if there are more args that should be concatenated
              let j = i + 2;
              while (j < args.length) {
                const nextArg = String(args[j]);
                if (nextArg === '+') {
                  j++;
                  if (j < args.length) {
                    let nextVal = String(args[j]);
                    // Evaluate variable if it's an identifier
                    if (this.variables.has(nextVal)) {
                      nextVal = String(this.variables.get(nextVal)!.value);
                    }
                    hrefValue += nextVal;
                    j++;
                  }
                } else {
                  break;
                }
              }
              component.href = hrefValue;
              i = j - 1; // Update i to skip processed args
            }
            else if (arg === 'action') component.action = value;
            else if (arg === 'method') component.method = value;
            else if (arg === 'name') component.name = value;
            
            i += 2;
          } else {
            let content = String(args[i]);
            if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
              content = content.slice(1, -1);
            }
            if (!component.content) {
              component.content = content;
            }
            i++;
          }
        }
        
        const bodyNode = node.children.find((c: any) => c.type === 'body');
        if (bodyNode && bodyNode.children) {
          component.body = bodyNode.children.map((child: any) => this.executeNode(child));
        }
        
        const html = this.renderViewToHTML(component);
        this.viewOutput.push(html);
        return html;
      }
      
      const func = this.functions.get(moduleOrFunc);
      if (func) {
        const args = node.children.slice(1).map(child => {
          if (child.type === 'literal') {
            return this.evaluateValue(child.value);
          }
          return this.executeNode(child);
        });
        const result = func(args);
        if (typeof result === 'string' && (result.includes('<svg') || result.includes('<html') || result.includes('<!DOCTYPE'))) {
          this.viewOutput.push(result);
        }
        return result;
      }
    }
    return null;
  }
}
