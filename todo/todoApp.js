function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
}

function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let button = document.createElement('button');
    let buttonWrapper = document.createElement('div');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    // Устанавливаем стартовое отключение кнопки
    button.setAttribute("disabled", "disabled");

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
        form,
        input,
        button,
    };
}

function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

function createTodoItem(name) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
        item,
        doneButton,
        deleteButton,
    };
}


// Добавляем третий аргумент в функцию с возможностью не создавать начальный список
let createTodoApp = function(container, title = 'Список дел', startingCases = '', localName = '') {

    let todoListLocal = JSON.parse(localStorage.getItem(localName));

    function extractPersonalLocalStorage() {
        todoListLocal = localStorage.getItem(localName);
        todoListLocal = JSON.parse(todoListLocal);
        localStorage.removeItem(localName);
        return todoListLocal;
    };

    function writePersonalLocalStorage() {
        localStorage.setItem(localName, JSON.stringify(todoListLocal));
    };


    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

// Проверяем наличие начального списка
    if (startingCases !== ''){
            for (let prequel of startingCases) {
            let prequelName = prequel.name;
            let prequelDone = prequel.done;


            // Добавляем начальное дело на страницу
            let prequelTask = createTodoItem(prequelName);
            todoList.append(prequelTask.item);

            // Проверяем на свойство готовности начального дела                
            if (prequelDone) {
                prequelTask.item.classList.add('list-group-item-success');
            }

            // Вызываем обработчик на клик 'Готово'   
            prequelTask.doneButton.addEventListener('click', function(){
                prequelTask.item.classList.toggle('list-group-item-success');
                extractPersonalLocalStorage();
               
                // Ищем элемент и меняем его статус
                for (let currentNameList of todoListLocal){
                    if (currentNameList.name === prequelTask.item.firstChild.textContent) {
                    currentNameList.done = prequelTask.item.classList.contains('list-group-item-success');
                    }
                }

                writePersonalLocalStorage();
            });

            // Вызываем обработчик на клик 'Удалить'             
            prequelTask.deleteButton.addEventListener('click', function(){
                if (confirm('Вы уверены?')) {
                    prequelTask.item.classList.toggle('list-group-item-success');

                    extractPersonalLocalStorage();

                    // Ищем элемент и удаляем соответствующий объект из него
                    for (i = 0; i < todoListLocal.length; i++){
                        if (todoListLocal[i].name === prequelTask.item.firstChild.textContent) {
                            console.log(todoListLocal[i]);
                            todoListLocal.splice(i, 1);
                        }
                    }

                    // Проверяем пустоту переменной, для предотвращения автоматического заполнения делами в случае удаления последнего единственного дела
                    if (todoListLocal === []){
                        localStorage.setItem(localName, null);
                    }
                    else {
                        writePersonalLocalStorage();
                    }   


                    prequelTask.item.remove();
                }
            });
        }
    }

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!todoItemForm.input.value){
            return;
        }

        let todoItem = createTodoItem(todoItemForm.input.value);
        extractPersonalLocalStorage();

        todoListLocal.push({
            name : todoItemForm.input.value,
            done : false
        });

        writePersonalLocalStorage();

        todoItem.doneButton.addEventListener('click', function(){

            extractPersonalLocalStorage();
            todoItem.item.classList.toggle('list-group-item-success');
            // Ищем элемент и меняем его статус
            for (let currentNameList of todoListLocal){
                if (currentNameList.name === todoItem.item.firstChild.textContent) {
                currentNameList.done = todoItem.item.classList.contains('list-group-item-success');
                }
            }

            writePersonalLocalStorage();
        });

        todoItem.deleteButton.addEventListener('click', function(){

            extractPersonalLocalStorage();

            if (confirm('Вы уверены?')) {
                // Ищем элемент и удаляем соответствующий объект из него
                for (i = 0; i < todoListLocal.length; i++){
                    if (todoListLocal[i].name === todoItem.item.firstChild.textContent) {
                        todoListLocal.splice(i, 1);
                    }
                }
                todoItem.item.remove();

                 // Проверяем пустоту переменной, для предотвращения автоматического заполнения делами в случае удаления последнего единственного дела
                if (todoListLocal === []){
                    localStorage.setItem(localName, null);
                }
                else {
                    writePersonalLocalStorage();
                }   
            }

        });

        todoList.append(todoItem.item);
        todoItemForm.input.value = '';

        // После отправки формы отключаем кнопку
        todoItemForm.button.setAttribute("disabled", "disabled");
        return todoListLocal;
    });

    todoItemForm.input.oninput = function() {
        // Проверяем на наличие символов в input и отключаем кнопку
        if (todoItemForm.input.value == '') {
            todoItemForm.button.setAttribute("disabled", "disabled");
        }
        else {
            todoItemForm.button.removeAttribute("disabled", "disabled");
        }
    }
}

