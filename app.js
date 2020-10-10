// Storage Controller #############################################################################################################################################
const StorageCtrl = (function () {
  // Public Methods
  return{
  storeItem: function(item){
    let items;

    // Check if any item in Local Storage
    if(localStorage.getItem('items') === null){
      items = [];
      // Push the new item
      items.push(item);
      // Set local Storage
      localStorage.setItem('items',JSON.stringify(items));
    }else{ 
      // Get the items of ls
      items = JSON.parse(localStorage.getItem('items'));

      // Push new item
      items.push(item);

      // Reset LS
      localStorage.setItem('items', JSON.stringify(items));
    }  
  },
  getItemsFromStorage: function(){
    let items;
    if(localStorage.getItem('items') === null){
      items = [];
    }else{
      items = JSON.parse(localStorage.getItem('items'));
      return items;
    }
  },
  updateItemStorage: function(updatedItem){
     let items = JSON.parse(localStorage.getItem('items'));
    
     items.forEach(function(item,index){
      if(updatedItem.id === item.id){
        items.splice(index, 1, updatedItem)
      }
     });
     localStorage.setItem('items', JSON.stringify(items));  
  },
  deleteItemsFromStorage: function(id){
    let items = JSON.parse(localStorage.getItem('items'));
    
    items.forEach(function(item,index){
     if(id === item.id){
       items.splice(index, 1);
     }
    });
    localStorage.setItem('items', JSON.stringify(items));  
  },
  clearItemsFromStorage: function(){
    localStorage.removeItem('items');
  }
}
})();

// Item Controller #############################################################################################################################################
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    // items: [
    //   {id: 0, name: "Steak Dinner", calories: 1200 },
    //   {id: 1, name: "Cookies", calories: 200 },
    //   {id: 2, name: "Eggs", calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItemById: function (id) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories)  {
      let ID;
      // create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    clearAllItems: function () {
      data.items = [];
    },
    getcurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      // Loop through items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // Set total Calories in Data Structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    getItemById: function (id) {
      let found = null;

      // Loop through Items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller #############################################################################################################################################
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    clearBtn: ".clear-btn",
  };

  // Public Methods
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    getSelectors: function () {
      return UISelectors;
    },
    addListItem: function (item) {
      // Display List UL
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add Classname
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
            `;
      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn NodeList into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInputField: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    clearEditState: function () {
      UICtrl.clearInputField();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    addItemToForm: function () {
      UICtrl.showEditState();
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getcurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getcurrentItem().calories;
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    showEditState: function () {
      (document.querySelector(UISelectors.updateBtn).style.display = "inline"),
        (document.querySelector(UISelectors.deleteBtn).style.display =
          "inline"),
        (document.querySelector(UISelectors.backBtn).style.display = "inline"),
        (document.querySelector(UISelectors.addBtn).style.display = "none");
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
  };
})();

// App Controller #############################################################################################################################################

const App = (function (UICtrl, StorageCtrl, ItemCtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();
    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit),
      // Disable submit on enter
      document.addEventListener("keypress", function (e) {
        if (e.keyCode === 13 || e.which === 13) {
          e.preventDefault();
          return false;
        }
      });
    // Edit item click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form Input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calories
    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add Item into UI List
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total cals to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in Local Storage
      StorageCtrl.storeItem (newItem);

      // Clear Input form
      UICtrl.clearInputField();
    }
    e.preventDefault();
  };

  // Click edit Item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      const listId = e.target.parentNode.parentNode.id;

      //Break listId into an array
      const listIdArray = listId.split("-");

      // Get actu al Id from Array
      const id = parseInt(listIdArray[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    // Get meal input
    const input = UICtrl.getItemInput();
    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //   Update UI
    UICtrl.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total cals to UI
    UICtrl.showTotalCalories(totalCalories); 

    // Update local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function (e) {
    //  Get current item
    const currentItem = ItemCtrl.getcurrentItem();
    // Delete item from Data Structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories(); 

    // Add total cals to UI
    UICtrl.showTotalCalories(totalCalories);

    //  Delete from Local Storage
    StorageCtrl.deleteItemsFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // CLear all items click
  const clearAllItemsClick = function (e) {
    // Delete all Items from Data Structure
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total cals to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from local Storage
    StorageCtrl.clearItemsFromStorage();   

    // Hide the UL
    UICtrl.hideList();
  };

  // Public Methods
  return {
    init: function () {
      // Clear edit state / set initial set
      UICtrl.clearEditState();
      console.log("Initializing App....");
      // Clear Edit State / Set initial state
      // UICtrl.clearEditState();

      // Fetch Items from data structure
      const items = ItemCtrl   .getItems();

      // Check if list is empty
      if (items.length == 0) {
        // Call hide list from UI
        UICtrl.hideList();
      } else {
        // Populate list with Items
        UICtrl.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total cals to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    },
  };
})(UICtrl, StorageCtrl, ItemCtrl);

// Initializing App
App.init();
