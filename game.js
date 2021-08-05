let playerOneTurn = true;
let gameHeading = $(".turn-indicator");

const players = {
    ONE: "x",
    TWO: "o"
}

let board = [
  [],
  [],
  []
];

// START BUTTON EVENT LISTENER
$(".start-btn").click(function() {

  $(this).off("click");
  $(this).removeClass("hover");
  setTimeout(function() {
    openingTheme();

    setTimeout(function() {
      $(".start-btn").css("cursor", "default");
      fadeOut(".start-header", 500);
      fadeOut(".subtitle", 800);
      fadeOut(".start-btn", 1000);

      setTimeout(function() {
        $(".hide-at-start").hide();
        $(".hidden").toggleClass("hidden");
        $(".board, .game-heading").css("opacity", "0");
        $(".board, .game-heading").css("scale", "0.3");

        setTimeout(function() {
          $(".board, .game-heading").transition({opacity: 100, scale: 1}, startGame());
          playWhoosh()
        }, 1100);
      }, 1000);
    }, 100);
  }, 150);
});


/*

GAME FUNCTIONS

*/

function startGame() {
  board = [[],[],[]];
  playerOneTurn = true;
  setGameHeading();
  cellClickListener();
}

function updateBoard(classes) {
  let cell = classes.substr(0, classes.indexOf(" "));
  let player = playerOneTurn ? players.ONE : players.TWO;

  switch(cell) {
    case "one":
      board[0][0] = player;
      break;
    case "two":
      board[0][1] = player;
      break;
    case "three":
      board[0][2] = player;
      break;
    case "four":
      board[1][0] = player;
      break;
    case "five":
      board[1][1] = player;
      break;
    case "six":
      board[1][2] = player;
      break;
    case "seven":
      board[2][0] = player;
      break;
    case "eight":
      board[2][1] = player;
      break;
    case "nine":
      board[2][2] = player;
      break;
    default:
      console.error("Error at switch statement. Cell = " + cell);
      break;
  }
}

function checkGameStatus() {

  let win = checkWin();

  if (win !== false) {
    let winner = (win === "x") ? 1 : 2;
    onWin(winner);
    setTimeout(restartEvent, 1100);
  } else if (isBoardFull()) {
    onTie();
    setTimeout(restartEvent, 1100);
  }
}

function isBoardFull() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] == null) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {


  // Check rows
  for (let row = 0; row < 3; row++) {
    let rowString = "";
    for (let col = 0; col < 3; col++) {
      rowString += board[row][col];
    }

    if (rowString === "xxx") {
      return players.ONE;
    } else if (rowString === "ooo") {
      return players.TWO;
    }
  }


  // Check columns
  for (let col = 0; col < 3; col++) {
    let columnString = "";

    for (let row = 0; row < 3; row++) {
      columnString += board[row][col];
    }

    if (columnString === "xxx") {
      return players.ONE;
    } else if (columnString === "ooo") {
      return players.TWO;
    }
  }




  // Check diagonals

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {

    if (board[0][0] === "x") {
      return players.ONE;
    } else if (board[0][0] === "o") {
      return players.TWO;
    }

  } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {

    if (board[0][2] === "x") {
      return players.ONE;
    } else if (board[0][2] === "o") {
      return players.TWO;
    }
  }

  return false;
}





/*

EVENT LISTENER FUNCTIONS

*/


// When a cell is clicked
function cellClickListener() {
  $("td").click(function() {

    updateBoard($(this).attr("class"));
    setCellImage($(this));
    placeAudio();

    playerOneTurn = !playerOneTurn;
    setGameHeading();

    $(this).off('click');

    checkGameStatus();
  });
}

function disableCellEventListeners() {
  $("td").off('click');
}



/*

ON EVENT FUNCTIONS

*/

function onWin(winner) {
  gameHeading.text(`Player ${winner} has won.`);
  disableCellEventListeners();
  setTimeout(function() {
    playWinAudio();
    gameSubtitle(true)
  }, 100);
}

function onTie() {
  gameHeading.text("The game was a tie.");
  disableCellEventListeners();
  setTimeout(function() {
    playTieAudio();
    gameSubtitle(true);
  }, 100);
}






/*

RESTART FUNCTIONS

*/

function restartEvent() {
  $(document).on('click', function() {
    $(this).off('click');

    restartAnimation();
  })
}

function restartAnimation() {
  setTimeout(function() {
    openingTheme();

    setTimeout(function() {

      $(".turn-indicator").transit({opacity: 0}, 500);
      $(".game-subtitle").transit({opacity: 0}, 800, function() {
        $(this).css("visibility", "hidden");
      })
      $(".board").transit({opacity: 0}, 1000, function() {
        resetCells();
        gameSubtitle(false);
      });

      setTimeout(function() {
        $(".turn-indicator").css("scale", "0.3").transit({opacity: 1, scale: 1});
        $(".board").css("scale", "0.3").transit({opacity: 1, scale: 1});
        $(".game-subtitle").css("visibility", "visible");
        playWhoosh();
        startGame();
      }, 2500);
    }, 100);
  }, 500);
}

function resetCells() {
  $("td").html("");
}











/*

SET FUNCTIONS

*/

function setGameHeading() {
  if (playerOneTurn) {
    gameHeading.text("Player 1's Turn.");
  } else {
    gameHeading.text("Player 2's Turn.");
  }
}

function setCellImage(cell) {
  if (playerOneTurn) {
    cell.html(`<img src='images/x.png' draggable='false'>`)
  } else {
    cell.html(`<img src='images/o.png' draggable='false'>`)
  }

  cellImgAnimation(cell);
}





/*

ANIMATION FUNCTIONS

*/

function fadeOut(selector, duration) {
  $(`${selector}`).animate({
    opacity: 0
  }, {
    duration: duration,
    queue: false
  });
}

function gameSubtitle(turnOn) { // refactor
  if (turnOn) {
    $(".game-subtitle").css("display", "block");
    $(".game-subtitle").transition({opacity: 1.0, y: '30px'});
  } else {
    $(".game-subtitle").css("display", "none");
  }
}

function cellImgAnimation(cell) {
  let image = cell.children("img");
  image.css("scale", "0.5");
  image.transition({scale: 1.0}, 150);

}



/*

SFX/AUDIO FUNCTIONS

*/

function openingTheme() {
  let audio = new Audio(`sounds/game_start.wav`);
  audio.play();
}

function playWhoosh() {
  let audio = new Audio('sounds/whoosh.mp3');
  audio.play();
}

function placeAudio() {
  let audio;

  if (playerOneTurn) {
    audio = new Audio(`sounds/place.wav`);
  } else {
    audio = new Audio(`sounds/place_deep.wav`);
  }
  audio.volume = 0.4;
  audio.play();
}

function playTieAudio() {
  let audio = new Audio('sounds/error.wav');
  audio.play();
}

function playWinAudio() {
  let audio = new Audio('sounds/win.wav');
  audio.play();
}
