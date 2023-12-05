export default class MyMap extends Map {
  remove(id) {
    const element = this.get(id);
    if (element) {
      this.delete(id);
      return element;
    } else {
      return undefined;
    }
  }
}
