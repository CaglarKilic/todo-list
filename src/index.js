import MyMap from "./ds";
import Project from "./project";
import Card from "./card.js";

const Projects = (function () {
  const container = new MyMap();
  function addProject(title) {
    const project = new Project(title);
    container.set(project.uid, project);
  }
  return { container, addProject };
})();
