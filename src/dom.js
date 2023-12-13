import Card from "./card";

const Dom = (function () {
  let activeProject = "00000001"; //Inbox

  function toggleButton(button) {
    return function (event) {
      button.disabled = event.target.value == "";
    };
  }

  function manageAddTaskModal(projects) {
    return function () {
      const select = document.forms.addTask.elements.projects;
      projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.uid;
        option.textContent = project.title;
        select.append(option);
      });
      document.querySelector("dialog#addTask").showModal();
    };
  }

  function addTask(projects) {
    return function (event) {
      const form = event.target.form;
      const elements = form.elements;
      const projectUID =
        elements.projects.options[elements.projects.selectedIndex].value;

      const card = new Card(elements.task.value);
      card.description = elements.description.value;
      card.date = elements.due.value;
      card.priority =
        elements.priority.options[elements.priority.selectedIndex].value;

      const project = projects.get(projectUID);
      project.addCard(card);

      if (activeProject == projectUID) {
        displayProject(project)(null);
      }
    };
  }

  function displayProject(projects) {
    return function (event) {
      const project = event ? projects.get(event.target.dataset.uid) : projects;
      const header = document.querySelector("header");
      const main = document.querySelector("main");

      console.log(header.children);
      project.cards.forEach((card) => {});
    };
  }
  return { toggleButton, addTask, manageAddTaskModal, activeProject };
})();

export default Dom;
