const initialValue = {
  moves: [],
  history: {
    currentRound: [],
    Allround: [],
  },
};

export default class Store extends EventTarget {
  constructor(key, players) {
    super();
    this.storageKey = key;
    this.players = players;
  }

  get stats() {
    const state = this.#getState();
    return {
      playerwithstats: this.players.map((player) => {
        const wins = state.history.currentRound.filter(
          (game) => game.status.winner?.id === player.id
        ).length;

        return {
          ...player,
          wins,
        };
      }),
      ties: state.history.currentRound.filter(
        (game) => game.status.winner === null
      ),
    };
  }

  get game() {
    const state = this.#getState();
    const currentPlayer = this.players[state.moves.length % 2];

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
    for (const player of this.players) {
      const playermoves = state.moves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const pattern of winningPatterns) {
        if (pattern.every((v) => playermoves.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      currentPlayer,
      moves: state.moves,
      status: {
        iscomplete: winner != null || state.moves.length === 9,
        winner,
      },
    };
  }

  PlayerMove(squareId) {
    const stateClone = structuredClone(this.#getState());

    stateClone.moves.push({
      squareId,
      player: this.game.currentPlayer,
    });
    this.#saveState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getState());
    //destructuring
    const { status, moves } = this.game;

    if (status.iscomplete) {
      stateClone.history.currentRound.push({
        moves,
        status,
      });
    }
    stateClone.moves = [];
    this.#saveState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getState());
    stateClone.history.Allround.push(...stateClone.history.currentRound);
    stateClone.history.currentRound = [];
    this.#saveState(stateClone);
  }
  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
  }
  //to transition to the next state
  #saveState(stateOrFn) {
    const prevState = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument");
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }
}
