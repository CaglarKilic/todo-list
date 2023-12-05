import generateId from "./utility";

export default class Card {
  title;
  description;
  dueDate;
  priority;
  id;
  constructor(title) {
    this.title = title;
    this.id = generateId();
  }
}
