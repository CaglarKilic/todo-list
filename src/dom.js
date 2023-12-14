import Card from "./card";

const Dom = (function () {
  let activeProject = "00000001"; //Inbox
  let pickedCard = null;

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
        if (activeProject == project.uid) {
          option.defaultSelected = true;
        }
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
      const project = projects.get(projectUID);

      const card = pickedCard || new Card(elements.task.value);

      card.description = elements.description.value;
      card.dueDate = elements.due.value;
      card.priority =
        elements.priority.options[elements.priority.selectedIndex].value;

      project.addCard(card);

      pickedCard = null;

      if (activeProject == projectUID) {
        displayProject(projects)(null);
      }
    };
  }

  function displayProject(projects) {
    return function (event) {
      const project = event
        ? projects.get(event.target.dataset.uid)
        : projects.get(activeProject);
      const header = document.querySelector("header");
      const main = document.querySelector("main");
      activeProject = project.uid;

      header.replaceChildren();
      main.replaceChildren();

      let template = document
        .querySelector("#projectTitleTemplate")
        .cloneNode(true);
      template.content.children.namedItem("projectTitle").append(project.title);
      header.append(template.content);

      project.cards.forEach((card) => {
        template = document.querySelector("#cardTemplate").cloneNode(true);
        const section = template.content.firstElementChild;
        const elements = section.children;
        section.setAttribute("data-uid", card.uid);
        elements.namedItem("cardTitle").append(card.title);
        elements.namedItem("dueDate").append(card.dueDate);
        elements.namedItem("description").append(card.description);
        elements.namedItem("priority").append(card.priority);
        elements
          .namedItem("status")
          .addEventListener("change", changeTaskStatus(projects));
        main.append(section);

        document
          .querySelector(`section[data-uid="${card.uid}"]`)
          .addEventListener("click", editCard(projects), true);
      });
    };
  }

  function manageAddProjectModal() {
    const dialog = document.querySelector("#addProject");
    dialog.showModal();
  }

  function addProject(projects) {
    return function (event) {
      const form = event.target.form;
      const title = form.elements.projectTitle.value;

      const project = projects.addProject(title);

      const template = document
        .querySelector("#projectsTemplate")
        .cloneNode(true);
      const menu = document.querySelector("#projectsMenu");
      const li = template.content.firstElementChild;
      li.append(title);
      li.setAttribute("data-uid", project.uid);
      li.addEventListener("click", displayProject(projects.items));
      menu.append(li);
    };
  }

  function changeTaskStatus(projects) {
    return function (event) {
      const checkbox = event.target;
      if (checkbox.checked) {
        const project = projects.get(activeProject);
        const card = project.cards.get(checkbox.parentElement.dataset.uid);
        project.changeCardStatus(card);
        checkbox.parentElement.remove();
      }
    };
  }

  function editCard(projects) {
    return function (event) {
      const form = document.forms.addTask;
      const dialog = form.parentElement;
      const section = event.currentTarget;
      const project = projects.get(activeProject);
      pickedCard = project.cards.get(section.dataset.uid);

      console.log(event.target);
      console.log(pickedCard);

      form.elements.task.value = pickedCard.title;
      form.elements.description.value = pickedCard.description;
      form.elements.due.value = pickedCard.dueDate;
      form.elements.priority.value = pickedCard.priority;

      dialog.showModal();
    };
  }

  return {
    toggleButton,
    addTask,
    manageAddTaskModal,
    manageAddProjectModal,
    addProject,
    displayProject,
  };
})();

export default Dom;
