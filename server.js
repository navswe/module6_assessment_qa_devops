const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());

// add port 8000
const PORT = 8000;

// middleware to serve the files from the public folder (these will be static files)
app.use(express.static(`${__dirname}/public`));

//ROLL BAR
// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "ae00212049b544989c007bf3b49be118",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(bots); //this used to be send(botsArr) which is an error, I changed it to make the "See All Bots" feature work
    rollbar.info("user shuffling bots");
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
    rollbar.error("See All Bots feature is not working");
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
    rollbar.info("a user shuffled the bots");
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
    rollbar.error("Shuffled Bots Error: feature not working");
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
      rollbar.info('user played & received "you lost!" message');
    } else {
      playerRecord.wins += 1; //this was playerRecord.losses +=1 which is an error, I fixed it and now it works correctly
      res.status(200).send("You won!");
      rollbar.info('user played & received "you won!" message');
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
    rollbar.critical("Duel Duo app is not working");
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
    rollbar.info("user get player record");
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
    rollbar.error("error in getting player record");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
