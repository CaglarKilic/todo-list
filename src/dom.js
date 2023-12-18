import Card from "./card";
import { Datepicker } from "vanillajs-datepicker";
import "vanillajs-datepicker/css/datepicker.css";

const Dom = (function () {
  let activeProject = "00000001"; //Inbox
  let pickedCard = null;
  let pickedProject = null;

  const date = document.querySelector(`input[name="due"]`);
  const picker = new Datepicker(date);

  function toggleButton(button) {
    return function (event) {
      button.disabled = event.target.value == "";
    };
  }

  function toggleOverlay(dialog) {
    const body = document.querySelector("body");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    body.append(overlay);
    overlay.addEventListener("click", (event) => {
      dialog.close();
      event.target.remove();
    });
  }

  function manageAddTaskModal(projects) {
    return function () {
      let select = document.forms.addTask.elements.projects;
      select.replaceChildren();
      projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.uid;
        option.textContent = project.title;
        if (activeProject == project.uid) {
          option.defaultSelected = true;
        }
        select.append(option);
      });
      const dialog = document.querySelector("dialog#addTask");
      dialog.show();
      select = document.forms.addTask.elements.priority;
      select.style.color = "#757575";
      toggleOverlay(dialog);
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
        elements.priority.options[elements.priority.selectedIndex].textContent;

      project.addCard(card);

      pickedCard = null;
      form.reset();

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
        elements
          .namedItem("delete")
          .addEventListener("click", deleteCard(projects));
        main.append(section);

        document
          .querySelector(`section[data-uid="${card.uid}"]`)
          .addEventListener("click", editCard(projects));
      });
    };
  }

  function manageAddProjectModal() {
    const dialog = document.querySelector("#addProject");
    dialog.show();
    toggleOverlay(dialog);
  }

  function addProject(projects) {
    return function (event) {
      const form = event.target.form;
      const title = form.elements.projectTitle.value;

      if (pickedProject) {
        pickedProject.title = title;
      } else {
        projects.addProject(title);
      }

      displayProjectList(projects.items);
      pickedProject = null;
      form.reset();
    };
  }

  function displayProjectList(projects) {
    const menu = document.querySelector("#projectsMenu");
    const h2 = menu.firstElementChild;
    menu.replaceChildren();
    menu.append(h2);
    const template = document.querySelector("#projectsTemplate");
    projects.forEach((project) => {
      if (project.uid != "00000001") {
        let li = template.cloneNode(true).content.firstElementChild;
        let edit = li.nextElementSibling;
        li.append(project.title);
        li.setAttribute("data-uid", project.uid);
        li.addEventListener("click", displayProject(projects));
        edit.addEventListener("click", editProject(projects));
        const del = edit.nextElementSibling;
        del.addEventListener("click", deleteProject(projects));
        menu.append(li, edit, del);
      }
    });
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
      if (event.target.type == "checkbox") {
        return;
      }
      const form = document.forms.addTask;
      const dialog = form.parentElement;
      const section = event.currentTarget;
      const project = projects.get(activeProject);
      pickedCard = project.cards.get(section.dataset.uid);

      form.elements.task.value = pickedCard.title;
      form.elements.description.value = pickedCard.description;
      form.elements.due.value = pickedCard.dueDate;
      form.elements.priority.value = pickedCard.priority;

      dialog.show();
    };
  }

  function deleteCard(projects) {
    return function (event) {
      event.stopPropagation();
      const project = projects.get(activeProject);
      const card = project.cards.get(event.target.parentElement.dataset.uid);
      project.removeCard(card);
      displayProject(projects)(null);
    };
  }

  function editProject(projects) {
    return function (event) {
      event.stopPropagation();
      pickedProject = projects.get(
        event.target.previousElementSibling.dataset.uid
      );

      const form = document.forms.addProject;
      const dialog = form.parentElement;

      form.elements.projectTitle.value = pickedProject.title;
      dialog.showModal();
    };
  }

  function deleteProject(projects) {
    return function (event) {
      const project = projects.get(
        event.target.previousElementSibling.previousElementSibling.dataset.uid
      );
      projects.remove(project.uid);
      displayProjectList(projects);
    };
  }

  return {
    toggleButton,
    addTask,
    manageAddTaskModal,
    manageAddProjectModal,
    addProject,
    displayProject,
    displayProjectList,
  };
})();

export default Dom;
