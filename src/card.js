import generateId from "./utility";

export default class Card {
  title;
  description;
  dueDate;
  priority;
  uid;
  constructor(title) {
    this.title = title;
    this.uid = generateId();
  }
}
