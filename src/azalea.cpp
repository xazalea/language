#include "azalea.h"
#include <cmath>
#include <thread>
#include <chrono>
#include <future>
#include <mutex>
#include <map>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/fetch.h>
#endif

namespace azalea {

// Number word mappings
std::map<std::string, double> numberWords = {
    {"zero", 0}, {"one", 1}, {"two", 2}, {"three", 3}, {"four", 4},
    {"five", 5}, {"six", 6}, {"seven", 7}, {"eight", 8}, {"nine", 9},
    {"ten", 10}, {"eleven", 11}, {"twelve", 12}, {"thirteen", 13},
    {"fourteen", 14}, {"fifteen", 15}, {"sixteen", 16}, {"seventeen", 17},
    {"eighteen", 18}, {"nineteen", 19}, {"twenty", 20}, {"thirty", 30},
    {"forty", 40}, {"fifty", 50}, {"sixty", 60}, {"seventy", 70},
    {"eighty", 80}, {"ninety", 90}, {"hundred", 100}, {"thousand", 1000},
    {"million", 1000000}, {"four_zero_zero_zero", 4000},
    {"four_g", 4 * 1024 * 1024 * 1024}
};

double wordToNumber(const std::string& word) {
    auto it = numberWords.find(word);
    if (it != numberWords.end()) {
        return it->second;
    }
    // Try to parse as number
    try {
        return std::stod(word);
    } catch (...) {
        return 0.0;
    }
}

std::string numberToWord(double num) {
    for (const auto& pair : numberWords) {
        if (std::abs(pair.second - num) < 0.001) {
            return pair.first;
        }
    }
    return std::to_string(static_cast<int>(num));
}

// Value implementation
std::string Value::toString() const {
    switch (type) {
        case ValueType::NUM:
            return std::to_string(std::get<double>(data));
        case ValueType::TEXT:
            return std::get<std::string>(data);
        case ValueType::BOOL:
            return std::get<bool>(data) ? "true" : "false";
        case ValueType::VOID:
            return "void";
        case ValueType::LIST: {
            std::string result = "[";
            auto& list = std::get<std::vector<ValuePtr>>(data);
            for (size_t i = 0; i < list.size(); i++) {
                if (i > 0) result += ", ";
                result += list[i]->toString();
            }
            result += "]";
            return result;
        }
        case ValueType::MAP: {
            std::string result = "{";
            auto& map = std::get<std::map<std::string, ValuePtr>>(data);
            bool first = true;
            for (const auto& pair : map) {
                if (!first) result += ", ";
                result += pair.first + ": " + pair.second->toString();
                first = false;
            }
            result += "}";
            return result;
        }
        default:
            return "unknown";
    }
}

double Value::toNumber() const {
    switch (type) {
        case ValueType::NUM:
            return std::get<double>(data);
        case ValueType::BOOL:
            return std::get<bool>(data) ? 1.0 : 0.0;
        case ValueType::TEXT: {
            try {
                return std::stod(std::get<std::string>(data));
            } catch (...) {
                return wordToNumber(std::get<std::string>(data));
            }
        }
        default:
            return 0.0;
    }
}

bool Value::toBool() const {
    switch (type) {
        case ValueType::BOOL:
            return std::get<bool>(data);
        case ValueType::NUM:
            return std::get<double>(data) != 0.0;
        case ValueType::TEXT:
            return !std::get<std::string>(data).empty();
        default:
            return false;
    }
}

// Lexer implementation
const std::vector<std::string> Lexer::keywords = {
    "form", "act", "call", "give", "say", "do", "end", "if", "loop",
    "over", "under", "same", "not", "and", "or", "from", "to", "with",
    "as", "num", "text", "list", "map", "bool", "void", "put", "make",
    "on", "serve", "view", "read", "write", "net", "file", "vm", "play",
    "else", "plus", "minus", "times", "div", "show", "render", "style",
    "button", "btn", "input", "field", "image", "img", "label", "pane",
    "div", "box", "ul", "start", "route", "post", "delete", "del",
    "static", "files", "json", "send", "css"
};

const std::string Lexer::symbols = ".,/?!;";

void Lexer::skipWhitespace() {
    while (pos < source.length() && std::isspace(source[pos])) {
        if (source[pos] == '\n') {
            line++;
            col = 1;
        } else {
            col++;
        }
        pos++;
    }
}

void Lexer::skipComment() {
    if (pos < source.length() - 1 && source[pos] == '/' && source[pos + 1] == '/') {
        while (pos < source.length() && source[pos] != '\n') {
            pos++;
            col++;
        }
    } else if (pos < source.length() - 1 && source[pos] == '/' && source[pos + 1] == '*') {
        pos += 2;
        col += 2;
        while (pos < source.length() - 1) {
            if (source[pos] == '*' && source[pos + 1] == '/') {
                pos += 2;
                col += 2;
                break;
            }
            if (source[pos] == '\n') {
                line++;
                col = 1;
            } else {
                col++;
            }
            pos++;
        }
    }
}

Token Lexer::readNumber() {
    size_t start = pos;
    bool hasDot = false;
    while (pos < source.length() && (std::isdigit(source[pos]) || source[pos] == '.')) {
        if (source[pos] == '.') {
            if (hasDot) break;
            hasDot = true;
        }
        pos++;
        col++;
    }
    return Token(TokenType::NUMBER, source.substr(start, pos - start), line, col);
}

Token Lexer::readString() {
    size_t start = pos + 1;
    pos++;
    col++;
    while (pos < source.length() && source[pos] != '"') {
        if (source[pos] == '\\' && pos + 1 < source.length()) {
            pos += 2;
            col += 2;
        } else {
            pos++;
            col++;
        }
    }
    std::string value = source.substr(start, pos - start);
    pos++;
    col++;
    return Token(TokenType::STRING, value, line, col);
}

Token Lexer::readIdentifier() {
    size_t start = pos;
    while (pos < source.length() && 
           (std::isalnum(source[pos]) || source[pos] == '_')) {
        pos++;
        col++;
    }
    std::string value = source.substr(start, pos - start);
    TokenType type = std::find(keywords.begin(), keywords.end(), value) != keywords.end()
                     ? TokenType::KEYWORD : TokenType::IDENTIFIER;
    return Token(type, value, line, col);
}

Token Lexer::readSymbol() {
    char sym = source[pos];
    pos++;
    col++;
    return Token(TokenType::SYMBOL, std::string(1, sym), line, col);
}

std::vector<Token> Lexer::tokenize() {
    std::vector<Token> tokens;
    while (pos < source.length()) {
        skipWhitespace();
        if (pos >= source.length()) break;

        if (source[pos] == '/' && pos + 1 < source.length() && 
            (source[pos + 1] == '/' || source[pos + 1] == '*')) {
            skipComment();
            continue;
        }

        if (std::isdigit(source[pos])) {
            tokens.push_back(readNumber());
        } else if (source[pos] == '"') {
            tokens.push_back(readString());
        } else if (std::isalpha(source[pos]) || source[pos] == '_') {
            tokens.push_back(readIdentifier());
        } else if (symbols.find(source[pos]) != std::string::npos) {
            tokens.push_back(readSymbol());
        } else {
            pos++;
            col++;
        }
    }
    tokens.push_back(Token(TokenType::EOF_TOKEN, "", line, col));
    return tokens;
}

// Parser implementation
Token Parser::current() {
    if (pos >= tokens.size()) {
        return Token(TokenType::EOF_TOKEN, "");
    }
    return tokens[pos];
}

Token Parser::advance() {
    if (pos < tokens.size()) {
        pos++;
    }
    return current();
}

bool Parser::match(const std::string& value) {
    if (current().type == TokenType::KEYWORD && current().value == value) {
        advance();
        return true;
    }
    return false;
}

bool Parser::check(TokenType type) {
    return current().type == type;
}

std::shared_ptr<ASTNode> Parser::parseForm() {
    Token tok = current();
    advance(); // consume "form"
    
    auto node = std::make_shared<ASTNode>(NodeType::FORM, tok);
    
    if (check(TokenType::IDENTIFIER) || check(TokenType::KEYWORD)) {
        node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
        advance();
    }
    
    if (check(TokenType::IDENTIFIER)) {
        node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
        advance();
    }
    
    if (match("from")) {
        node->children.push_back(parseExpression());
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseAct() {
    Token tok = current();
    advance(); // consume "act"
    
    auto node = std::make_shared<ASTNode>(NodeType::ACT, tok);
    
    if (check(TokenType::IDENTIFIER)) {
        node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
        advance();
    }
    
    // Parse parameters
    while (check(TokenType::IDENTIFIER) && !match("do")) {
        node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
        advance();
    }
    
    if (match("do")) {
        node->children.push_back(parseBlock());
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseCall() {
    Token tok = current();
    advance(); // consume "call"
    
    auto node = std::make_shared<ASTNode>(NodeType::CALL, tok);
    
    if (check(TokenType::IDENTIFIER)) {
        node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
        advance();
    }
    
    // Parse arguments
    while (pos < tokens.size() && current().type != TokenType::EOF_TOKEN && 
           current().value != "end" && current().value != "do" && 
           current().value != "else") {
        if (current().type == TokenType::KEYWORD && 
            (current().value == "put" || current().value == "with" || 
             current().value == "to" || current().value == "on" || 
             current().value == "give")) {
            break;
        }
        node->children.push_back(parseExpression());
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseIf() {
    Token tok = current();
    advance(); // consume "if"
    
    auto node = std::make_shared<ASTNode>(NodeType::IF, tok);
    node->children.push_back(parseExpression());
    
    if (match("do")) {
        node->children.push_back(parseBlock());
    }
    
    if (match("else")) {
        if (match("do")) {
            node->children.push_back(parseBlock());
        }
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseLoop() {
    Token tok = current();
    advance(); // consume "loop"
    
    auto node = std::make_shared<ASTNode>(NodeType::LOOP, tok);
    node->children.push_back(parseExpression());
    
    if (match("do")) {
        node->children.push_back(parseBlock());
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseGive() {
    Token tok = current();
    advance(); // consume "give"
    
    auto node = std::make_shared<ASTNode>(NodeType::GIVE, tok);
    node->children.push_back(parseExpression());
    return node;
}

std::shared_ptr<ASTNode> Parser::parseSay() {
    Token tok = current();
    advance(); // consume "say"
    
    auto node = std::make_shared<ASTNode>(NodeType::SAY, tok);
    node->children.push_back(parseExpression());
    return node;
}

std::shared_ptr<ASTNode> Parser::parsePut() {
    Token tok = current();
    advance(); // consume "put"
    
    auto node = std::make_shared<ASTNode>(NodeType::PUT, tok);
    
    // Parse the value expression
    node->children.push_back(parseExpression());
    
    // Check for "to" keyword followed by variable name
    if (match("to")) {
        if (check(TokenType::IDENTIFIER)) {
            node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
            advance();
        }
    } else if (check(TokenType::IDENTIFIER)) {
        // Alternative: "put value variable" (without "to")
        node->children.push_back(std::make_shared<ASTNode>(NodeType::IDENTIFIER, current()));
        advance();
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseBlock() {
    auto node = std::make_shared<ASTNode>(NodeType::BLOCK, current());
    
    while (pos < tokens.size() && current().type != TokenType::EOF_TOKEN) {
        if (match("end")) {
            break;
        }
        
        if (current().type == TokenType::KEYWORD) {
            if (current().value == "form") {
                node->children.push_back(parseForm());
            } else if (current().value == "act") {
                node->children.push_back(parseAct());
            } else if (current().value == "call") {
                node->children.push_back(parseCall());
            } else if (current().value == "if") {
                node->children.push_back(parseIf());
            } else if (current().value == "loop") {
                node->children.push_back(parseLoop());
            } else if (current().value == "give") {
                node->children.push_back(parseGive());
            } else if (current().value == "say") {
                node->children.push_back(parseSay());
            } else if (current().value == "put") {
                node->children.push_back(parsePut());
            } else {
                advance();
            }
        } else {
            node->children.push_back(parseExpression());
        }
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseExpression() {
    return parseBinaryOp(0);
}

std::shared_ptr<ASTNode> Parser::parseBinaryOp(int precedence) {
    std::map<std::string, int> opPrecedence = {
        {"or", 1},
        {"and", 2},
        {"same", 3}, {"not", 3},
        {"over", 4}, {"under", 4},
        {"plus", 5}, {"minus", 5},
        {"times", 6}, {"div", 6}
    };
    
    auto left = parsePrimary();
    
    while (pos < tokens.size()) {
        if (current().type != TokenType::KEYWORD) break;
        
        std::string op = current().value;
        auto it = opPrecedence.find(op);
        if (it == opPrecedence.end() || it->second < precedence) break;
        
        int opPrec = it->second;
        advance(); // consume operator
        
        auto right = parseBinaryOp(opPrec + 1);
        auto node = std::make_shared<ASTNode>(NodeType::BINARY_OP, Token(TokenType::KEYWORD, op));
        node->value = op;
        node->children.push_back(left);
        node->children.push_back(right);
        left = node;
    }
    
    return left;
}

std::shared_ptr<ASTNode> Parser::parsePrimary() {
    if (check(TokenType::NUMBER)) {
        auto node = std::make_shared<ASTNode>(NodeType::LITERAL, current());
        advance();
        return node;
    }
    
    if (check(TokenType::STRING)) {
        auto node = std::make_shared<ASTNode>(NodeType::LITERAL, current());
        advance();
        return node;
    }
    
    if (check(TokenType::IDENTIFIER)) {
        auto node = std::make_shared<ASTNode>(NodeType::IDENTIFIER, current());
        advance();
        return node;
    }
    
    if (current().type == TokenType::KEYWORD) {
        std::string kw = current().value;
        if (kw == "true" || kw == "false") {
            auto node = std::make_shared<ASTNode>(NodeType::LITERAL, current());
            advance();
            return node;
        }
    }
    
    // Default: return identifier
    auto node = std::make_shared<ASTNode>(NodeType::IDENTIFIER, current());
    advance();
    return node;
}

std::shared_ptr<ASTNode> Parser::parse() {
    auto program = std::make_shared<ASTNode>(NodeType::PROGRAM, current());
    
    while (pos < tokens.size() && current().type != TokenType::EOF_TOKEN) {
        if (current().type == TokenType::KEYWORD) {
            if (current().value == "form") {
                program->children.push_back(parseForm());
            } else if (current().value == "act") {
                program->children.push_back(parseAct());
            } else if (current().value == "call") {
                program->children.push_back(parseCall());
            } else if (current().value == "if") {
                program->children.push_back(parseIf());
            } else if (current().value == "loop") {
                program->children.push_back(parseLoop());
            } else if (current().value == "give") {
                program->children.push_back(parseGive());
            } else if (current().value == "say") {
                program->children.push_back(parseSay());
            } else if (current().value == "put") {
                program->children.push_back(parsePut());
            } else {
                advance();
            }
        } else {
            advance();
        }
    }
    
    return program;
}

// Runtime implementation
void Runtime::pushScope() {
    scopes.push_back({});
}

void Runtime::popScope() {
    if (!scopes.empty()) {
        scopes.pop_back();
    }
}

ValuePtr Runtime::getVariable(const std::string& name) {
    // Check scopes from innermost to outermost
    for (auto it = scopes.rbegin(); it != scopes.rend(); ++it) {
        auto varIt = it->find(name);
        if (varIt != it->end()) {
            return varIt->second;
        }
    }
    // Check global variables
    auto varIt = variables.find(name);
    if (varIt != variables.end()) {
        return varIt->second;
    }
    return std::make_shared<Value>();
}

void Runtime::setVariable(const std::string& name, ValuePtr value) {
    if (!scopes.empty()) {
        scopes.back()[name] = value;
    } else {
        variables[name] = value;
    }
}

Runtime::Runtime() {
    // Register built-in modules
    registerModule("net", std::make_shared<NetModule>());
    registerModule("file", std::make_shared<FileModule>());
    registerModule("vm", std::make_shared<VMModule>());
    registerModule("serve", std::make_shared<ServeModule>());
    registerModule("view", std::make_shared<ViewModule>());
    registerModule("play", std::make_shared<PlayModule>());
}

void Runtime::registerModule(const std::string& name, ModulePtr module) {
    modules[name] = module;
}

ValuePtr Runtime::evaluate(std::shared_ptr<ASTNode> node) {
    if (!node) return std::make_shared<Value>();
    
    switch (node->type) {
        case NodeType::PROGRAM: {
            ValuePtr result;
            for (auto& child : node->children) {
                result = evaluate(child);
            }
            return result;
        }
        
        case NodeType::FORM: {
            if (node->children.size() >= 2) {
                std::string name = node->children[1]->value;
                ValuePtr value;
                if (node->children.size() > 2) {
                    value = evaluate(node->children[2]);
                } else {
                    value = std::make_shared<Value>();
                }
                setVariable(name, value);
                return value;
            }
            break;
        }
        
        case NodeType::ACT: {
            if (!node->children.empty()) {
                std::string name = node->children[0]->value;
                std::vector<std::string> params;
                size_t paramStart = 1;
                size_t bodyIdx = node->children.size() - 1;
                
                for (size_t i = 1; i < node->children.size(); i++) {
                    if (node->children[i]->type == NodeType::BLOCK) {
                        bodyIdx = i;
                        break;
                    }
                    params.push_back(node->children[i]->value);
                }
                
                Function func = [params, bodyIdx, node](const std::vector<ValuePtr>& args, Runtime& rt) {
                    rt.pushScope();
                    for (size_t i = 0; i < params.size() && i < args.size(); i++) {
                        rt.setVariable(params[i], args[i]);
                    }
                    ValuePtr result = rt.evaluate(node->children[bodyIdx]);
                    rt.popScope();
                    return result;
                };
                
                functions[name] = func;
                return std::make_shared<Value>(func);
            }
            break;
        }
        
        case NodeType::CALL: {
            if (!node->children.empty()) {
                std::string name = node->children[0]->value;
                
                // Check if it's a module call (e.g., "call net get")
                if (node->children.size() > 1) {
                    auto moduleIt = modules.find(name);
                    if (moduleIt != modules.end()) {
                        std::string method = node->children[1]->value;
                        std::vector<ValuePtr> args;
                        for (size_t i = 2; i < node->children.size(); i++) {
                            args.push_back(evaluate(node->children[i]));
                        }
                        return moduleIt->second->call(method, args, *this);
                    }
                }
                
                // Regular function call
                auto funcIt = functions.find(name);
                if (funcIt != functions.end()) {
                    std::vector<ValuePtr> args;
                    for (size_t i = 1; i < node->children.size(); i++) {
                        args.push_back(evaluate(node->children[i]));
                    }
                    return funcIt->second(args, *this);
                }
            }
            break;
        }
        
        case NodeType::IF: {
            if (node->children.size() >= 2) {
                ValuePtr condition = evaluate(node->children[0]);
                if (condition->toBool()) {
                    return evaluate(node->children[1]);
                } else if (node->children.size() > 2) {
                    return evaluate(node->children[2]);
                }
            }
            break;
        }
        
        case NodeType::LOOP: {
            if (node->children.size() >= 2) {
                ValuePtr count = evaluate(node->children[0]);
                double iterations = count->toNumber();
                ValuePtr result;
                for (double i = 0; i < iterations; i++) {
                    pushScope();
                    setVariable("step", std::make_shared<Value>(i));
                    result = evaluate(node->children[1]);
                    popScope();
                }
                return result;
            }
            break;
        }
        
        case NodeType::GIVE: {
            if (!node->children.empty()) {
                return evaluate(node->children[0]);
            }
            break;
        }
        
        case NodeType::SAY: {
            if (!node->children.empty()) {
                ValuePtr value = evaluate(node->children[0]);
                print(value->toString());
                return value;
            }
            break;
        }
        
        case NodeType::PUT: {
            if (node->children.size() >= 2) {
                ValuePtr value = evaluate(node->children[0]);
                if (node->children[1]->type == NodeType::IDENTIFIER) {
                    std::string name = node->children[1]->value;
                    setVariable(name, value);
                }
                return value;
            } else if (node->children.size() == 1) {
                // Just "put value" - return the value
                return evaluate(node->children[0]);
            }
            break;
        }
        
        case NodeType::BINARY_OP: {
            if (node->children.size() >= 2) {
                ValuePtr left = evaluate(node->children[0]);
                ValuePtr right = evaluate(node->children[1]);
                
                std::string op = node->value;
                if (op == "plus") {
                    return std::make_shared<Value>(left->toNumber() + right->toNumber());
                } else if (op == "minus") {
                    return std::make_shared<Value>(left->toNumber() - right->toNumber());
                } else if (op == "times") {
                    return std::make_shared<Value>(left->toNumber() * right->toNumber());
                } else if (op == "div") {
                    double r = right->toNumber();
                    if (r == 0.0) return std::make_shared<Value>(0.0);
                    return std::make_shared<Value>(left->toNumber() / r);
                } else if (op == "over") {
                    return std::make_shared<Value>(left->toNumber() > right->toNumber());
                } else if (op == "under") {
                    return std::make_shared<Value>(left->toNumber() < right->toNumber());
                } else if (op == "same") {
                    if (left->type == ValueType::TEXT && right->type == ValueType::TEXT) {
                        return std::make_shared<Value>(left->toString() == right->toString());
                    }
                    return std::make_shared<Value>(std::abs(left->toNumber() - right->toNumber()) < 0.0001);
                } else if (op == "and") {
                    return std::make_shared<Value>(left->toBool() && right->toBool());
                } else if (op == "or") {
                    return std::make_shared<Value>(left->toBool() || right->toBool());
                }
            }
            break;
        }
        
        case NodeType::IDENTIFIER: {
            return getVariable(node->value);
        }
        
        case NodeType::LITERAL: {
            if (node->token.type == TokenType::NUMBER) {
                // Parse numeric literal directly
                try {
                    double num = std::stod(node->value);
                    return std::make_shared<Value>(num);
                } catch (...) {
                    // Fallback to word conversion
                    double num = wordToNumber(node->value);
                    return std::make_shared<Value>(num);
                }
            } else if (node->token.type == TokenType::STRING) {
                return std::make_shared<Value>(node->value);
            } else if (node->value == "true") {
                return std::make_shared<Value>(true);
            } else if (node->value == "false") {
                return std::make_shared<Value>(false);
            } else {
                // Try as number word (e.g., "ten", "five")
                double num = wordToNumber(node->value);
                if (num != 0.0 || node->value == "zero") {
                    return std::make_shared<Value>(num);
                }
                // If not a number word, treat as identifier
                return getVariable(node->value);
            }
        }
        
        case NodeType::BLOCK: {
            pushScope();
            ValuePtr result;
            for (auto& child : node->children) {
                result = evaluate(child);
            }
            popScope();
            return result;
        }
        
        default:
            break;
    }
    
    return std::make_shared<Value>();
}

ValuePtr Runtime::execute(const std::string& source) {
    Lexer lexer(source);
    std::vector<Token> tokens = lexer.tokenize();
    Parser parser(tokens);
    std::shared_ptr<ASTNode> ast = parser.parse();
    return evaluate(ast);
}

void Runtime::print(const std::string& msg) {
    std::cout << msg << std::endl;
}

// NetModule implementation
ValuePtr NetModule::call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) {
    if (method == "get") {
        if (!args.empty()) {
            std::string url = args[0]->toString();
            // In browser, use fetch API via Emscripten
            // In Node/server, use HTTP client
            return std::make_shared<Value>("GET " + url);
        }
    } else if (method == "post") {
        if (args.size() >= 2) {
            std::string url = args[0]->toString();
            std::string data = args[1]->toString();
            return std::make_shared<Value>("POST " + url);
        }
    }
    return std::make_shared<Value>();
}

// FileModule implementation
ValuePtr FileModule::call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) {
    if (method == "read") {
        if (!args.empty()) {
            std::string path = args[0]->toString();
            std::ifstream file(path);
            if (file.is_open()) {
                std::string content((std::istreambuf_iterator<char>(file)),
                                   std::istreambuf_iterator<char>());
                return std::make_shared<Value>(content);
            }
        }
    } else if (method == "write") {
        if (args.size() >= 2) {
            std::string path = args[0]->toString();
            std::string data = args[1]->toString();
            std::ofstream file(path);
            if (file.is_open()) {
                file << data;
                return std::make_shared<Value>(true);
            }
        }
    }
    return std::make_shared<Value>(false);
}

// VMModule implementation
ValuePtr VMModule::call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) {
    if (method == "make") {
        // Create a virtual machine instance
        // This is a placeholder - actual VM implementation would go here
        return std::make_shared<Value>("VM created");
    }
    return std::make_shared<Value>();
}

// ServeModule implementation
ValuePtr ServeModule::call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) {
    if (method == "on" || method == "start") {
        if (!args.empty()) {
            double port = args[0]->toNumber();
            // Server implementation would go here
            // For browser, this would use WebSocket or similar
            return std::make_shared<Value>("Server on port " + std::to_string(static_cast<int>(port)));
        }
    } else if (method == "get" || method == "route") {
        // Define GET route
        if (args.size() >= 2) {
            std::string path = args[0]->toString();
            // Handler would be in args[1]
            return std::make_shared<Value>("Route GET " + path);
        }
    } else if (method == "post") {
        // Define POST route
        if (args.size() >= 2) {
            std::string path = args[0]->toString();
            return std::make_shared<Value>("Route POST " + path);
        }
    } else if (method == "put") {
        // Define PUT route
        if (args.size() >= 2) {
            std::string path = args[0]->toString();
            return std::make_shared<Value>("Route PUT " + path);
        }
    } else if (method == "delete" || method == "del") {
        // Define DELETE route
        if (args.size() >= 2) {
            std::string path = args[0]->toString();
            return std::make_shared<Value>("Route DELETE " + path);
        }
    } else if (method == "static" || method == "files") {
        // Serve static files
        if (!args.empty()) {
            std::string dir = args[0]->toString();
            return std::make_shared<Value>("Serving static files from " + dir);
        }
    } else if (method == "json" || method == "send") {
        // Send JSON response
        if (!args.empty()) {
            return std::make_shared<Value>("JSON response");
        }
    }
    return std::make_shared<Value>();
}

// ViewModule implementation
ValuePtr ViewModule::call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) {
    // UI components with clean syntax
    if (method == "pane" || method == "div" || method == "box") {
        // Container component
        std::map<std::string, ValuePtr> props;
        for (size_t i = 0; i < args.size(); i += 2) {
            if (i + 1 < args.size()) {
                props[args[i]->toString()] = args[i + 1];
            }
        }
        return std::make_shared<Value>(props);
    } else if (method == "button" || method == "btn") {
        // Button component
        std::map<std::string, ValuePtr> props;
        if (!args.empty()) {
            props["text"] = args[0];
        }
        for (size_t i = 1; i < args.size(); i += 2) {
            if (i + 1 < args.size()) {
                props[args[i]->toString()] = args[i + 1];
            }
        }
        return std::make_shared<Value>(props);
    } else if (method == "text" || method == "label") {
        // Text component
        if (!args.empty()) {
            std::map<std::string, ValuePtr> props;
            props["content"] = args[0];
            return std::make_shared<Value>(props);
        }
    } else if (method == "input" || method == "field") {
        // Input field
        std::map<std::string, ValuePtr> props;
        for (size_t i = 0; i < args.size(); i += 2) {
            if (i + 1 < args.size()) {
                props[args[i]->toString()] = args[i + 1];
            }
        }
        return std::make_shared<Value>(props);
    } else if (method == "image" || method == "img") {
        // Image component
        if (!args.empty()) {
            std::map<std::string, ValuePtr> props;
            props["src"] = args[0];
            return std::make_shared<Value>(props);
        }
    } else if (method == "list" || method == "ul") {
        // List component
        std::map<std::string, ValuePtr> props;
        if (!args.empty() && args[0]->type == ValueType::LIST) {
            props["items"] = args[0];
        }
        return std::make_shared<Value>(props);
    } else if (method == "show" || method == "render") {
        // Render component to DOM (browser) or output
        if (!args.empty()) {
            std::string component = args[0]->toString();
            return std::make_shared<Value>("Rendered: " + component);
        }
    } else if (method == "style" || method == "css") {
        // Apply styles
        std::map<std::string, ValuePtr> styles;
        for (size_t i = 0; i < args.size(); i += 2) {
            if (i + 1 < args.size()) {
                styles[args[i]->toString()] = args[i + 1];
            }
        }
        return std::make_shared<Value>(styles);
    }
    return std::make_shared<Value>();
}

// PlayModule implementation
ValuePtr PlayModule::call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) {
    if (method == "game" || method == "sprite" || method == "render") {
        // Game logic implementation
        return std::make_shared<Value>("Play: " + method);
    }
    return std::make_shared<Value>();
}

} // namespace azalea

