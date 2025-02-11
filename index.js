const formContainer = document.querySelector(".form-container");
const addButtons = document.querySelectorAll(".sidebar button");
const saveButton = document.querySelector(".header button");

let formElements = [];

document.addEventListener("DOMContentLoaded", () => {
  const sampleData = [
    {
      id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
      type: "input",
      label: "Sample Input",
      placeholder: "Sample placeholder",
    },
    {
      id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
      type: "select",
      label: "Sample Select",
      options: ["Sample Option", "Sample Option", "Sample Option"],
    },
    {
      id: "45002ecf-85cf-4852-bc46-529f94a758f5",
      type: "textarea",
      label: "Sample Textarea",
      placeholder: "Sample Placeholder",
    },
    {
      id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
      type: "checkbox",
      label: "Sample Checkbox",
    },
  ];
  formElements = sampleData;
  renderForm();
});

// Render the form
toggleElementEdit = (element, prop, event) => {
  element[prop] = event.target.value;
};

function renderForm() {
  formContainer.innerHTML = "";
  formElements.forEach((el, index) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");
    formGroup.setAttribute("draggable", "true");
    formGroup.dataset.index = index;

    const label = document.createElement("input");
    label.value = el.label;
    label.classList.add("editable-label");
    label.addEventListener("input", (e) => toggleElementEdit(el, "label", e));

    formGroup.appendChild(label);

    let inputField;
    if (el.type === "input") {
      inputField = document.createElement("input");
      inputField.type = "text";
      inputField.placeholder = el.placeholder;
      inputField.addEventListener("input", (e) =>
        toggleElementEdit(el, "placeholder", e)
      );
    } else if (el.type === "select") {
      inputField = document.createElement("select");
      el.options.forEach((opt) => {
        const option = document.createElement("option");
        option.textContent = opt;
        inputField.appendChild(option);
      });
    } else if (el.type === "textarea") {
      inputField = document.createElement("textarea");
      inputField.placeholder = el.placeholder;
      inputField.addEventListener("input", (e) =>
        toggleElementEdit(el, "placeholder", e)
      );
    } else if (el.type === "checkbox") {
      inputField = document.createElement("input");
      inputField.type = "checkbox";
    }

    formGroup.appendChild(inputField);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("trash");
    deleteButton.addEventListener("click", () => deleteElement(index));
    formGroup.appendChild(deleteButton);

    formContainer.appendChild(formGroup);
  });
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.querySelector("span").textContent.toLowerCase();
    const newElement = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      placeholder: type !== "checkbox" ? "Enter text" : undefined,
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
    };
    formElements.push(newElement);
    renderForm();
  });
});

function deleteElement(index) {
  formElements.splice(index, 1);
  renderForm();
}

saveButton.addEventListener("click", () => {
  console.log(JSON.stringify(formElements, null, 2));
});

let draggedItemIndex;
formContainer.addEventListener("dragstart", (e) => {
  draggedItemIndex = e.target.dataset.index;
});

formContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

formContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const targetIndex = e.target.closest(".form-group").dataset.index;
  if (draggedItemIndex !== targetIndex) {
    const draggedItem = formElements.splice(draggedItemIndex, 1)[0];
    formElements.splice(targetIndex, 0, draggedItem);
    renderForm();
  }
});
