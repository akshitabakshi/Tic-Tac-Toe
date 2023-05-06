export default class View {
  $ = {};
  $$ = {};
  constructor() {
    this.$.menu = this.#qs('[data-id = "menu"]');
    this.$.menuItems = this.#qs('[data-id = "menuItems"]');
    this.$.menubtn = this.#qs('[data-id = "menu-btn"]');
    this.$.resetBtn = this.#qs('[data-id = "resetBtn"]');
    this.$.newroundBtn = this.#qs('[data-id = "newroundBtn"]');
    this.$$.squares = this.#qsAll('[data-id = "square"]');
    this.$.modal = this.#qs('[data-id = "modal"]');
    this.$.modalText = this.#qs('[data-id = "modal-text"]');
    this.$.modalBtn = this.#qs('[data-id = "modal-btn"]');
    this.$.turn = this.#qs('[data-id = "turn"]');
    this.$.p1wins = this.#qs('[data-id = "p1wins"]');
    this.$.p2wins = this.#qs('[data-id = "p2wins"]');
    this.$.ties = this.#qs('[data-id = "ties"]');
    this.$.menubtn.addEventListener("click", (event) => this.#togglemenu());
  }

  render(game, stats) {
    const { playerwithstats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { iscomplete, winner },
    } = game;

    this.closeAll();
    this.clearMoves();

    this.updateScoreboard(
      playerwithstats[0].wins,
      playerwithstats[1].wins,
      ties
    );
    this.initializeMoves(moves);

    if (iscomplete) {
      this.OpenModal(winner ? winner.name + " Wins!" : "Tie");
      return;
    }
    this.setTurnIndicator(currentPlayer);
  }

  GameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }
  NewRoundEvent(handler) {
    this.$.newroundBtn.addEventListener("click", handler);
  }
  PlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }
  updateScoreboard(p1wins, p2wins, ties) {
    this.$.p1wins.innerText = p1wins;
    this.$.p2wins.innerText = p2wins;
    this.$.ties.innerText = ties;
  }

  OpenModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }
  #closedModal() {
    this.$.modal.classList.add("hidden");
  }
  clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }
  closeAll() {
    this.#closedModal();
    this.#closeMenu();
  }

  initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.HandlePlayerMove(square, existingMove.player);
      }
    });
  }
  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menubtn.classList.remove("border");
    const icon = this.$.menubtn.querySelector("i");
    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }

  #togglemenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menubtn.classList.toggle("border");
    const icon = this.$.menubtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }
  HandlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }
  setTurnIndicator(player) {
    const icon = document.createElement("i");

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);
  }
  // so that it doesnt always have to search on document, so add parent element
  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) throw new Error("Invalid element");
    return el;
  }

  #qsAll(selector, parent) {
    const el = document.querySelectorAll(selector);
    if (!el) throw new Error("Invalid element");
    return el;
  }
}
