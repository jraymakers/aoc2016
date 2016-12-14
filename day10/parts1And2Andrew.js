const fs = require('fs');

const initialCommands = fs.readFileSync(process.argv[2], 'utf8').split('\n');

const bots = {};
const outputs = {};

function runCommand(command) {
  switch (command.type) {
    case 'value':
      return runValueCommand(command);
    case 'bot':
      return runBotCommand(command);
  }
}

function canRunBotCommand(command) {
  let bot = getBot(command.bot);
  return bot.chips.length === 2;
}

const botsThatHaveRunCommands = {};

function runBotCommand(command) {
  if (!canRunBotCommand(command)) return null;

  if (botsThatHaveRunCommands[command.bot]) {
    throw `Bot ${command.bot} has already run a command!`;
  }
  botsThatHaveRunCommands[command.bot] = true;

  let bot = getBot(command.bot);
  let { low, high } = getLowHigh(bot.chips);
  console.log(`Bot ${command.bot} is comparing ${low} and ${high}`);

  let lowDest = { destination: command.lowDestination, chipNum: low };
  let highDest = { destination: command.highDestination, chipNum: high };
  [ lowDest, highDest ].forEach(dest => {
    if (dest.destination.type === 'bot') {
      console.log(`Bot ${command.bot} gives chip ${dest.chipNum} to bot ${dest.destination.num}`);
      giveChip(bot, getBot(dest.destination.num), dest.chipNum);
    } else if (dest.destination.type === 'output') {
      console.log(`Bot ${command.bot} gives chip ${dest.chipNum} to output ${dest.destination.num}`);
      giveChip(bot, getOutput(dest.destination.num), dest.chipNum);
    } else {
    throw `Unknown destination type: ${dest.destination.type}`;
    }
  });

  return true;
}

function getLowHigh(chips) {
  if (chips[0] < chips[1]) {
    return { low: chips[0], high: chips[1] };
  } else {
    return { low: chips[1], high: chips[0] };
  }
}

function getBot(num) {
  if (!bots[num]) {
    bots[num] = { chips: [] };
  }
  return bots[num];
}

function getOutput(num) {
  if (!outputs[num]) {
    outputs[num] = { chips: [] };
  }
  return outputs[num];
}

function giveChip(from, dest, chipNum) {
  if (dest.chips.includes(chipNum)) {
    throw `Destination already has chip ${chipNum}`;
  } else if (dest.chips.length === 2) {
    throw `Destination already has 2 chips: ${dest.chips}`;
  }

  dest.chips.push(chipNum);
  if (from) {
    from.chips = from.chips.filter(c => c !== chipNum);
  }
}

function runValueCommand(command) {
  console.log(`The input gives chip ${command.chipNum} to bot ${command.bot}`);
  giveChip(null, getBot(command.bot), command.chipNum);
  return true;
}

const valueRegex = /value ([0-9]+) goes to bot ([0-9]+)/;
const botRegex = /bot ([0-9]+) gives low to (output|bot) ([0-9]+) and high to (output|bot) ([0-9]+)/;

function parseCommand(command) {
  let valueMatches = command.match(valueRegex);
  if (valueMatches) {
    return {
      type: 'value',
      chipNum: Number(valueMatches[1]),
      bot: valueMatches[2]
    };
  }

  let botMatches = command.match(botRegex);
  if (botMatches) {
    return {
      type: 'bot',
      bot: botMatches[1],
      lowDestination: {
        type: botMatches[2],
        num: botMatches[3]
      },
      highDestination: {
        type: botMatches[4],
        num: botMatches[5]
      }
    };
  }

  throw `Could not parse command: ${command}`;
}

let commands = initialCommands.map(parseCommand);
while (commands.length > 0) {
  let queuedCommands = [];
  for (let command of commands) {
    let result = runCommand(command);
    if (!result) {
      queuedCommands.push(command);
    }
  }
  commands = queuedCommands;
}

console.log('\nDone running commands!');
printEverything();

function printEverything() {
  console.log('Outputs:');
  console.log(outputs);
  console.log();
}
