//namespace
import View from "./view.js";
import Store from "./store.js";

/**const App = {
  $: {
    menu: document.querySelector('[data-id = "menu"]'),
    menuItems: document.querySelector('[data-id = "menuItems"]'),
    resetBtn: document.querySelector('[data-id = "resetBtn"]'),
    newroundBtn: document.querySelector('[data-id = "newroundBtn"]'),
    squares: document.querySelectorAll('[data-id = "square"]'),
    modal: document.querySelector('[data-id = "modal"]'),
    modalText: document.querySelector('[data-id = "modal-text"]'),
    modalBtn: document.querySelector('[data-id = "modal-btn"]'),
    turn: document.querySelector('[data-id = "turn white"]'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const P1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => move.squareId);
    const P2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => move.squareId);

    console.log(P1Moves);
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const P1wins = pattern.every((v) => P1Moves.includes(v));
      const P2wins = pattern.every((v) => P2Moves.includes(v));

      console.log(P1wins);

      if (P1wins === true) winner = 1;
      if (P2wins === true) winner = 2;
    });
    return {
      status: winner != null || moves.length === 9 ? "complete" : "incomplete",
      winner,
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset");
    });
    App.$.newroundBtn.addEventListener("click", (event) => {
      console.log("New");
    });

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }
        const latestmove = App.state.moves[App.state.moves.length - 1];
        const Oppplayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0 ? 1 : Oppplayer(latestmove.playerId);
        const nextPlayer = Oppplayer(currentPlayer);
        //<i class="fa-solid fa-x black"></i>
        //<i class="fa-solid fa-o turqoise"></i>
        const icon = document.createElement("i");

        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x");
        } else {
          icon.classList.add("fa-solid", "fa-o");
        }

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });
        console.log(App.state);
        square.replaceChildren(icon);

        const game = App.getGameStatus(App.state.moves);
        let text = "";

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");
          if (game.winner) {
            text = "Player " + game.winner + " wins";
          } else {
            text = "It's a Tie!";
          }
          App.$.modalText.textContent = text;
        }
      });
    });
  },
};
/*/
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "white",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "white",
  },
];

//window.addEventListener("load", App.init);

function init() {
  const view = new View();
  const store = new Store("live-storage-key", players);
  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });
  /**function initview() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(players[0]);
    view.updateScoreboard(
      store.stats.playerwithstats[0].wins,
      store.stats.playerwithstats[1].wins,
      store.stats.ties
    );

    view.initializeMoves(store.game.moves);
  }*/

  //cant remove render since its state change for a different tab
  window.addEventListener("storage", () => {
    view.render(store.game, store.stats);
  });
  // the first load
  view.render(store.game, store.stats);
  view.GameResetEvent((event) => {
    store.reset();
  });
  view.render(store.game, store.stats);
  view.NewRoundEvent((event) => {
    store.newRound();
  });
  // checking state and updating it
  view.PlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }
    store.PlayerMove(+square.id);

    //view.HandlePlayerMove(square, store.game.currentPlayer);
    //going to next state

    /**if (store.game.status.iscomplete) {
      view.OpenModal(
        store.game.status.winner
          ? store.game.status.winner.name + " Wins!"
          : "Tie"
      );
      return;
    }
    //
    view.setTurnIndicator(store.game.currentPlayer);
  });*/
  });
}
window.addEventListener("load", init);
