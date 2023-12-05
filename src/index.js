import MyMap from "./ds";
import Project from "./project";

const projects = (function () {
  const inbox = new Project("Inbox");
  const container = new MyMap();
  container.set(inbox.id, inbox);
  return container;
})();

console.log(projects);
