import MyMap from "./ds";
import Project from "./project";
import Card from "./card.js";

const Projects = (function () {
  const container = new MyMap();
  let activeProject = addProject("Inbox");

  function addProject(title) {
    const project = new Project(title);
    container.set(project.uid, project);
    return project;
  }

  return { container, addProject, activeProject };
})();
