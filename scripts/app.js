// ****** SELECT ITEMS **********

const form = document.querySelector(".form");
const groceryInput = document.querySelector("#grocery-input");
const userAlert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submitBtn");
const outputContainer = document.querySelector(".output__container");
const groceryList = document.querySelector(".grocery__list");
const clearBtn = document.querySelector(".clearBtn");

let alertText;
let inputValue;

let previousInputValue;
let isDuplicate = false;

// edit option

let editElement;
let isEditing = false;
let editID = "";

const handleInputChange = (event) => {
  groceryInput.value = event.target.value;
  inputValue = groceryInput.value.toLowerCase();

  return inputValue;
};

const validateForm = (value) => {
  let error;

  if ((!value || value.trim().length === 0) && isEditing === false) {
    console.log(value);
    error = "Please Enter A Value";
  } else {
    error = "";
  }
  return error;
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const groceryItemID = new Date().getTime().toString();

  const inputError = validateForm(inputValue);

  if (inputError.length > 0) {
    alertText = inputError;
    handleDisplayAlert(alertText, "danger");
  }

  let groceryItems = getLocalStorage();
  console.log(groceryItems);

  const currentItemsArr = [];
  groceryItems.forEach((item) => {
    currentItemsArr.push(item.value);
  });

  const currentGroceryList = new Set(currentItemsArr);

  if (currentGroceryList.has(inputValue)) {
    isDuplicate = true;
    alertText = `${inputValue} ${inputValue.endsWith("s") ? "Are" : "Is"} Already Added To The List`;
    handleDisplayAlert(alertText, "danger");
    return;
  }

  if (inputValue && !isEditing) {
    alertText = `${inputValue} ${inputValue.endsWith("s") ? "Are" : "Is"} Added To The List`;
    handleAddItem(groceryItemID, inputValue);

    handleDisplayAlert(alertText, "success");

    outputContainer.classList.add("show__output");

    addToLocalStorage(groceryItemID, inputValue);

    setBackToDefault();
  } else if (inputValue && isEditing) {
    editElement.innerHTML = inputValue;
    alertText = `${previousInputValue} ${previousInputValue.endsWith("s") ? "Are" : "Is"} Replaced With ${inputValue}`;
    handleDisplayAlert(alertText, "success");
    editLocalStorage(editID, inputValue);
    setBackToDefault();
  }
};

const handleClearItems = () => {
  const addedGroceryItems = document.querySelectorAll(".grocery__listItem");
  if (addedGroceryItems.length > 0) {
    addedGroceryItems.forEach((item) => {
      groceryList.removeChild(item);
    });
  }
  outputContainer.classList.remove("show__output");
  handleDisplayAlert("Empty List", "danger");
  setBackToDefault();
  localStorage.removeItem("groceryList");
};

const onInputFocus = (event) => {
  if (event.target.matches("input")) {
    event.target.dataset.previous = event.target.value;
    previousInputValue = event.target.dataset.previous;
  }

  return previousInputValue;
};

// ****** SETUP ITEMS **********

const handleGroceryListDisplay = () => {
  let groceryItems = getLocalStorage();

  if (groceryItems.length > 0) {
    groceryItems.forEach((item) => {
      handleAddItem(item.id, item.value);
    });
    outputContainer.classList.add("show__output");
  }
};

// ****** EVENT LISTENERS **********

groceryInput.addEventListener("input", handleInputChange);

document.addEventListener("focusin", onInputFocus);

form.addEventListener("submit", handleFormSubmit);

clearBtn.addEventListener("click", handleClearItems);

window.addEventListener("DOMContentLoaded", handleGroceryListDisplay);

// ****** FUNCTIONS **********

const handleAddItem = (id, item) => {
  const groceryItem = document.createElement("li");
  groceryItem.classList.add("grocery__listItem");

  const dataAttribute = document.createAttribute("data-id");
  dataAttribute.value = id;
  groceryItem.setAttributeNode(dataAttribute);

  const itemName = document.createElement("p");
  itemName.classList.add("itemName");

  const span = document.createElement("span");

  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.setAttribute("type", "button");
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;

  editBtn.addEventListener("click", handleEditBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;

  deleteBtn.addEventListener("click", handleDeleteBtn);

  itemName.innerText = item;

  groceryList
    .appendChild(groceryItem)
    .appendChild(itemName)
    .insertAdjacentElement("afterend", span)
    .appendChild(editBtn)
    .insertAdjacentElement("afterend", deleteBtn);
};

const handleDisplayAlert = (text, action) => {
  userAlert.innerHTML = text;
  userAlert.classList.add(`${action}`);

  setTimeout(() => {
    userAlert.innerHTML = "";
    userAlert.classList.remove(`${action}`);
  }, 1000);
};

const handleDeleteBtn = (event) => {
  const itemToDelete = event.currentTarget.parentElement.parentElement;

  groceryList.removeChild(itemToDelete);
  handleDisplayAlert(
    `${itemToDelete.firstChild.textContent} ${itemToDelete.firstChild.textContent.endsWith("s") ? "Are" : "Is"} Deleted From The List`,
    "success",
  );
  if (groceryList.childNodes.length === 0) {
    setTimeout(() => {
      handleDisplayAlert("Empty List", "danger");
      outputContainer.classList.remove("show__output");
    }, 2000);
  }

  setBackToDefault();

  const deletedItemID = itemToDelete.getAttributeNode("data-id");

  removeFromLocalStorage(deletedItemID);
};

const handleEditBtn = (event) => {
  const itemToEdit = event.currentTarget.parentElement.parentElement;

  editElement = event.currentTarget.parentElement.previousElementSibling;

  groceryInput.value = editElement.innerHTML;
  isEditing = true;
  editID = itemToEdit.dataset.id;

  submitBtn.textContent = "Edit";
};

const setBackToDefault = () => {
  groceryInput.value = "";
  isEditing = false;
  editID = "";
  submitBtn.textContent = "Submit";
};

// ****** LOCAL STORAGE **********

const addToLocalStorage = (id, value) => {
  const groceryListObj = { id, value };
  let groceryItems = getLocalStorage();
  console.log(groceryItems);

  groceryItems.push(groceryListObj);

  localStorage.setItem("groceryList", JSON.stringify(groceryItems));
};

const removeFromLocalStorage = (id) => {
  let groceryItems = getLocalStorage();

  groceryItems = groceryItems.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("groceryList", JSON.stringify(groceryItems));
};

const editLocalStorage = (id, value) => {
  let groceryItems = getLocalStorage();

  groceryItems = groceryItems.map((item) => {
    if (item.id === id) {
      item.value = value;
    }

    return item;
  });

  localStorage.setItem("groceryList", JSON.stringify(groceryItems));
};

const getLocalStorage = () => {
  return localStorage.getItem("groceryList")
    ? JSON.parse(localStorage.getItem("groceryList"))
    : [];
};
