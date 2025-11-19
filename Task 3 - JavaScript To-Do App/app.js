// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Select DOM elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyMessage = document.getElementById('empty-message');

    // --- Data ---
    // Load tasks from Local Storage or use an empty array
    // Tasks are now objects: { text: "Task name", completed: false }
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- Functions ---

    /**
     * Saves the current 'tasks' array to Local Storage.
     */
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    /**
     * Renders the tasks from the 'tasks' array to the DOM.
     */
    const renderTasks = () => {
        // Clear the current task list
        taskList.innerHTML = '';

        // Check if the list is empty
        if (tasks.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            // Loop through each task object
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                
                // Add 'completed' class if task.completed is true
                if (task.completed) {
                    li.classList.add('completed');
                }
                
                // Set the HTML for the list item, including checkbox
                li.innerHTML = `
                    <div class="task-content">
                        <input type="checkbox" class="complete-cb" data-index="${index}" ${task.completed ? 'checked' : ''}>
                        <span>${task.text}</span>
                    </div>
                    <div class="task-buttons">
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }
    };

    /**
     * Adds a new task.
     */
    const addTask = (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        const newTaskText = taskInput.value.trim();

        if (newTaskText !== '') {
            // Add a new task object to the array
            tasks.push({ text: newTaskText, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = ''; // Clear the input
        }
    };

    /**
     * Edits an existing task's text.
     */
    const editTask = (index) => {
        const currentText = tasks[index].text;
        const newText = prompt('Edit your task:', currentText);

        if (newText !== null && newText.trim() !== '') {
            // Update the text property of the task object
            tasks[index].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    };

    /**
     * Deletes an existing task.
     */
    const deleteTask = (index) => {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1); // Remove the task from the array
            saveTasks();
            renderTasks();
        }
    };

    /**
     * Toggles the 'completed' state of a task.
     */
    const toggleComplete = (index) => {
        // Flip the boolean value
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(); // Re-render to show the change (line-through)
    };


    /**
     * Handles clicks on the 'Edit', 'Delete', or 'Complete' buttons/checkboxes.
     * This uses event delegation.
     */
    const handleListClick = (e) => {
        const target = e.target;
        const index = target.dataset.index; // Get the index from the 'data-index' attribute

        // Check if the clicked element is an 'Edit' button
        if (target.classList.contains('edit-btn')) {
            editTask(index);
        }

        // Check if the clicked element is a 'Delete' button
        if (target.classList.contains('delete-btn')) {
            deleteTask(index);
        }

        // Check if the clicked element is a 'Complete' checkbox
        if (target.classList.contains('complete-cb')) {
            toggleComplete(index);
        }
    };

    // --- Event Listeners ---
    
    // Listen for form submission to add a new task
    taskForm.addEventListener('submit', addTask);

    // Listen for clicks on the task list (for edit, delete, or complete)
    taskList.addEventListener('click', handleListClick);

    // --- Initial Render ---
    // Render all tasks when the page first loads
    renderTasks();
});