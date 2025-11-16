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

  // Tokenize with flexible grammar
  private tokenize(source: string): string[] {
    // Handle multiple comment styles
    source = source.replace(/\/\/.*$/gm, ''); // // comments
    source = source.replace(/\/\*[\s\S]*?\*\//g, ''); // /* */ comments
    source = source.replace(/#.*$/gm, ''); // # comments
    
    // Split into tokens, handling multiple delimiters
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
      } else if (/[{}();,\[\]]/.test(char)) {
        if (current.trim()) tokens.push(current.trim());
        tokens.push(char);
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) tokens.push(current.trim());
    return tokens.filter(t => t.length > 0);
  }

  // Parse tokens into AST
  private parseTokens(tokens: string[]): AzaleaAST[] {
    const ast: AzaleaAST[] = [];
    let i = 0;
    
    while (i < tokens.length) {
      const token = tokens[i];
      const normalized = this.normalizeKeyword(token);
      
      if (normalized === 'form') {
        const node = this.parseVariable(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'act') {
        const node = this.parseFunction(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'if') {
        const node = this.parseConditional(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'loop') {
        const node = this.parseLoop(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else if (normalized === 'say') {
        const node = this.parseOutput(tokens, i);
        ast.push(node.node);
        i = node.next;
      } else {
        i++;
      }
    }
    
    return ast;
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

  private parseLoop(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'loop', children: [] };
    
    // Count or condition
    if (i < tokens.length) {
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
    
    return { node, next: i };
  }

  private parseOutput(tokens: string[], start: number): { node: AzaleaAST; next: number } {
    let i = start + 1;
    const node: AzaleaAST = { type: 'output', children: [] };
    
    // Value to output
    if (i < tokens.length) {
      node.children!.push({ type: 'value', value: tokens[i] });
      i++;
    }
    
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
      default:
        return null;
    }
  }

  private executeVariable(node: AzaleaAST): void {
    const name = node.children?.find(c => c.type === 'identifier')?.value;
    const valueNode = node.children?.find(c => c.type === 'expression');
    if (name && valueNode) {
      const value = this.evaluateExpression(valueNode);
      this.variables.set(name, value);
    }
  }

  private executeFunction(node: AzaleaAST): void {
    const name = node.children?.find(c => c.type === 'identifier')?.value;
    if (name) {
      this.functions.set(name, () => {
        const body = node.children?.find(c => c.type === 'body');
        if (body) {
          this.executeNode(body);
        }
      });
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
      const count = parseInt(condition.value || '0');
      for (let i = 0; i < count; i++) {
        body.children?.forEach(child => this.executeNode(child));
      }
    }
  }

  private executeOutput(node: AzaleaAST): void {
    const value = node.children?.find(c => c.type === 'value');
    if (value) {
      const output = this.evaluateValue(value.value);
      console.log(output);
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

