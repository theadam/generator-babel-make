STANDALONE_BROWSERIFY_ARGS =

all: test browser

publish: compile test
	npm publish

clean: clean-lib clean-tests clean-coverage clean-browser

.PHONY: all clean publish

# include targets from babel-make
include scripts/babel-make.mk
