const { generate, build, serve } = require('./actions');

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Pass a command. Eg: budugu generate');
    return;
  } else if (args.length > 1) {
    console.error('budugu accepts only one command. Eg: generate, build, serve');
    return;
  }

  switch (args[0]) {
    case 'generate':
      generate();
      break;
    case 'build':
      build();
      break;
    case 'serve':
      serve();
      break;
    default:
      console.error('budugu accepts only one command. Eg: generate, build, serve');
      break;
  }
}

main();
