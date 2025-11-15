#ifndef AZALEA_H
#define AZALEA_H

#include <string>
#include <vector>
#include <map>
#include <memory>
#include <variant>
#include <functional>
#include <sstream>
#include <iostream>
#include <fstream>
#include <regex>
#include <algorithm>
#include <cctype>

namespace azalea {

// Forward declarations
class Value;
class Runtime;
class Module;

// Type definitions
using ValuePtr = std::shared_ptr<Value>;
using ModulePtr = std::shared_ptr<Module>;
using Function = std::function<ValuePtr(const std::vector<ValuePtr>&, Runtime&)>;

// Value types
enum class ValueType {
    NUM, TEXT, BOOL, LIST, MAP, VOID, FUNC
};

// Value class
class Value {
public:
    ValueType type;
    std::variant<double, std::string, bool, std::vector<ValuePtr>, 
                 std::map<std::string, ValuePtr>, Function> data;

    Value() : type(ValueType::VOID) {}
    Value(double n) : type(ValueType::NUM), data(n) {}
    Value(const std::string& s) : type(ValueType::TEXT), data(s) {}
    Value(bool b) : type(ValueType::BOOL), data(b) {}
    Value(const std::vector<ValuePtr>& l) : type(ValueType::LIST), data(l) {}
    Value(const std::map<std::string, ValuePtr>& m) : type(ValueType::MAP), data(m) {}
    Value(Function f) : type(ValueType::FUNC), data(f) {}

    std::string toString() const;
    double toNumber() const;
    bool toBool() const;
};

// Token types
enum class TokenType {
    KEYWORD, IDENTIFIER, NUMBER, STRING, SYMBOL, EOF_TOKEN
};

// Token
struct Token {
    TokenType type;
    std::string value;
    size_t line;
    size_t col;

    Token(TokenType t, const std::string& v, size_t l = 0, size_t c = 0)
        : type(t), value(v), line(l), col(c) {}
};

// AST Node types
enum class NodeType {
    PROGRAM, FORM, ACT, CALL, IF, LOOP, GIVE, SAY, PUT, BINARY_OP, UNARY_OP,
    IDENTIFIER, LITERAL, BLOCK, LIST_LIT, MAP_LIT
};

// AST Node
class ASTNode {
public:
    NodeType type;
    std::string value;
    std::vector<std::shared_ptr<ASTNode>> children;
    Token token;

    ASTNode(NodeType t, const Token& tok) : type(t), token(tok) {}
};

// Lexer
class Lexer {
private:
    std::string source;
    size_t pos;
    size_t line;
    size_t col;

    static const std::vector<std::string> keywords;
    static const std::string symbols;

    void skipWhitespace();
    void skipComment();
    Token readNumber();
    Token readString();
    Token readIdentifier();
    Token readSymbol();

public:
    Lexer(const std::string& src) : source(src), pos(0), line(1), col(1) {}
    std::vector<Token> tokenize();
};

// Parser
class Parser {
private:
    std::vector<Token> tokens;
    size_t pos;

    Token current();
    Token advance();
    bool match(const std::string& value);
    bool check(TokenType type);
    std::shared_ptr<ASTNode> parseForm();
    std::shared_ptr<ASTNode> parseAct();
    std::shared_ptr<ASTNode> parseCall();
    std::shared_ptr<ASTNode> parseIf();
    std::shared_ptr<ASTNode> parseLoop();
    std::shared_ptr<ASTNode> parseGive();
    std::shared_ptr<ASTNode> parseSay();
    std::shared_ptr<ASTNode> parsePut();
    std::shared_ptr<ASTNode> parseExpression();
    std::shared_ptr<ASTNode> parseBinaryOp(int precedence);
    std::shared_ptr<ASTNode> parsePrimary();
    std::shared_ptr<ASTNode> parseBlock();

public:
    Parser(const std::vector<Token>& toks) : tokens(toks), pos(0) {}
    std::shared_ptr<ASTNode> parse();
};

// Module interface
class Module {
public:
    virtual ~Module() = default;
    virtual ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) = 0;
    virtual std::string getName() const = 0;
};

// Runtime
class Runtime {
private:
    std::map<std::string, ValuePtr> variables;
    std::map<std::string, Function> functions;
    std::map<std::string, ModulePtr> modules;
    std::vector<std::map<std::string, ValuePtr>> scopes;

    void pushScope();
    void popScope();
    ValuePtr getVariable(const std::string& name);
    void setVariable(const std::string& name, ValuePtr value);

public:
    Runtime();
    void registerModule(const std::string& name, ModulePtr module);
    ValuePtr evaluate(std::shared_ptr<ASTNode> node);
    ValuePtr execute(const std::string& source);
    void print(const std::string& msg);
};

// Built-in modules
class NetModule : public Module {
public:
    std::string getName() const override { return "net"; }
    ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) override;
};

class FileModule : public Module {
public:
    std::string getName() const override { return "file"; }
    ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) override;
};

class VMModule : public Module {
public:
    std::string getName() const override { return "vm"; }
    ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) override;
};

class ServeModule : public Module {
public:
    std::string getName() const override { return "serve"; }
    ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) override;
};

class ViewModule : public Module {
public:
    std::string getName() const override { return "view"; }
    ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) override;
};

class PlayModule : public Module {
public:
    std::string getName() const override { return "play"; }
    ValuePtr call(const std::string& method, const std::vector<ValuePtr>& args, Runtime& runtime) override;
};

// Number word conversion
double wordToNumber(const std::string& word);
std::string numberToWord(double num);

} // namespace azalea

#endif // AZALEA_H

