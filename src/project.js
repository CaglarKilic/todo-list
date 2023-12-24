import MyMap from "./ds";
import generateId from "./utility";

export default class Project {
  title;
  uid;
  cards = new MyMap();
  constructor(title, uid) {
    this.title = title;
    if (!uid) {
      this.uid = generateId();
    } else {
      this.uid = uid;
    }
  }

  get size() {
    return [...this.cards].filter((card) => card.status).length;
  }

  getCard(card) {
    return this.cards.get(card.uid);
  }

  getCardStatus(card) {
    return this.cards.has(card.uid);
  }

  addCard(card) {
    this.cards.set(card.uid, card);
  }

  removeCard(card) {
    return this.cards.remove(card.uid);
  }

  changeCardStatus(card) {
    card.status = card.status ? false : true;
  }
}
