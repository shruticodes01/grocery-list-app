# grocery-list-app

Grocery list app built for Redi School Prework

## Table of contents

- [My Process](#my-process)
  - [Built-with](#built-with)
  - [My learnings](#my-learnings)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)

## My Process

### Built with

- Semantic HTML5 markup
- CSS
  - Flexbox
  - CSS Grid
- JavaScript

**Note: The styles were directly taken from the initial setup folder**

### My learnings

- Why setbackToDefault() function was required.
- Localstorage API
- How to select previous input value to provide customized alert on edit using focusin event.

```getting previousInputValue on focusin event

let previousInputValue;

const onInputFocus = (event) => {
  if (event.target.matches("input")) {
    event.target.dataset.previous = event.target.value;
    previousInputValue = event.target.dataset.previous;
  }

  return previousInputValue;
};

document.addEventListener("focusin", onInputFocus);
```

```code inside handleFormSubmit function
else if (inputValue && isEditing) {
    editElement.innerHTML = inputValue;
    alertText = `${previousInputValue} ${previousInputValue.endsWith("s") ? "Are" : "Is"} Replaced With ${inputValue}`;
    handleDisplayAlert(alertText, "success");
    editLocalStorage(editID, inputValue);
    setBackToDefault();
  }
```

- How to ensure duplicate values are not added to the list by creating an array of current item values and then creating a Set object out of it to check if the Set object already has the input value.

```duplicate values
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
```

**Note: I tried to write html5 and some of the javascript myself, and followed along for the part that was related to deleteBtn, localstorage, displaying list on reload, and adjusted my previously written code as required**

### Continued development

- Based on this project, I would like to learn how to remove element from the localstorage upon deleting, because array filter method doesn't mutate instead creates a shallow copy which is results in item being visible after reload.

### Useful resources

- mdn
- perplexity ai (used for finding solution for getting the previous input value upon edit)
