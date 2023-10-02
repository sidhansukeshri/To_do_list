const listContainer = document.getElementById('listContainer');
const addListText = document.getElementById('addListText');
const completedList = document.getElementById('completedList');
let tasksData = [];

function createTaskItem(taskText, parentList, isCompleted = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <label class="checkbox-container">
            <input type="checkbox" class="complete-checkbox">
            <span class="checkmark"></span>
        </label>
        <span class="task-name">${taskText}</span>
        <p class="delete-text">Delete</p>
    `;

    const completeCheckbox = li.querySelector('.complete-checkbox');
    completeCheckbox.addEventListener('change', () => {
        if (completeCheckbox.checked) {
            const completedTask = li.cloneNode(true);
            completedList.appendChild(completedTask);
            li.remove();
            completeCheckbox.checked = false;

            const completedCompleteCheckbox = completedTask.querySelector('.complete-checkbox');
            completedCompleteCheckbox.addEventListener('change', () => {
                if (!completedCompleteCheckbox.checked) {
                    const taskItem = createTaskItem(taskText, parentList);
                    parentList.querySelector('.task-list').appendChild(taskItem);
                    completedTask.remove();
                }
            });

            const completedDeleteText = completedTask.querySelector('.delete-text');
            completedDeleteText.addEventListener('click', () => {
                completedTask.remove();
            });
        }
    });

    const deleteText = li.querySelector('.delete-text');
    deleteText.addEventListener('click', () => {
        if (parentList === completedList) {
            li.remove();
        } else {
            li.remove();
            checkEmpty();
            saveData();
        }
    });

    return li;
}

function checkEmpty() {
    const lists = listContainer.querySelectorAll('.list');
    const emptyMessage = document.getElementById('emptyMessage');

    if (lists.length === 0) {
        if (!emptyMessage) {
            const newEmptyMessage = document.createElement('p');
            newEmptyMessage.textContent = 'No lists created.';
            newEmptyMessage.id = 'emptyMessage';
            listContainer.appendChild(newEmptyMessage);
        }
    } else if (emptyMessage) {
        emptyMessage.remove();
    }
}

function deleteList(list) {
    list.remove();
    checkEmpty();
    saveData();
}

function saveData() {
    const lists = Array.from(listContainer.querySelectorAll('.list')).map((list) => {
        const listName = list.querySelector('h2').textContent;
        const taskItems = Array.from(list.querySelectorAll('.task-name')).map((task) => task.textContent);
        return { listName, taskItems };
    });

    localStorage.setItem('todoLists', JSON.stringify(lists));
}

function loadData() {
    const savedLists = localStorage.getItem('todoLists');
    if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        parsedLists.forEach((listData) => {
            const newList = createNewList(listData.listName);
            listData.taskItems.forEach((taskText) => {
                const taskItem = createTaskItem(taskText, newList);
                newList.querySelector('.task-list').appendChild(taskItem);
            });
            listContainer.appendChild(newList);
        });
    }
    checkEmpty();
}

function createNewList(listName) {
    const newList = document.createElement('div');
    newList.classList.add('list');
    newList.innerHTML = `
        <h2>${listName}</h2>
        <p class="delete-list">Delete List</p>
        <ul class="task-list"></ul>
        <p class="add-task-text">+ Add Task</p>
    `;

    const newAddTaskText = newList.querySelector('.add-task-text');
    newAddTaskText.addEventListener('click', () => {
        const taskText = prompt('Enter a new task');
        if (taskText !== null && taskText.trim() !== '') {
            const taskList = newList.querySelector('.task-list');
            const taskItem = createTaskItem(taskText, newList);
            taskList.appendChild(taskItem);
            saveData();
        }
    });

    const deleteListText = newList.querySelector('.delete-list');
    deleteListText.addEventListener('click', () => {
        deleteList(newList);
    });

    return newList;
}

loadData();

addListText.addEventListener('click', () => {
    const newListName = prompt('Enter a new list name');
    if (newListName !== null && newListName.trim() !== '') {
        const newList = createNewList(newListName);
        listContainer.appendChild(newList);
        saveData();
        checkEmpty();
    }
});
