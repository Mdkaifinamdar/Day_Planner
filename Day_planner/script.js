document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const tasksList = document.getElementById('tasks');
    const themeToggle = document.getElementById('theme-toggle');
    const totalTasksCounter = document.getElementById('total-tasks');
    const pendingTasksCounter = document.getElementById('pending-tasks');
    const completedTasksCounter = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

    const updateCounters = () => {
        const totalTasks = tasks.length;
        const pendingTasks = tasks.filter(task => !task.completed).length;
        const completedTasks = totalTasks - pendingTasks;

        totalTasksCounter.textContent = `Total Tasks: ${totalTasks}`;
        pendingTasksCounter.textContent = `Pending Tasks: ${pendingTasks}`;
        completedTasksCounter.textContent = `Completed Tasks: ${completedTasks}`;
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = task.completed ? 'completed' : '';
            taskItem.draggable = true;

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.contentEditable = true;
            taskText.addEventListener('blur', () => {
                task.text = taskText.textContent;
                saveTasks();
            });

            const taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.checked = task.completed;
            taskCheckbox.addEventListener('change', () => {
                task.completed = taskCheckbox.checked;
                saveTasks();
                renderTasks();
                updateCounters();
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateCounters();
            });

            taskItem.appendChild(taskCheckbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteButton);
            tasksList.appendChild(taskItem);
        });
        updateCounters();
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };

    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    new Sortable(tasksList, {
        animation: 150,
        onEnd: () => {
            const newTasks = [];
            tasksList.querySelectorAll('li').forEach((taskItem) => {
                const taskText = taskItem.querySelector('span').textContent;
                const completed = taskItem.querySelector('input').checked;
                newTasks.push({ text: taskText, completed });
            });
            tasks = newTasks;
            saveTasks();
        }
    });

    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    });

    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    renderTasks();
});
