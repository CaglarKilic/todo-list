import MyMap from "./ds";
import generateId from "./utility";

export default class Project {
  title;
  uid;
  #dos = new MyMap();
  #done = new MyMap();
  constructor(title) {
    this.title = title;
    this.uid = generateId();
  }

  getCard(card) {
    return this.#dos.get(card.uid)  || this.#done.get(card.uid);
  }

  getCardStatus(card) {
    return this.#dos.has(card.uid);
  }
  
  addCard(card) {
    this.#dos.set(card.uid, card);
  }

  removeCard(card) {
    return this.#dos.remove(card.uid) || this.#done.remove(card.uid);
  }

  changeCardStatus(card) {
    if (this.getCardStatus(card)) {
      this.#done.set(card.uid, this.removeCard(card));
    } else {
      this.#dos.set(card.uid, this.removeCard(card));
    }
  }
}
