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
      const textarea = document.forms.addTask.elements.description;
      textarea.rows = 1;
      while (textarea.clientHeight < textarea.scrollHeight) {
        textarea.rows += 1;
      }
      if (dialog.firstElementChild.task.classList.contains("task-done-edit")) {
        dialog.firstElementChild.task.blur();
      }
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

      const card = pickedCard || new Card({});

      card.title = elements.task.value;
      card.description = elements.description.value;
      const date = Datepicker.parseDate(elements.due.value, "mm/dd/yyyy");
      card.dueDate = date ? Datepicker.formatDate(date, "d M y, DD") : "";
      card.priority =
        elements.priority.options[elements.priority.selectedIndex].value;

      project.addCard(card);
      updateLocalStorage(project);

      pickedCard = null;
      form.reset();

      if (activeProject != projectUID) {
        projects.get(activeProject).removeCard(card);
      }
      displayProjectList(projects);
      displayProject(projects)(null);
    };
  }

  function displayProject(projects) {
    return function (event) {
      const highlight = function () {
        projects.forEach((project) => {
          const dom = document.querySelector(`li[data-uid="${project.uid}"]`);
          if (project.uid == activeProject) {
            dom.classList.add("highlight-project");
          } else {
            dom.classList.remove("highlight-project");
          }
        });
      };
      const project = event
        ? projects.get(event.currentTarget.dataset.uid)
        : projects.get(activeProject);
      const header = document.querySelector("header");
      const main = document.querySelector("main");
      activeProject = project.uid;

      highlight();

      header.replaceChildren();
      main.replaceChildren();

      let template = document
        .querySelector("#projectTitleTemplate")
        .cloneNode(true);
      template.content.children.namedItem("projectTitle").append(project.title);
      header.append(template.content);

      const prioMap = {
        1: "top",
        2: "high",
        3: "mid",
        4: "low",
        5: "none",
      };

      project.cards.forEach((card) => {
        template = document.querySelector("#cardTemplate").cloneNode(true);
        const section = template.content.firstElementChild;
        const elements = section.children;

        section.setAttribute("data-uid", card.uid);
        elements.namedItem("cardTitle").append(card.title);
        elements.namedItem("dueDate").append(card.dueDate);
        elements.namedItem("description").append(card.description);
        elements.namedItem("status").classList.add(prioMap[card.priority]);
        elements
          .namedItem("status")
          .addEventListener("change", changeTaskStatus(projects));
        elements
          .namedItem("delete")
          .addEventListener("click", deleteCard(projects));

        section.addEventListener("click", editCard(projects));
        section.addEventListener(
          "mouseover",
          () => (elements.namedItem("delete").hidden = false)
        );
        section.addEventListener(
          "mouseout",
          () => (elements.namedItem("delete").hidden = true)
        );

        if (!card.status) {
          card.status = true; //following event changes back to false.
          elements.namedItem("status").dispatchEvent(new Event("change"));
          elements.namedItem("status").checked = true;
        }

        main.append(section);
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
        li.setAttribute("data-uid", project.uid);
        li.addEventListener("click", displayProject(projects));
        const h3 = li.firstElementChild;
        h3.append(project.title);
        const edit = h3.nextElementSibling;
        edit.addEventListener("click", editProject(projects));
        const del = edit.nextElementSibling;
        del.addEventListener("click", deleteProject(projects));
        li.append(h3, edit, del);
        menu.append(li);
        li.setAttribute("data-count", project.size > 0 ? project.size : "");
      }

      const inbox = projects.get("00000001");
      const inboxDom = document.querySelector("menu#mainMenu>li:nth-child(2)");

      inboxDom.setAttribute("data-count", inbox.size > 0 ? inbox.size : "");
    });
  }

  function changeTaskStatus(projects) {
    return function (event) {
      const checkbox = event.target;

      const project = projects.get(activeProject);
      const card = project.cards.get(checkbox.parentElement.dataset.uid);
      project.changeCardStatus(card);

      const section = checkbox.parentElement;
      [...section.children]
        .slice(1, -1)
        .forEach((elem) => elem.classList.toggle("task-done"));
      const form = document.querySelector("form[name='addTask']");
      console.log(form);
      [...form.elements].forEach((elem) =>
        elem.classList.toggle("task-done-edit")
      );
      displayProjectList(projects);
      updateLocalStorage(project);
    };
  }

  function editCard(projects) {
    return function (event) {
      if (event.target.type == "checkbox") {
        return;
      }
      const form = document.forms.addTask;
      const dialog = form.parentElement;
      const button = form.elements.buttonAddTask;
      const section = event.currentTarget;
      const project = projects.get(activeProject);
      pickedCard = project.cards.get(section.dataset.uid);

      function revert() {
        button.textContent = "Add Task";
        document.querySelector(".overlay").dispatchEvent(new Event("click"));
        pickedCard = null;
      }

      button.addEventListener("click", revert, { once: true });

      dialog.addEventListener("close", () => {
        button.removeEventListener("click", revert);
        button.textContent = "Add Task";
        pickedCard = null;
      });

      button.disabled = false;
      button.textContent = "Edit Task";

      form.elements.task.value = pickedCard.title;
      form.elements.description.value = pickedCard.description;
      const date = Datepicker.parseDate(pickedCard.dueDate, "d M y, DD");
      form.elements.due.value = date
        ? Datepicker.formatDate(date, "mm/dd/yyyy")
        : "";
      form.elements.priority.selectedIndex = pickedCard.priority;
      form.elements.priority.style.color = "white";

      manageAddTaskModal(projects)();
    };
  }

  function deleteCard(projects) {
    return function (event) {
      event.stopPropagation();
      const project = projects.get(activeProject);
      const card = project.cards.get(event.target.parentElement.dataset.uid);
      project.removeCard(card);
      updateLocalStorage(project);
      displayProject(projects)(null);
      displayProjectList(projects);
    };
  }

  function editProject(projects) {
    return function (event) {
      event.stopPropagation();
      pickedProject = projects.get(event.target.parentElement.dataset.uid);

      const form = document.forms.addProject;
      const dialog = form.parentElement;
      const button = form.elements.buttonAddProject;

      function revert() {
        button.textContent = "Add";
        document.querySelector(".overlay").dispatchEvent(new Event("click"));
        pickedProject = null;
        displayProject(projects)();
      }

      button.addEventListener("click", revert, { once: true });

      dialog.addEventListener("close", () => {
        button.removeEventListener("click", revert);
        button.textContent = "Add";
        pickedProject = null;
      });

      button.disabled = false;
      button.textContent = "Edit";

      form.elements.projectTitle.value = pickedProject.title;
      manageAddProjectModal();
    };
  }

  function deleteProject(projects) {
    return function (event) {
      event.stopPropagation();
      const project = projects.get(event.target.parentElement.dataset.uid);
      projects.remove(project.uid);
      displayProjectList(projects);
      if (activeProject == project.uid) {
        activeProject = "00000001";
      }
      displayProject(projects)();
    };
  }

  function updateLocalStorage(project) {
    const cards = Array.from(project.cards.values());
    const projects = JSON.parse(localStorage.getItem("projects"));
    const p = {
      title: project.title,
      uid: project.uid,
      cards: cards,
    };
    console.log(p);
    projects[project.uid] = p;
    localStorage.setItem("projects", JSON.stringify(projects));
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
