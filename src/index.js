import MyMap from "./ds";
import Project from "./project";
import "./style.css";
import Dom from "./dom.js";

const Projects = (function () {
  const items = new MyMap();

  function addProject(title) {
    const project = new Project(title);
    items.set(project.uid, project);
    return project;
  }

  return { addProject, items };
})();
document
  .querySelector("input[name=task]")
  .addEventListener(
    "input",
    Dom.toggleButton(document.forms.addTask.elements.buttonAddTask)
  );

document.forms.addTask.elements.buttonAddTask.addEventListener(
  "click",
  Dom.addTask(Projects.items)
);

document
  .querySelector("menu>li")
  .addEventListener("click", Dom.manageAddTaskModal(Projects.items));

Projects.addProject("Inbox");
Projects.addProject("deneme");
Projects.addProject("hebele");
