// Azalea TypeScript Interpreter/Compiler
// Supports both interpreted execution and TypeScript compilation

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

  // Flexible keyword mappings - SUPER LOOSE GRAMMAR
  private keywordAliases: Map<string, string> = new Map([
    // Variables
    ['form', 'form'], ['let', 'form'], ['var', 'form'], ['const', 'form'],
    ['set', 'form'], ['create', 'form'], ['make', 'form'], ['declare', 'form'],
    ['define', 'form'], ['init', 'form'], ['new', 'form'],
    
    // Functions
    ['act', 'act'], ['def', 'act'], ['fn', 'act'], ['func', 'act'],
    ['function', 'act'], ['method', 'act'], ['procedure', 'act'],
    
    // Conditionals
    ['if', 'if'], ['when', 'if'], ['whenever', 'if'], ['provided', 'if'],
    ['assuming', 'if'], ['given', 'if'],
    
    // Loops
    ['loop', 'loop'], ['while', 'loop'], ['for', 'loop'], ['repeat', 'loop'],
    ['each', 'loop'], ['foreach', 'loop'], ['iterate', 'loop'],
    
    // Output
    ['say', 'say'], ['print', 'say'], ['output', 'say'], ['display', 'say'],
    ['log', 'say'], ['echo', 'say'], ['show', 'say'], ['write', 'say'],
    
    // Return
    ['give', 'give'], ['return', 'give'], ['yield', 'give'], ['send', 'give'],
    
    // Assignment
    ['put', 'put'], ['assign', 'put'], ['set', 'put'], ['update', 'put'],
    
    // Operators - many variations
    ['plus', '+'], ['add', '+'], ['sum', '+'], ['+', '+'],
    ['minus', '-'], ['subtract', '-'], ['sub', '-'], ['-', '-'],
    ['times', '*'], ['multiply', '*'], ['mul', '*'], ['*', '*'],
    ['div', '/'], ['divide', '/'], ['/', '/'],
    ['mod', '%'], ['modulo', '%'], ['%', '%'],
    ['power', '**'], ['pow', '**'], ['**', '**'],
    
    // Comparisons
    ['over', '>'], ['greater', '>'], ['above', '>'], ['>', '>'],
    ['under', '<'], ['less', '<'], ['below', '<'], ['<', '<'],
    ['same', '=='], ['equals', '=='], ['is', '=='], ['are', '=='], ['==', '=='],
    ['notequal', '!='], ['not', '!='], ['!=', '!='],
    ['and', '&&'], ['andalso', '&&'], ['&&', '&&'],
    ['or', '||'], ['orelse', '||'], ['||', '||'],
  ]);

  // Normalize keyword to canonical form
  private normalizeKeyword(keyword: string): string {
    return this.keywordAliases.get(keyword.toLowerCase()) || keyword;
  }

  // Parse Azalea code with super flexible grammar
  parse(source: string): AzaleaAST[] {
    const tokens = this.tokenize(source);
    return this.parseTokens(tokens);
  }

  // ULTIMATE FLEXIBLE tokenizer - no rigid rules, handles ANY combination
  private tokenize(source: string): string[] {
    // Handle comments
    source = source.replace(/\/\/.*$/gm, '');
    source = source.replace(/\/\*[\s\S]*?\*\//g, '');
    source = source.replace(/#.*$/gm, '');
    
    // Ultra-flexible tokenization: preserve everything, split only on meaningful boundaries
    const tokens: string[] = [];
    let current = '';
    let inString = false;
    let stringChar = '';
    let inNameQuote = false;
    
    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      
      // Handle name'identifier' syntax
      if (!inString && char === "'" && current.toLowerCase().endsWith('name')) {
        inNameQuote = true;
        if (current.length > 4) {
          tokens.push(current.slice(0, -4));
          current = 'name';
        }
        continue;
      }
      
      if (inNameQuote) {
        if (char === "'") {
          tokens.push("name'" + current + "'");
          current = '';
          inNameQuote = false;
          continue;
        }
        current += char;
        continue;
      }
      
      // Strings
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
      } 
      // Block delimiters - always separate
      else if (/[{}()\[\]]/.test(char)) {
        if (current.trim()) tokens.push(current.trim());
        tokens.push(char);
        current = '';
      }
      // Whitespace - can be separator OR part of token (for flexibility)
      else if (/\s/.test(char)) {
        // Only split if we have a meaningful token
        // Allow "say.Hello" to stay together, but "say Hello" can split
        if (current.trim() && !current.match(/[a-zA-Z0-9_]+[\.\d]+$/)) {
          tokens.push(current.trim());
          current = '';
        } else if (current.trim().length > 0) {
          // Keep whitespace in token for ultra-flexible parsing
          current += char;
        }
      }
      // Everything else goes into current token (dots, numbers, letters, etc.)
      else {
        current += char;
      }
    }
    
    if (current.trim()) tokens.push(current.trim());
    
    // Post-process: Extract all possible patterns
    // This allows "5say", "say.", "say.Hello", "say Hello 5", etc. to all work
    const processed: string[] = [];
    for (const token of tokens) {
      if (!token) continue;
      
      // Try to split number+keyword (e.g., "5say" -> ["5", "say"])
      const numKeywordMatch = token.match(/^(\d+)([a-zA-Z_][a-zA-Z0-9_]*)$/);
      if (numKeywordMatch) {
        processed.push(numKeywordMatch[1]);
        processed.push(numKeywordMatch[2]);
        continue;
      }
      
      // Try to split keyword+dot (e.g., "say." -> ["say", "."])
      const keywordDotMatch = token.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.$/);
      if (keywordDotMatch) {
        processed.push(keywordDotMatch[1]);
        processed.push('.');
        continue;
      }
      
      // Try to split keyword+dot+text (e.g., "say.Hello" -> ["say", ".", "Hello"])
      const keywordDotTextMatch = token.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.([^\s]+)$/);
      if (keywordDotTextMatch) {
        processed.push(keywordDotTextMatch[1]);
        processed.push('.');
        processed.push(keywordDotTextMatch[2]);
        continue;
      }
      
      // Keep as-is
      processed.push(token);
    }
    
    return processed.filter(t => t && t.length > 0);
  }

  // ULTIMATE FLEXIBLE parser - pattern-agnostic, handles ANY combination
  private parseTokens(tokens: string[]): AzaleaAST[] {
    const ast: AzaleaAST[] = [];
    let i = 0;
    
    while (i < tokens.length) {
      const token = tokens[i];
      const normalized = this.normalizeKeyword(token);
      
      // ULTRA FLEXIBLE: Look for patterns in ANY order
      // Pattern 1: Number before keyword (5say, 5 say, etc.)
      // Pattern 2: Keyword with dot (say., say.Hello, etc.)
      // Pattern 3: Keyword with number after (say 5, say Hello 5, etc.)
      // Pattern 4: Any combination of the above
      
      let repeatCount: number | null = null;
      let hasDot = false;
      
      // Check current and surrounding tokens for flexible patterns
      // Look ahead and behind for numbers, dots, keywords
      
      // Check if current is a number and next is a keyword
      if (!isNaN(parseFloat(token)) && i + 1 < tokens.length) {
        const nextToken = tokens[i + 1];
        const nextNormalized = this.normalizeKeyword(nextToken);
        if (nextNormalized === 'say' || nextNormalized === 'loop' || nextNormalized === 'print') {
          repeatCount = parseFloat(token);
          i++; // Skip the number, process keyword next
          continue; // Will process keyword in next iteration
        }
      }
      
      // Check if current token ends with dot or has dot after
      if (token.endsWith('.') || (i + 1 < tokens.length && tokens[i + 1] === '.')) {
        hasDot = true;
      }
      
      // Check if previous token was a number (for "5 say" pattern)
      if (i > 0 && !isNaN(parseFloat(tokens[i - 1]))) {
        const prevNormalized = this.normalizeKeyword(token);
        if (prevNormalized === 'say' || prevNormalized === 'loop') {
          repeatCount = parseFloat(tokens[i - 1]);
        }
      }
      
      // Now parse based on keyword
      if (normalized === 'form') {
        const node = this.parseVariable(tokens, i);
        ast.push(node.node);
        i = node.next;
        i = this.parseNaming(tokens, i, node.node);
      } else if (normalized === 'act') {
        const node = this.parseFunction(tokens, i);
        ast.push(node.node);
        i = node.next;
        i = this.parseNaming(tokens, i, node.node);
      } else if (normalized === 'if') {
        const node = this.parseConditional(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'loop') {
        const node = this.parseLoop(tokens, i, repeatCount);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'say' || normalized === 'print') {
        const node = this.parseOutput(tokens, i, repeatCount, hasDot);
        ast.push(node.node);
        i = node.next;
      } else {
        // ULTRA FLEXIBLE: Check if it's ANY HTML element or module - auto-detect!
        // Support: h1 Title, button Click, view h1 Title, web fetch url, etc.
        // Pattern-agnostic: any order works!
        
        const htmlElements = [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'button',
          'input', 'form', 'img', 'a', 'ul', 'ol', 'li', 'table', 'tr', 'td',
          'header', 'footer', 'nav', 'main', 'section', 'article', 'aside',
          'video', 'audio', 'canvas', 'svg', 'textarea', 'select', 'option'
        ];
        
        const moduleNames = [
          'view', 'web', 'net', 'file', 'serve', 'play', 'markdown',
          'query', 'database', 'csv', 'go', 'channel', 'run'
        ];
        
        // Check if current token is an HTML element (can be used directly!)
        if (htmlElements.includes(token.toLowerCase())) {
          const elementCall = this.parseDirectElementCall(tokens, i);
          if (elementCall) {
            ast.push(elementCall.node);
            i = elementCall.next;
            continue;
          }
        }
        
        // Check if it's a module name
        if (moduleNames.includes(token.toLowerCase())) {
          const moduleCall = this.parseDirectModuleCall(tokens, i);
          if (moduleCall) {
            ast.push(moduleCall.node);
            i = moduleCall.next;
            continue;
          }
        }
        
        i++;
      }
    }
    
    return ast;
  }
  
  // Parse name'identifier' syntax - flexible format
  private parseNaming(tokens: string[], start: number, targetNode: AzaleaAST): number {
    let i = start;
    
    // Handle "name'identifier'" as single token or separate tokens
    if (i < tokens.length) {
      const token = tokens[i];
      
      // Check if token is "name'identifier'" format
      const nameMatch = token.match(/^name'([^']+)'$/);
      if (nameMatch) {
        targetNode.value = nameMatch[1];
        i++;
        return i;
      }
      
      // Check if token starts with "name'"
      if (token.startsWith("name'") && token.endsWith("'")) {
        const name = token.slice(5, -1); // Remove "name'" and "'"
        targetNode.value = name;
        i++;
        return i;
      }
      
      // Check for separate "name" token followed by quoted identifier
      if (token.toLowerCase() === 'name') {
        i++;
        if (i < tokens.length) {
          let nameToken = tokens[i];
          // Handle various quote styles
          if (nameToken.startsWith("'") && nameToken.endsWith("'")) {
            targetNode.value = nameToken.slice(1, -1);
            i++;
          } else if (nameToken.startsWith('"') && nameToken.endsWith('"')) {
            targetNode.value = nameToken.slice(1, -1);
            i++;
          }
        }
      }
    }
    
    return i;
  }

  private parseVariable(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'variable', children: [] };
    
    // Type (optional)
    if (i < tokens.length && ['num', 'text', 'bool', 'list', 'map'].includes(tokens[i])) {
      node.children!.push({ type: 'type', value: tokens[i] });
      i++;
    }
    
    // Name
    if (i < tokens.length) {
      node.children!.push({ type: 'identifier', value: tokens[i] });
      i++;
    }
    
    // Assignment - many variations
    const assignKeywords = ['from', 'is', 'equals', '=', 'to', 'as', 'becomes'];
    if (i < tokens.length && assignKeywords.includes(tokens[i])) {
      i++; // skip assignment keyword
      const value = this.parseExpression(tokens, i);
      node.children!.push(value.node);
      i = value.next;
    }
    
    return { node, next: i };
  }

  private parseFunction(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'function', children: [] };
    
    // Function name
    if (i < tokens.length) {
      node.children!.push({ type: 'identifier', value: tokens[i] });
      i++;
    }
    
    // Parameters
    const params: AzaleaAST[] = [];
    while (i < tokens.length && !['do', 'then', '{', 'begin'].includes(tokens[i])) {
      if (tokens[i] !== ',') {
        params.push({ type: 'parameter', value: tokens[i] });
      }
      i++;
    }
    node.children!.push({ type: 'parameters', children: params });
    
    // Skip block start
    if (i < tokens.length && ['do', 'then', '{', 'begin'].includes(tokens[i])) {
      i++;
    }
    
    // Body
    const body: AzaleaAST[] = [];
    let depth = 1;
    while (i < tokens.length && depth > 0) {
      if (['end', '}', 'finish', 'done'].includes(tokens[i])) {
        depth--;
        if (depth === 0) break;
      } else if (['do', 'then', '{', 'begin'].includes(tokens[i])) {
        depth++;
      }
      body.push({ type: 'statement', value: tokens[i] });
      i++;
    }
    node.children!.push({ type: 'body', children: body });
    
    if (i < tokens.length && ['end', '}', 'finish', 'done'].includes(tokens[i])) {
      i++;
    }
    
    return { node, next: i };
  }

  private parseConditional(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'conditional', children: [] };
    
    // Condition
    const condition = this.parseExpression(tokens, i);
    node.children!.push(condition.node);
    i = condition.next;
    
    // Block start
    if (i < tokens.length && ['do', 'then', '{', 'begin'].includes(tokens[i])) {
      i++;
    }
    
    // Body
    const body: AzaleaAST[] = [];
    let depth = 1;
    while (i < tokens.length && depth > 0) {
      if (['end', '}', 'finish', 'done', 'else', 'otherwise'].includes(tokens[i])) {
        if (tokens[i] === 'else' || tokens[i] === 'otherwise') {
          // Handle else
        }
        depth--;
        if (depth === 0) break;
      } else if (['do', 'then', '{', 'begin'].includes(tokens[i])) {
        depth++;
      }
      body.push({ type: 'statement', value: tokens[i] });
      i++;
    }
    node.children!.push({ type: 'body', children: body });
    
    return { node, next: i };
  }

  private parseLoop(tokens: string[], start: number, repeatCount: number | null = null): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'loop', children: [] };
    
    // Count or condition - use provided repeatCount or parse from tokens
    if (repeatCount !== null) {
      node.children!.push({ type: 'condition', value: repeatCount.toString() });
    } else if (i < tokens.length) {
      node.children!.push({ type: 'condition', value: tokens[i] });
      i++;
    }
    
    // Block start
    if (i < tokens.length && ['do', 'then', '{', 'begin'].includes(tokens[i])) {
      i++;
    }
    
    // Body
    const body: AzaleaAST[] = [];
    let depth = 1;
    while (i < tokens.length && depth > 0) {
      if (['end', '}', 'finish', 'done'].includes(tokens[i])) {
        depth--;
        if (depth === 0) break;
      } else if (['do', 'then', '{', 'begin'].includes(tokens[i])) {
        depth++;
      }
      body.push({ type: 'statement', value: tokens[i] });
      i++;
    }
    node.children!.push({ type: 'body', children: body });
    
    // Check for name'identifier' after loop
    if (i < tokens.length && tokens[i].toLowerCase() === 'name') {
      i++;
      if (i < tokens.length && tokens[i].startsWith("'") && tokens[i].endsWith("'")) {
        const name = tokens[i].slice(1, -1);
        node.value = name;
        i++;
      }
    }
    
    return { node, next: i };
  }

  // Parse direct HTML element call - ULTRA FLEXIBLE!
  // Supports: h1 Title, button Click, p Hello World, etc.
  private parseDirectElementCall(tokens: string[], start: number): { node: AzaleaAST; next: number } | null {
    let i = start;
    const elementName = tokens[i].toLowerCase();
    i++;
    
    const node: AzaleaAST = {
      type: 'call',
      value: 'view', // Implicitly use view module
      children: [
        { type: 'identifier', value: elementName }
      ]
    };
    
    // ULTRA FLEXIBLE: Collect arguments - no quotes needed, any order
    const args: string[] = [];
    while (i < tokens.length) {
      const token = tokens[i].toLowerCase();
      
      // Stop at block keywords
      if (['do', 'then', '{', 'end', '}', 'if', 'loop', 'form', 'act', 'call', 'say', 'view', 'web'].includes(token)) {
        break;
      }
      
      // Stop at newline if next is a statement
      if (token === '\n' && i + 1 < tokens.length) {
        const next = tokens[i + 1].toLowerCase();
        if (['do', 'end', 'if', 'loop', 'form', 'act', 'call', 'say', 'view', 'web', 'h1', 'h2', 'button', 'p'].includes(next)) {
          break;
        }
      }
      
      // Add argument (no quotes needed for simple strings!)
      if (token !== '\n' && token.trim() && !['placeholder', 'type', 'src', 'href', 'id', 'class'].includes(token)) {
        args.push(tokens[i]);
      }
      i++;
    }
    
    // Add all arguments
    if (args.length > 0) {
      node.children!.push({ type: 'literal', value: args.join(' ') });
    }
    
    return { node, next: i };
  }

  // Parse direct module call without "call" keyword - SUPER SIMPLE!
  private parseDirectModuleCall(tokens: string[], start: number): { node: AzaleaAST; next: number } | null {
    let i = start;
    const moduleName = tokens[i].toLowerCase();
    i++;
    
    // Get method name
    if (i >= tokens.length) return null;
    const method = tokens[i];
    i++;
    
    const node: AzaleaAST = {
      type: 'call',
      value: moduleName,
      children: [
        { type: 'identifier', value: method }
      ]
    };
    
    // ULTRA FLEXIBLE: Collect arguments - no quotes needed, any order
    const args: string[] = [];
    while (i < tokens.length) {
      const token = tokens[i].toLowerCase();
      
      // Stop at block keywords
      if (['do', 'then', '{', 'end', '}', 'if', 'loop', 'form', 'act', 'call', 'say'].includes(token)) {
        break;
      }
      
      // Stop at newline if next is a statement
      if (token === '\n' && i + 1 < tokens.length) {
        const next = tokens[i + 1].toLowerCase();
        if (['do', 'end', 'if', 'loop', 'form', 'act', 'call', 'say', 'view', 'web', 'h1', 'h2', 'button'].includes(next)) {
          break;
        }
      }
      
      // Add argument (no quotes needed!)
      if (token !== '\n' && token.trim()) {
        args.push(tokens[i]);
      }
      i++;
    }
    
    // Add all arguments as single value (flexible parsing)
    if (args.length > 0) {
      node.children!.push({ type: 'literal', value: args.join(' ') });
    }
    
    return { node, next: i };
  }

  // ULTRA FLEXIBLE output parser - handles ANY combination
  private parseOutput(tokens: string[], start: number, repeatCount: number | null = null, hasDot: boolean = false): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'output', children: [] };
    
    // Handle dot in ANY position: "say.", "say.Hello", etc.
    if (i < tokens.length && tokens[i] === '.') {
      i++; // Skip the dot
    }
    
    // Collect all values - be flexible about what constitutes the message
    const values: string[] = [];
    let foundNumber = false;
    
    while (i < tokens.length && !['do', 'then', '{', 'end', '}', ';', 'name'].includes(tokens[i])) {
      const token = tokens[i];
      const num = parseFloat(token);
      
      // If this is a number and we haven't set repeatCount yet, it might be the count
      // OR it might be part of the message - be flexible!
      if (!isNaN(num)) {
        // Check if this looks like it's at the end (next token is delimiter or name)
        const isAtEnd = i + 1 >= tokens.length || 
                        ['do', 'then', '{', 'end', '}', ';', 'name'].includes(tokens[i + 1]);
        
        if (isAtEnd && repeatCount === null) {
          // Likely the repeat count
          repeatCount = num;
          i++;
          foundNumber = true;
          break;
        } else if (!foundNumber && repeatCount === null && i === tokens.length - 1) {
          // Last token, likely repeat count
          repeatCount = num;
          i++;
          foundNumber = true;
          break;
        }
        // Otherwise, treat as part of message (e.g., "say version 2.0")
        values.push(token);
      } else {
        values.push(token);
      }
      i++;
    }
    
    // If we have values, add them
    if (values.length > 0) {
      node.children!.push({ type: 'value', value: values.join(' ') });
    }
    
    // Store repeat count if provided (from any source)
    if (repeatCount !== null) {
      node.children!.push({ type: 'repeat', value: repeatCount.toString() });
    }
    
    // Check for name'identifier' after output (flexible position)
    i = this.parseNaming(tokens, i, node);
    
    return { node, next: i };
  }

  private parseExpression(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start;
    const node: AzaleaAST = { type: 'expression', children: [] };
    
    while (i < tokens.length && !['do', 'then', '{', 'end', '}', ';'].includes(tokens[i])) {
      node.children!.push({ type: 'token', value: tokens[i] });
      i++;
    }
    
    return { node, next: i };
  }

  // Execute AST
  execute(ast: AzaleaAST[]): void {
    for (const node of ast) {
      this.executeNode(node);
    }
  }

  private executeNode(node: AzaleaAST): any {
    switch (node.type) {
      case 'variable':
        return this.executeVariable(node);
      case 'function':
        return this.executeFunction(node);
      case 'conditional':
        return this.executeConditional(node);
      case 'loop':
        return this.executeLoop(node);
      case 'output':
        return this.executeOutput(node);
      case 'call':
        return this.executeCall(node);
      default:
        return null;
    }
  }
  
  private executeCall(node: AzaleaAST): void {
    if (node.children && node.children.length > 0) {
      const moduleOrFunc = node.value || node.children[0].value;
      
      // Check if it's a module (view, web, net, etc.)
      const modules = [
        'view', 'web', 'net', 'file', 'serve', 'play', 'markdown',
        'query', 'database', 'csv', 'go', 'channel', 'run'
      ];
      if (modules.includes(moduleOrFunc)) {
        // Module call - in browser, this would create DOM elements or call APIs
        // For now, just acknowledge
        if (node.children.length > 1) {
          const method = node.children[1].value;
          // Module method called - would execute in browser
        }
        return;
      }
      
      // Regular function call
      const func = this.functions.get(moduleOrFunc);
      if (func) {
        const args = node.children.slice(1).map(child => {
          if (child.type === 'literal') {
            return this.evaluateValue(child.value);
          }
          return this.executeNode(child);
        });
        return func(args);
      }
    }
  }

  private executeVariable(node: AzaleaAST): void {
    const name = node.children?.find(c => c.type === 'identifier')?.value;
    const valueNode = node.children?.find(c => c.type === 'expression');
    if (name && valueNode) {
      const value = this.evaluateExpression(valueNode);
      this.variables.set(name, value);
    }
    
    // If node has a name (from name'identifier'), also store it with that name
    if (node.value && name) {
      const value = valueNode ? this.evaluateExpression(valueNode) : { type: 'void', value: null };
      this.variables.set(node.value, value);
    }
  }

  private executeFunction(node: AzaleaAST): void {
    const name = node.children?.find(c => c.type === 'identifier')?.value;
    if (name) {
      const func = () => {
        const body = node.children?.find(c => c.type === 'body');
        if (body) {
          this.executeNode(body);
        }
      };
      this.functions.set(name, func);
      
      // If node has a name (from name'identifier'), also store it with that name
      if (node.value) {
        this.functions.set(node.value, func);
        this.variables.set(node.value, { type: 'func', value: func });
      }
    }
  }

  private executeConditional(node: AzaleaAST): void {
    const condition = node.children?.find(c => c.type === 'expression');
    if (condition && this.evaluateExpression(condition)) {
      const body = node.children?.find(c => c.type === 'body');
      if (body) {
        body.children?.forEach(child => this.executeNode(child));
      }
    }
  }

  private executeLoop(node: AzaleaAST): void {
    const condition = node.children?.find(c => c.type === 'condition');
    const body = node.children?.find(c => c.type === 'body');
    
    if (condition && body) {
      const countValue = condition.value || '0';
      const count = isNaN(parseFloat(countValue)) 
        ? this.evaluateValue(countValue) 
        : parseInt(countValue);
      const numCount = typeof count === 'number' ? count : parseInt(String(count)) || 0;
      
      for (let i = 0; i < numCount; i++) {
        // Set step variable for loop iteration
        this.variables.set('step', { type: 'num', value: i });
        body.children?.forEach(child => this.executeNode(child));
      }
    }
    
    // Store named loop if name is provided
    if (node.value) {
      this.variables.set(node.value, { type: 'func', value: () => this.executeLoop(node) });
    }
  }

  private executeOutput(node: AzaleaAST): void {
    const value = node.children?.find(c => c.type === 'value');
    const repeatNode = node.children?.find(c => c.type === 'repeat');
    const repeatCount = repeatNode ? parseInt(repeatNode.value || '1') : 1;
    
    if (value) {
      const output = this.evaluateValue(value.value);
      for (let i = 0; i < repeatCount; i++) {
        console.log(output);
      }
    }
    
    // Store named output if name is provided
    if (node.value) {
      this.variables.set(node.value, { type: 'text', value: value ? this.evaluateValue(value.value) : '' });
    }
  }

  private evaluateExpression(node: AzaleaAST): AzaleaValue {
    // Simple evaluation - expand for full expression parsing
    if (node.children && node.children.length > 0) {
      const first = node.children[0];
      return this.evaluateValue(first.value);
    }
    return { type: 'void', value: null };
  }

  private evaluateValue(value: any): any {
    if (typeof value === 'string') {
      if (this.variables.has(value)) {
        return this.variables.get(value)?.value;
      }
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
      }
      return value.replace(/^["']|["']$/g, '');
    }
    return value;
  }

  // Compile to TypeScript
  compileToTypeScript(source: string): string {
    const ast = this.parse(source);
    return this.generateTypeScript(ast);
  }

  private generateTypeScript(ast: AzaleaAST[]): string {
    const lines: string[] = [];
    
    for (const node of ast) {
      switch (node.type) {
        case 'variable':
          lines.push(this.generateVariableTS(node));
          break;
        case 'function':
          lines.push(this.generateFunctionTS(node));
          break;
        case 'conditional':
          lines.push(this.generateConditionalTS(node));
          break;
        case 'loop':
          lines.push(this.generateLoopTS(node));
          break;
        case 'output':
          lines.push(this.generateOutputTS(node));
          break;
      }
    }
    
    return lines.join('\n');
  }

  private generateVariableTS(node: AzaleaAST): string {
    const name = node.children?.find(c => c.type === 'identifier')?.value;
    const type = node.children?.find(c => c.type === 'type')?.value || 'any';
    const value = node.children?.find(c => c.type === 'expression');
    
    const tsType = type === 'num' ? 'number' : type === 'text' ? 'string' : type === 'bool' ? 'boolean' : 'any';
    const tsValue = value ? this.generateExpressionTS(value) : 'undefined';
    
    return `let ${name}: ${tsType} = ${tsValue};`;
  }

  private generateFunctionTS(node: AzaleaAST): string {
    const name = node.children?.find(c => c.type === 'identifier')?.value;
    const params = node.children?.find(c => c.type === 'parameters');
    const body = node.children?.find(c => c.type === 'body');
    
    const paramList = params?.children?.map(p => `${p.value}: any`).join(', ') || '';
    const bodyTS = body ? this.generateBodyTS(body) : '';
    
    return `function ${name}(${paramList}) {\n  ${bodyTS}\n}`;
  }

  private generateConditionalTS(node: AzaleaAST): string {
    const condition = node.children?.find(c => c.type === 'expression');
    const body = node.children?.find(c => c.type === 'body');
    
    const condTS = condition ? this.generateExpressionTS(condition) : 'true';
    const bodyTS = body ? this.generateBodyTS(body) : '';
    
    return `if (${condTS}) {\n  ${bodyTS}\n}`;
  }

  private generateLoopTS(node: AzaleaAST): string {
    const condition = node.children?.find(c => c.type === 'condition');
    const body = node.children?.find(c => c.type === 'body');
    
    const count = condition?.value || '0';
    const bodyTS = body ? this.generateBodyTS(body) : '';
    
    return `for (let i = 0; i < ${count}; i++) {\n  ${bodyTS}\n}`;
  }

  private generateOutputTS(node: AzaleaAST): string {
    const value = node.children?.find(c => c.type === 'value');
    const valueTS = value ? this.generateValueTS(value.value) : '';
    return `console.log(${valueTS});`;
  }

  private generateExpressionTS(node: AzaleaAST): string {
    if (!node.children || node.children.length === 0) return '';
    return node.children.map(c => c.value).join(' ');
  }

  private generateBodyTS(node: AzaleaAST): string {
    if (!node.children) return '';
    return node.children.map(c => this.generateStatementTS(c)).join('\n  ');
  }

  private generateStatementTS(node: AzaleaAST): string {
    switch (node.type) {
      case 'output':
        return this.generateOutputTS(node);
      default:
        return node.value || '';
    }
  }

  private generateValueTS(value: any): string {
    if (typeof value === 'string') {
      if (!isNaN(parseFloat(value))) {
        return value;
      }
      return `"${value.replace(/^["']|["']$/g, '')}"`;
    }
    return String(value);
  }
}

// Export for use
export default AzaleaRuntime;

