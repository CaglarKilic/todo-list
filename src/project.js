import MyMap from "./ds";
import generateId from "./utility";

export default class Project {
  title;
  id;
  #cards = new MyMap();
  constructor(title) {
    this.title = title;
    this.id = generateId();
  }

  addCard(card) {
    this.#cards.set(card.id, card);
  }

  removeCard(card) {
    return this.#cards.remove(card.id);
  }

  size() {
    return this.#cards.size;
  }
}
