#include "azalea.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <cstdlib>
#endif

using namespace azalea;

#ifdef __EMSCRIPTEN__

// Global runtime instance
static Runtime* g_runtime = nullptr;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    char* azalea_execute(const char* source) {
        if (!g_runtime) {
            g_runtime = new Runtime();
        }
        
        try {
            ValuePtr value = g_runtime->execute(source);
            std::string result = value->toString();
            
            // Allocate memory for the result string
            char* output = (char*)malloc(result.length() + 1);
            strcpy(output, result.c_str());
            return output;
        } catch (const std::exception& e) {
            std::string error = std::string("Error: ") + e.what();
            char* output = (char*)malloc(error.length() + 1);
            strcpy(output, error.c_str());
            return output;
        }
    }
    
    EMSCRIPTEN_KEEPALIVE
    void azalea_print(const char* msg) {
        // In browser, we'll capture this via Module.print
        printf("%s\n", msg);
    }
}
#endif
#else
// Native CLI
int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "Azalea Interpreter v1.0" << std::endl;
        std::cout << "Usage: azalea <file.az>" << std::endl;
        std::cout << "   or: azalea -e \"code\"" << std::endl;
        return 1;
    }
    
    Runtime runtime;
    std::string source;
    
    if (std::string(argv[1]) == "-e" && argc > 2) {
        source = argv[2];
    } else {
        std::ifstream file(argv[1]);
        if (!file.is_open()) {
            std::cerr << "Error: Cannot open file " << argv[1] << std::endl;
            return 1;
        }
        std::stringstream buffer;
        buffer << file.rdbuf();
        source = buffer.str();
    }
    
    try {
        ValuePtr result = runtime.execute(source);
        if (result->type != ValueType::VOID) {
            std::cout << result->toString() << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
#endif

