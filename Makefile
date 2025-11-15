CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
EMCC = emcc
EMFLAGS = -std=c++17 -O2 -s WASM=1 -s EXPORTED_FUNCTIONS='["_azalea_execute","_azalea_print","_malloc","_free"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString","allocateUTF8"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME="AzaleaModule" --bind

SRCDIR = src
OBJDIR = build
BINDIR = bin
WEBDIR = web

SOURCES = $(wildcard $(SRCDIR)/*.cpp)
OBJECTS = $(SOURCES:$(SRCDIR)/%.cpp=$(OBJDIR)/%.o)

TARGET = $(BINDIR)/azalea
WASM_TARGET = $(WEBDIR)/azalea.js

.PHONY: all clean wasm native examples

all: native wasm

native: $(TARGET)

wasm: $(WASM_TARGET)

$(TARGET): $(OBJECTS) | $(BINDIR)
	$(CXX) $(OBJECTS) -o $@

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp | $(OBJDIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(WASM_TARGET): $(SOURCES) | $(WEBDIR)
	$(EMCC) $(EMFLAGS) $(SOURCES) -o $@

$(OBJDIR):
	mkdir -p $(OBJDIR)

$(BINDIR):
	mkdir -p $(BINDIR)

$(WEBDIR):
	mkdir -p $(WEBDIR)

clean:
	rm -rf $(OBJDIR) $(BINDIR)

examples:
	@echo "Running examples..."
	@if [ -f $(TARGET) ]; then \
		for file in examples/*.az; do \
			echo "Running $$file..."; \
			$(TARGET) $$file; \
		done \
	fi

