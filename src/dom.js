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
      const project =
        elements.projects.options[elements.projects.selectedIndex].value;

      const card = new Card(elements.task.value);
      card.description = elements.description.value;
      card.date = elements.due.value;
      card.priority =
        elements.priority.options[elements.priority.selectedIndex].value;

      projects.get(project).addCard(card);
    };
  }

  function displayProjectPage(project) {
    function buildTemplate() {
      const h1 = document.createElement("h1");
      h1.append(`${project.title}`);
      const div = document.createElement("div");
      project.getCards().forEach((card) => {
        const section = document.createElement("section");
        const h2 = document.createElement("h2");
        h2.append(card.title);
        const p = document.createElement("p");
        p.append(card.description);
        const outputDate = document.createElement("output");
        outputDate.value = card.dueDate;
        const outputPriority = document.createElement("output");
        outputPriority.value = card.priority;
        div.append(section.append(h2, p, outputDate, outputPriority));
      });
    }
    return function (event) {
      if (event) {
      }
    };
  }

  return { toggleButton, addTask, manageAddTaskModal, activeProject };
})();

export default Dom;
