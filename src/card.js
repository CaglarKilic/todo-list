import generateId from "./utility";

export default class Card {
  title;
  description;
  dueDate;
  priority;
  uid;
  status;
  constructor({
    title,
    uid,
    status = true,
    description = "",
    dueDate = "",
    priority = 5,
  }) {
    this.title = title;
    this.uid = uid || generateId();
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }
}
