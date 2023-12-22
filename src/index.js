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
  .querySelector("form[name='addTask']")
  .addEventListener("reset", (event) => {
    event.target.elements.priority.style.color = "#757575";
    event.target.buttonAddTask.disabled = true;
    event.target.description.rows = 1;
    event.target.task.focus();
  });

document
  .querySelector(`input[name="task"]`)
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
  .querySelector(`input[name="projectTitle"]`)
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

document
  .querySelector("menu#mainMenu>li:nth-child(2)")
  .addEventListener("click", Dom.displayProject(Projects.items));

document
  .querySelector("input[name='due']")
  .addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

document
  .querySelector("select[name='priority']")
  .addEventListener("change", (event) => {
    const select = event.target;
    const option = select.options[select.selectedIndex];
    const color = window.getComputedStyle(option).getPropertyValue("color");
    select.style.color = color;
  });

Projects.addProject("Inbox", "00000001");
Dom.displayProject(Projects.items)();
