import MyMap from "./ds";
import Project from "./project";
import Card from "./card.js";
import "./style.css";
import Dom from "./dom.js";

const Projects = (function () {
  const container = new MyMap();
  let activeProject = addProject("Inbox");

  function addProject(title) {
    const project = new Project(title);
    container.set(project.uid, project);
    return project;
  }

  return { addProject, activeProject };
})();
document
  .querySelector("input[name=task")
  .addEventListener(
    "input",
    Dom.toggleButton(document.querySelector("#AddTask"))
  );

document
  .querySelector("#AddTask")
  .addEventListener("click", Dom.addTask);
