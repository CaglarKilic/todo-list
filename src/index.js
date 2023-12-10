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

  function getProjects() {
    return container;
  }

  return { addProject, activeProject, getProjects };
})();
document
  .querySelector("input[name=task")
  .addEventListener(
    "input",
    Dom.toggleButton(document.forms.addTask.elements.addTask)
  );

document.forms.addTask.elements.buttonAddTask.addEventListener(
  "click",
  Dom.addTask
);

document
  .querySelector("menu>li")
  .addEventListener("click", Dom.manageAddTaskModal(Projects.getProjects()));

Projects.addProject("deneme");
Projects.addProject("hebele");
