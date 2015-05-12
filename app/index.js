var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var kebabcase = require('lodash.kebabcase');
var trim = require('lodash.trim');

var Promise = require('bluebird');

var exec = Promise.promisify(require('child_process').exec);
var gitConfig = Promise.promisify(require('git-config'));
var fs = require('fs');
var path = require('path');


var devDependencies = [
  'babel',
  'babel-eslint',
  'babel-istanbul',
  'browserify',
  'eslint',
  'expect.js',
  'exposify',
  'mocha',
  'open',
  'uglify-js'
];

module.exports = generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('babel-make') + ' generator!'
    ));

    Promise.all([gitConfig(), exec('npm whoami').catch(function(e) {
      console.error('Error getting npm user name: run `npm login`');
      console.error(e);
    })])
    .then(function(args) {
      this.config = args[0];
      this.username = trim(args[1][0]);
      this._showPrompts(done); // eslint-disable-line
    }.bind(this));
  },

  _showPrompts: function(done) {
    var prompts = [{
      type: 'input',
      name: 'user',
      message: 'What is your github username/organization?',
      default: this.username
    }, {
      type: 'input',
      name: 'name',
      message: 'What is your project\'s name?',
      default: kebabcase(this.appname)
    }, {
      type: 'input',
      name: 'description',
      message: 'What is a description of this project? (eg. A nice module.)'
    }, {
      type: 'input',
      name: 'author',
      message: 'Who is the author of this project?',
      default: this.config.user.name + ' <' + this.config.user.email + '>'
    }, {
      type: 'input',
      name: 'tags',
      message: 'Are there any tags for your package (e.g. cure for world hunger, million dollar idea)'
    }];

    this.prompt(prompts, function(props) {
      this.user = props.user;
      this.name = props.name;
      this.description = props.description;
      this.author = props.author;
      this.tags = JSON.stringify(props.tags ? props.tags.split(',').map(trim) : []);
      done();
    }.bind(this));
  },

  configuring: function(){
    this.log(chalk.green('Initializing git'));
    var done = this.async;
    var user = this.user;
    var name = this.name;
    exec('git init').then(function(){
      return exec('git remote add origin https://github.com/' + user + '/' + name + '.git');
    }).then(done);
  },

  writing: {
    app: function() {
      this._copyDir(''); //eslint-disable-line
    }
  },

  _copyDir: function(dir){
    var root = path.join(this.sourceRoot(), dir);
    fs.readdirSync(root).forEach(function(p) {
      if (fs.lstatSync(path.join(root, p)).isFile()){
        var to = p;
        if(p[0] === '_'){
          to = p.replace(/^_/, '');
        }
        this.fs.copyTpl(
          this.templatePath(path.join(dir, p)),
          this.destinationPath(path.join(dir, to)),
          this
        );
      }
      else{
        this._copyDir(path.join(dir, p)); // eslint-disable-line
      }
    }, this);
  },

  install: function(){
    this.log(chalk.green('Installing devDependencies.  Might take a few minutes...'));
    this.npmInstall(devDependencies, {saveDev: true});
  }
});
