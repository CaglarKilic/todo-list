import Card from "./card";

const Dom = (function () {
  function toggleButton(button) {
    return function (event) {
      button.disabled = event.target.value == "";
    };
  }

  function manageAddTaskModal(projects) {
    return function () {
      const select = document.forms.addTask.elements.projects;
      console.log(select);
      projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.uid;
        option.textContent = project.title;
        select.append(option);
      });
      document.querySelector("dialog#addTask").showModal();
    };
  }

  function addTask(event) {
    const form = event.target.form;
    const elements = form.elements;
    const project =
      elements.projects.options[elements.projects.selectedIndex].value;

    const card = new Card(elements.task.value);
    card.description = elements.description.value;
    card.date = elements.due.value;
    card.priority =
      elements.priority.options[elements.priority.selectedIndex].value;

    project.addCard(card);
    console.log(project);
  }

  return { toggleButton, addTask, manageAddTaskModal };
})();

export default Dom;
