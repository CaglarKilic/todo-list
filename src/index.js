import MyMap from "./ds";
import Project from "./project";
import "./style.css";
import Dom from "./dom.js";

const Projects = (function () {
  const items = new MyMap();

  function addProject(title, uid) {
    const project = new Project(title, uid);
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
  .querySelector("menu#mainMenu>li")
  .addEventListener("click", Dom.manageAddTaskModal(Projects.items));

document
  .querySelector("input[name=projectTitle")
  .addEventListener(
    "input",
    Dom.toggleButton(document.forms.addProject.elements.buttonAddProject)
  );

document.forms.addProject.elements.buttonAddProject.addEventListener(
  "click",
  Dom.addProject(Projects)
);

document
  .querySelector("menu#projectsMenu>h2")
  .addEventListener("click", Dom.manageAddProjectModal);

Projects.addProject("Inbox", "00000001");

document
  .querySelector("menu#mainMenu>li:nth-child(2)")
  .addEventListener("click", Dom.displayProject(Projects.items));
