'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // Selecting elements
  const arrow0 = document.querySelector('#arrow-0');
  const arrow1 = document.querySelector('#arrow-1');
  const totalScore0 = document.getElementById('total-0');
  const totalScore1 = document.getElementById('total-1');
  const currentScore0 = document.getElementById('current-0');
  const currentScore1 = document.querySelector('#current-1');
  const btnRoll = document.querySelector('.btn-roll');
  const btnEnd = document.querySelector('.btn-end-turn');
  const btnReset = document.querySelector('.btn-reset');
  const gameResult = document.querySelector('#game-result');
  const diceImages = document.querySelector('.dices-images');

  // Declare variables
  let activePlayer;
  let dices;
  let roundScores;
  let roundStatus;
  let roundEnd;
  let roundWinner;
  let totalScores;
  let gameRounds;

  const init = function () {
    // Set starting conditions
    totalScore0.textContent = 0;
    totalScore1.textContent = 0;
    currentScore0.textContent = 0;
    currentScore1.textContent = 0;

    activePlayer = 0;
    dices = [];
    roundScores = [0, 0];
    roundStatus = ['start', 'start'];
    roundEnd = false;
    roundWinner;
    totalScores = [0, 0];
    gameRounds = 1;

    // Hide the dice images
    diceImages.style.visibility = 'hidden';

    // Hide the arrow for player 2
    arrow1.classList.add('hidden');

    // Display the arrow for player 1
    arrow0.classList.remove('hidden');

    // Display as round 1
    gameResult.textContent = 'ROUND 1';

    // Change back the current score color to white
    document.querySelector('#current-0').style.color = 'white';
    document.querySelector('#current-1').style.color = 'white';
  };

  init();

  const switchPlayer = function () {
    // Switch the active player
    activePlayer = activePlayer === 0 ? 1 : 0;

    // Switch the arrow
    arrow0.classList.toggle('hidden');
    arrow1.classList.toggle('hidden');
  };

  const resetRound = function () {
    // Reset starting conditions
    currentScore0.textContent = 0;
    currentScore1.textContent = 0;
    dices = [];
    roundScores = [0, 0];
    roundStatus = ['start', 'start'];
    roundEnd = false;
    document.querySelector('#current-0').style.color = 'white';
    document.querySelector('#current-1').style.color = 'white';
  };

  const checkGameEnd = function () {
    if (gameRounds === 3) {
      // Check who is the winner for the 3 rounds
      if (totalScores[0] > totalScores[1]) {
        gameResult.textContent = '🏆Player 1 wins the game!';
      } else if (totalScores[0] < totalScores[1]) {
        gameResult.textContent = '🏆Player 2 wins the game!';
      } else {
        gameResult.textContent = 'It is a draw!';
      }
    } else {
      // Reset the round
      resetRound();

      //  Update the number of rounds of the game
      gameRounds += 1;
    }
  };

  const checkWinner = function (winner) {
    diceImages.style.display = 'none';

    // If it is a draw
    if (winner === 2) {
      gameResult.textContent = 'It is a draw!';
      checkGameEnd();
    } else {
      // Update the total scores, display the total score
      totalScores[winner] = totalScores[winner] + 1;
      document.querySelector(`#total-${winner}`).textContent =
        totalScores[winner];
      // Display the winner for the round
      gameResult.textContent = `Player ${winner + 1} wins this round!`;
      checkGameEnd();
    }
  };

  const checkRoundEnd = function () {
    // If both players turns have ended
    if (roundStatus[0] === 'end' && roundStatus[1] === 'end') {
      roundEnd = true;

      // Check who is the winner

      // If player 1 score is less than or equal to 20 and player 2 score is more than 20
      if (roundScores[0] <= 20 && roundScores[1] > 20) {
        roundWinner = 0;
        checkWinner(roundWinner);
      }

      // If player 1 score is more than 20 and player 2 score is less than or equal to 20
      else if (roundScores[0] > 20 && roundScores[1] <= 20) {
        roundWinner = 1;
        checkWinner(roundWinner);
      }

      // If player 1 and 2 score both exceed 20
      else if (roundScores[0] > 20 && roundScores[1] > 20) {
        roundWinner = 2;
        checkWinner(roundWinner);

        // If player 1 and 2 scores are below or equal to 20 and player 1 score is higher
      } else if (roundScores[0] > roundScores[1]) {
        roundWinner = 0;
        checkWinner(roundWinner);
        // If player 1 and 2 scores are below or equal to 20 and player 2 score is higher
      } else if (roundScores[1] > roundScores[0]) {
        roundWinner = 1;
        checkWinner(roundWinner);

        // If player 1 and 2 scores are below or equal to 20 and they have the same score
      } else if (roundScores[0] === roundScores[1]) {
        roundWinner = 2;
        checkWinner(roundWinner);
      }
    }
  };

  // Roll the dice
  btnRoll.addEventListener('click', function () {
    if (roundEnd === false) {
      // Display the current round
      gameResult.textContent = `ROUND ${gameRounds}`;

      // Loop through 2 dices and display the dice images
      for (let i = 0; i < 2; i++) {
        let dice = Math.trunc(Math.random() * 6) + 1;
        dices.push(dice);
        roundScores[activePlayer] = roundScores[activePlayer] + dice;

        // Display the images of the dices
        diceImages.style.visibility = 'visible';
        let image = document.querySelector(`#img-${i}`);
        image.src = `dice-${dice}.png`;
      }

      // Display the current score of the active player
      document.querySelector(`#current-${activePlayer}`).textContent =
        roundScores[activePlayer];

      // Check whether the score is more than 20
      if (roundScores[activePlayer] > 20) {
        document.querySelector(`#current-${activePlayer}`).style.color = 'red';

        // Update the status of the active player
        roundStatus[activePlayer] = 'end';

        // Check if the round has ended
        checkRoundEnd();

        // Switch player if the round continues
        if (roundEnd === false) {
          switchPlayer();
        }
      }
    }
  });

  // End the turn
  btnEnd.addEventListener('click', function () {
    // Display the current round
    gameResult.textContent = `ROUND ${gameRounds}`;

    if (roundEnd === false) {
      // Update the status of the active player
      roundStatus[activePlayer] = 'end';

      // Check if the round has ended
      checkRoundEnd();

      // Switch player if the round continues
      if (roundEnd === false) {
        switchPlayer();
      }
    }
  });

  // Reset the game
  btnReset.addEventListener('click', init);
});
