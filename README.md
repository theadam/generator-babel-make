#Description
A yeoman generator to get a node/browser js project started.  Utilizes make as a task runner, babel as a transpiler, browserify and uglify to bundle and minify, mocha to test, and istanbul to calculate code coverage

This template is configured to find tests in directories named ```__tests__``` nested inside the src directory.  Tests can also be written in es6, and coverage reports will reflect the original es6 code.

#Builtin make targets

The default make target will run tests, then build browserified bundles in ```dist```

The other useful targets are seperated into categories.

##For Building
- **compile**: Use babel to compile all sources from src -> lib
- **browser**: Produce browser-ready libraries in the dist folder (including a minified file)
 - if you have dependencies you do not want to include in your bundle, use exposify (or similar) and add a -t flag to the STANDALONE_BROWSERIFY_ARGS variable in the Makefile

##For testing
- **test**: Use mocha to test
- **coverage**: Use istanbul to calculate test coverage and open in your default browser

##For cleaning
- **clean-lib**: removes the ```lib``` directory
- **clean-tests**: removes each ```__tests__compiled__``` directory
- **clean-dist**: removes the ```dist``` directory
- **clean-coverage**: removes the ```coverage``` directory
- **clean**: removes all of the above

#Reserved Directories
The make built targets utilize the directories: ```lib```, ```dist```, and ```coverage``` at the top level.  Also during the coverage step, tests are compiled into ```__tests__compiled__``` directories.  
