const fs = require('fs');
const { parse } = require('csv-parse');

// Read CSV file
function readPlayers(filePath) {
  return new Promise((resolve, reject) => {
    const players = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        players.push({
          ID: parseInt(row.ID),
          Name: row.Name,
          Class: row.Class,
          Skill: parseInt(row.Skill),
          Shirt: row.Shirt,
          CheckIn: parseInt(row.CheckIn)
        });
      })
      .on('end', () => resolve(players))
      .on('error', (err) => reject(err));
  });
}

// Team allocation algorithm
function allocateTeams(players) {
  // Filter checked-in players
  const checkedIn = players.filter(p => p.CheckIn === 1);
  if (checkedIn.length < 12) { // Minimum 6 per team
    throw new Error('Not enough players (minimum 12 for One Game).');
  }

  let blackTeam = [];
  let whiteTeam = [];

  // Step 1: Assign single-shirt players
  const blackOnly = checkedIn.filter(p => p.Shirt === 'Black');
  const whiteOnly = checkedIn.filter(p => p.Shirt === 'White');
  blackTeam.push(...blackOnly);
  whiteTeam.push(...whiteOnly);

  // Step 2: Get players with both shirts
  const bothShirts = checkedIn.filter(p => p.Shirt === 'Both');

  // Step 3: Sort by class and skill (Pro > Experienced > Novice, then skill descending)
  const classOrder = { Pro: 3, Experienced: 2, Novice: 1 };
  bothShirts.sort((a, b) => {
    if (classOrder[a.Class] !== classOrder[b.Class]) {
      return classOrder[b.Class] - classOrder[a.Class];
    }
    return b.Skill - a.Skill;
  });

  // Step 4: Alternate assignments to balance teams
  for (let i = 0; i < bothShirts.length; i++) {
    const player = bothShirts[i];
    const blackSkill = blackTeam.reduce((sum, p) => sum + p.Skill, 0);
    const whiteSkill = whiteTeam.reduce((sum, p) => sum + p.Skill, 0);

    if (blackTeam.length <= whiteTeam.length && blackSkill <= whiteSkill) {
      blackTeam.push(player);
    } else {
      whiteTeam.push(player);
    }
  }

  // Step 5: Validate team sizes
  if (blackTeam.length < 6 || whiteTeam.length < 6) {
    throw new Error('Teams too small (minimum 6 players each).');
  }

  return { blackTeam, whiteTeam };
}

// Utility to summarize team stats
function getTeamStats(team) {
  const totalSkill = team.reduce((sum, p) => sum + p.Skill, 0);
  const classCount = team.reduce((acc, p) => {
    acc[p.Class] = (acc[p.Class] || 0) + 1;
    return acc;
  }, {});
  return { size: team.length, totalSkill, classCount };
}

// Main function to run test
async function runTest() {
  try {
    const players = await readPlayers('players.csv');
    const { blackTeam, whiteTeam } = allocateTeams(players);

    console.log('Black Team:');
    console.log(blackTeam.map(p => `${p.Name} (${p.Class}, Skill: ${p.Skill}, Shirt: ${p.Shirt})`));
    console.log('Stats:', getTeamStats(blackTeam));

    console.log('\nWhite Team:');
    console.log(whiteTeam.map(p => `${p.Name} (${p.Class}, Skill: ${p.Skill}, Shirt: ${p.Shirt})`));
    console.log('Stats:', getTeamStats(whiteTeam));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTest();