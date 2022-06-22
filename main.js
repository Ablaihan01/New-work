(function() {

  let listArray = [],
   keyName = 'my'

  function createAppTitle(title){
    let appTitle = document.createElement("h2")
    appTitle.textContent = title
    return appTitle
  };

  function createTodoItemForm(){

    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add('input-group');
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дело";
    button.classList.add("btn")
    button.disabled = true;
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    input.addEventListener("input", () => {
      input.value !== "" ? button.disabled = false : button.disabled = true
    });

    return {
      form,
      input,
      button,
    };
  };

  function createTodoList(){
    let list = document.createElement('ul');
    list.classList.add("list-group");
    return list;
  };

  function createTodoItemList(obj){
    let item = document.createElement('li');
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add('list-group-item');
    item.textContent = obj.name;

    doneButton.classList.add("btn", 'btn-done');
    doneButton.textContent = "Готово"
    deleteButton.classList.add("btn", 'btn-delete');
    deleteButton.textContent = 'Удалить'

    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    if(obj.done == true) item.classList.add("list-group-item-success")

    doneButton.addEventListener("click", function(){
      item.classList.toggle("list-group-item-success")
      for(let i of listArray){
        if(i.id === obj.id) i.done = !i.done
      };
      saveList(listArray, keyName)
    })

    deleteButton.addEventListener('click', function(){
      if(confirm("Вы уверены?")){
        item.remove();
        for(let i = 0; i < listArray.length; i++){
          if(listArray[i].id === obj.id)listArray.splice(i, 1);
        }
        saveList(listArray, keyName);
      };
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  function getId(arr){
    let max = 0;
    for (let item of arr) {
      if(item.id > max) max = item.id;
    }
    return ++max;
  };

  function saveList(arr, key){
    localStorage.setItem(key, JSON.stringify(arr))
  };

  document.addEventListener("DOMContentLoaded", function(){
    let container = document.querySelector("#todo-app");
    let todoApptitle = createAppTitle('List-Todo');
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoApptitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem('my');

    if(localData !== null && localData != "") listArray = JSON.parse(localData)

    for(let itemNewList of listArray){
      let todoItem = createTodoItemList(itemNewList)
      todoList.append(todoItem.item);
    };

    todoItemForm.form.addEventListener("submit", function(e){
      e.preventDefault();

      if(!todoItemForm.input.value){
        return
      };

      let newItem = {
        id: getId(listArray),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItemList(newItem);

      listArray.push(newItem);
      todoList.append(todoItem.item)
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
      saveList(listArray, keyName);
    })
  })

})();
