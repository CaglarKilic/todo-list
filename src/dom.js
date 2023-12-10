import Card from "./card";

const Dom = (function () {
  function toggleButton(button) {
    return function (event) {
      button.disabled = event.target.value == "";
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

  return { toggleButton, addTask };
})();

export default Dom;
