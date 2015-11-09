#! /usr/bin/env node

var pkg = require('../package.json')
var example = require('../')
var binname = Object.keys(pkg.bin)[0]
var argv = require('minimist')(process.argv.slice(2))
var surge = require('surge')({
  name: pkg.name
})

// This is where we’ll insert our own actions around Surge’s
var hooks = {}

// Add a version command
if (argv.version || argv.V) {
  console.log(pkg.version)
}

// Let’s add a basic Surge command, first: login.

// Establish the name of the Minimist command.
// This can be whatever you want. Now when you run
// `example login` you will get a similar experience to
// running `surge login`.
if (argv._[0] === 'login') {
  // Map the command it to the `surge.login()` action
  // pass in the `hooks`, and pass any additonal
  // commands and options onto Surge with the first
  // command (in this case, `login`) removed
  return surge.login(hooks)(argv._.slice(1))
}

// Now, let’s add a hook. There are a variety of pre- and
// post- action hooks available via the Surge module,
// documented in the README.

// This `preAuth` hook runs each time before checking
// someone is logged in.
hooks.preAuth = function (req, next) {

  // If you want to see all the data available to you,
  // you could log the entire `req` object.
  console.log('')
  if (req.authed) {
    // Here, if the user is already authenticated, we’re saying hello.
    console.log('       Hello ' + req.creds.email + '!')
  } else {
    // If you’re not logged in yet, hi!
    console.log('       Welcome!')
  }
  console.log('')

  // Call next() to continue to the next step.
  next()
}

// Here, we can add a `postProject` hook to run before
// after the project directory has been determined, but
// before it has been publish. This is incredibly useful if
// you are making any kind of build tool or static site generator:
// your library can compile any files here before moving onto the
// next step.
hooks.postProject = function (req, next) {
  example('The project is at ' + req.project + ' Your CLI could do something with it here.')
  next()
}

// Let’s also add a `postPublish` hook to run
// after the publishing step is successful.
hooks.postPublish = function (req, next) {
  example('Nice, it worked! 🚀  Published to ' + req.domain)
  next()
}

// Now, we can add the `example publish` command, which will use Surge to
// publish the project to the web.
if (argv._[0] === 'publish') {
  return surge.publish(hooks)(argv._.slice(1))
}

// Now that our core functionality has been added, let’s
// add the remainder of the Surge commands so that people
// can use our example CLI successfully. Remember, these
// commands can be named whatever you want or used within
// other commands, depending on what your specific tool does.
if (argv._[0] === 'whoami') {
  return surge.whoami(hooks)(argv._.slice(1))
}

if (argv._[0] === 'list') {
  return surge.list(hooks)(argv._.slice(1))
}

if (argv._[0] === 'teardown') {
  return surge.teardown(hooks)(argv._.slice(1))
}

if (argv._[0] === 'plus') {
  return surge.plus(hooks)(argv._.slice(1))
}

if (argv._[0] === 'logout') {
  return surge.logout(hooks)(argv._.slice(1))
}

if (argv.help || argv.h) {
  console.log('   ' + 'Help with ' + pkg.name)
  console.log()
  console.log('   ' + binname + ' login', '    Login to your account')
  console.log('   ' + binname + ' publish', '  Publishes a project to the web using Surge.')
  console.log('   ' + binname + ' whoami', '   Check who you are logged in as.')
  console.log('   ' + binname + ' list', '     List all the projects you’ve published.')
  console.log('   ' + binname + ' teardown', ' Remove a live project.')
  console.log('   ' + binname + ' plus', '     Upgrade a project to Surge Plus')
  console.log('   ' + binname + ' logout', '   Log out of your account.')
  console.log()
}
