let currentDraggedElement;
let currentSourceContainer;
let touchClone;
let touchCurrentTarget;

/**
 * All containers that support drag-and-drop.
 * @type {NodeListOf<HTMLElement>}
 */
const dragAndDropContainers = document.querySelectorAll('.drag-drop-container');

/**
 * Placeholder element inserted to show drop position.
 * @type {HTMLElement}
 */
let placeholder = document.createElement('div');
placeholder.classList.add('drop-placeholder');

/**
 * NodeList of all drop placeholder elements.
 * @type {NodeListOf<HTMLElement>}
 */
const selectPlaceholder = document.querySelectorAll('.drop-placeholder');

/**
 * Enables drag-and-drop functionality for task cards.
 * Adds event listeners to handle drag start and drag end events, updating the UI and internal state accordingly.
 * Also initializes drag reordering and touch-based dragging support.
 */
function enableTaskDragging() {
    const draggables = document.querySelectorAll('.card');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            handleTaskDragStart(draggable);
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            document.body.classList.remove('drag-active');
        });
    });
    enableDragReordering();
    enableTaskDraggingByTouch(draggables);
}

/**
 * Handles the start of a drag event for a task card.
 * Updates global state and UI appearance.
 * @param {HTMLElement} draggable - The element being dragged.
 */
function handleTaskDragStart(draggable) {
    currentDraggedElement = draggable.id;
    currentSourceContainer = draggable.parentNode;
    draggable.classList.add('dragging');
    document.body.classList.add('drag-active');
}

/**
 * Enables touch-based dragging for a list of draggable elements.
 * Creates a visual clone of the dragged element to follow the touch, 
 * handles touch start and end events, and updates the task order after drop.
 * @param {Element} draggables - A collection of draggable DOM elements.
 */
function enableTaskDraggingByTouch(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('touchstart', (event) => {
            handleTaskTouchStart(draggable, event);
        });
        draggable.addEventListener('touchend', async () => {
            await handleTaskTouchEnd(draggable);
        });
        moveByTouch(draggables);
    });
}

/**
 * Handles the end of a touch drag event.
 * Inserts the element at the placeholder position and updates task order.
 * @param {HTMLElement} draggable - The dragged element.
 */
async function handleTaskTouchEnd(draggable) {
    if (touchClone) {
        touchClone.remove();
    }
    document.body.classList.remove('drag-active');
    draggable.classList.remove('dragging');
    const dropZone = placeholder?.parentNode;
    if (placeholder && dropZone) {
        dropZone.insertBefore(draggable, placeholder);
        placeholder.remove();
        await updateOrderInContainer(dropZone, dropZone.id);
    }
    touchCurrentTarget = null;
    selectPlaceholder.forEach(placeholder => placeholder.remove());
}

/**
 * Handles the start of a touch drag.
 * Creates a visual clone and prepares for movement tracking.
 * @param {HTMLElement} draggable - The dragged element.
 * @param {TouchEvent} event - The touchstart event.
 */
function handleTaskTouchStart(draggable, event) {
    currentDraggedElement = draggable.id;
    draggable.classList.add('dragging');
    document.body.classList.add('drag-active');
    touchClone = draggable.cloneNode(true);
    touchClone.classList.add('touch-clone');
    const rect = draggable.getBoundingClientRect();
    applyTouchCloneStyles(rect);
    document.body.appendChild(touchClone);
    updateTouchPosition(event.touches[0]);
}

/**
 * Applies size and initial position styles to the touch clone element.
 * @param {DOMRect} rect - Bounding box of the original element.
 */
function applyTouchCloneStyles(rect) {
    touchClone.style.width = rect.width + 'px';
    touchClone.style.height = rect.height + 'px';
    touchClone.style.top = rect.top + 'px';
    touchClone.style.left = rect.left + 'px';
}

/**
 * Enables touch-based movement for draggable elements.
 * Tracks finger movement and updates the position of the dragged clone.
 * Dynamically inserts a placeholder element in the appropriate drop zone, 
 * to indicate the potential drop position based on the touch location.
 * @param {HTMLElement} draggables - A collection of draggable DOM elements.
 */
function moveByTouch(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('touchmove', (event) => {
            handleTaskTouchMove(event, draggable);
        }, { passive: false });
    });
}

/**
 * Handles touch movement during a drag.
 * @param {TouchEvent} event - The touchmove event.
 * @param {HTMLElement} draggable - The element being dragged.
 */
function handleTaskTouchMove(event, draggable) {
    event.preventDefault();
    updateTouchPosition(event.touches[0]);
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = target?.closest('.drag-drop-container');
    if (dropZone) {
        touchCurrentTarget = dropZone;
        positionPlaceholder(dropZone, draggable, touch);
    }
}

/**
 * Positions the placeholder element within a drop zone based on touch Y position.
 * @param {HTMLElement} dropZone - The target container.
 * @param {HTMLElement} draggable - The currently dragged element.
 * @param {Touch} touch - The touch position object.
 */
function positionPlaceholder(dropZone, draggable, touch) {
    const allTasks = Array.from(dropZone.querySelectorAll('.task')).filter(element => element !== draggable && element !== placeholder);
    let inserted = false;
    for (const task of allTasks) {
        const taskBox = task.getBoundingClientRect();
        const middleY = taskBox.top + taskBox.height / 2;
        if (touch.clientY < middleY) {
            task.parentNode.insertBefore(placeholder, task);
            inserted = true;
            break;
        }
    }
    if (!inserted) {
        dropZone.appendChild(placeholder);
    }
}

/**
 * Updates the position of the touch clone element to follow the user's finger.
 * @param {Touch} touch - The touch point from the current event.
 */
function updateTouchPosition(touch) {
    if (!touchClone) {
        return;
    }
    touchClone.style.left = `${touch.clientX + 1}px`;
    touchClone.style.top = `${touch.clientY + 1}px`;
}

/**
 * Enables drag-and-drop reordering within all drag-and-drop containers.
 * Registers 'dragover' event listeners on each container to calculate the correct insertion point
 * and display a visual placeholder based on cursor position.
 * Also enables drop handling for updating task order and status after a drag-and-drop action.
 */
function enableDragReordering() {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('dragover', event => {
            handleTaskDragover(event, dragAndDropContainer);
        });
    });
    enableTaskDropByStatus();
}

/**
 * Handles the 'dragover' event during drag-and-drop reordering inside a container.
 * Calculates the correct insertion position for the dragged element based on cursor Y-position,
 * removes any existing placeholder, and places a new one to visually indicate the drop position.
 * @param {DragEvent} event - The drop event triggered on the container.
 * @param {HTMLElement} dragAndDropContainer - The container element where the task is dropped.
 */
function handleTaskDragover(event, dragAndDropContainer) {
    event.preventDefault();
    const afterElement = getDragAfterElement(dragAndDropContainer, event.clientY);
    const draggable = document.querySelector('.dragging');
    const existingPlaceholder = dragAndDropContainer.querySelector('.drop-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    if (draggable) {
        handleDragAndDropContainer(afterElement, dragAndDropContainer);
    }
}

/**
 * Inserts a placeholder into the correct position based on current drag target.
 * @param {HTMLElement|null} afterElement - The element after which the dragged item should be placed.
 * @param {HTMLElement} dragAndDropContainer - The container receiving the drag.
 */
function handleDragAndDropContainer(afterElement, dragAndDropContainer) {
    if (afterElement == null) {
        dragAndDropContainer.appendChild(placeholder);
    } else {
        dragAndDropContainer.insertBefore(placeholder, afterElement);
    }
}

/**
 * Handles the drop event and updates task order accordingly.
 * @param {DragEvent} event - The drop event.
 * @param {HTMLElement} dragAndDropContainer - The container element where the task is dropped.
 * @returns {Promise<void>} - Resolves after updating the order in both source and target containers.
 */
async function handleTaskDrop(event, dragAndDropContainer) {
    event.preventDefault();
    const draggedCard = document.getElementById(currentDraggedElement);
    const placeholder = document.querySelector('.drop-placeholder'); // global suchen
    if (draggedCard) {
        handlePlaceholer(placeholder, dragAndDropContainer, draggedCard);
    }
    if (currentSourceContainer && currentSourceContainer !== dragAndDropContainer) {
        await updateOrderInContainer(currentSourceContainer, currentSourceContainer.id);
    }
    await updateOrderInContainer(dragAndDropContainer, dragAndDropContainer.id);
    currentSourceContainer = null;
    selectPlaceholder.forEach(placeholder => placeholder.remove());
}

/**
 * Places the dragged element at the placeholder position or appends it to the end.
 * @param {HTMLElement} placeholder - The placeholder element in the container.
 * @param {HTMLElement} dragAndDropContainer - The container element where the task is dropped.
 * @param {HTMLElement} draggedCard - The element being dropped.
 */
function handlePlaceholer(placeholder, dragAndDropContainer, draggedCard) {
    if (placeholder && placeholder.parentNode === dragAndDropContainer) {
        dragAndDropContainer.insertBefore(draggedCard, placeholder);
        placeholder.remove();
    } else {
        dragAndDropContainer.appendChild(draggedCard);
    }
}

/**
 * Enables drop functionality for all containers by attaching drop event listeners.
 */
function enableTaskDropByStatus() {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('drop', (event) => {
            handleTaskDrop(event, dragAndDropContainer);
        });
    });
}

/**
 * Determines the element just below a given vertical point inside a container.
 * @param {HTMLElement} container - The container holding draggable cards.
 * @param {number} y - The vertical position of the pointer (mouse or touch).
 * @returns {Element|null} - The closest element below the given Y position.
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging):not(.drop-placeholder)')];
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    for (const child of draggableElements) {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            closest = { offset, element: child };
        }
    }
    return closest.element;
}

/**
 * Updates the order and status of tasks based on their position within a container.
 * Calls collectTasksToUpdate() to determine changes, then persists them and re-renders the task board.
 * @param {HTMLElement} container - The DOM container element holding task cards.
 * @param {string} newStatus - The new status to assign to all tasks in this container.
 */
async function updateOrderInContainer(container, newStatus) {
    const tasksToUpdate = collectTasksToUpdate(container, newStatus);
    if (tasksToUpdate.length > 0) {
        await updateMultipleTasks(tasksToUpdate);
    }
    await renderAllTasks();
}

/**
 * Compares and collects tasks that need an update based on order or status.
 * @param {HTMLElement} container - The container with the task cards.
 * @param {string} newStatus - The new status to assign to all tasks in this container.
 * @returns {Array<Object>} - A list of tasks with updated order and status.
 */
function collectTasksToUpdate(container, newStatus) {
    const cards = Array.from(container.querySelectorAll('.card'));
    const tasksToUpdate = [];
    for (let index = 0; index < cards.length; index++) {
        const cardId = cards[index].id;
        const taskIndex = allTasks.findIndex(task => task.id === cardId);
        const task = allTasks[taskIndex];
        const oldOrder = task.order;
        const oldStatus = task.status;
        const orderChanged = oldOrder !== index;
        const statusChanged = oldStatus !== newStatus;
        if (orderChanged || statusChanged) {
            updateOrderAndStatus(task, index, newStatus, tasksToUpdate);
        }
    }
    return tasksToUpdate;
}

/**
 * Updates task's order and status, then adds it to the update queue. 
 * @param {Object} task - The task object to update.
 * @param {number} index - The new order index.
 * @param {string} newStatus - The new status to assign.
 * @param {Array<Object>} tasksToUpdate - The array to collect updated tasks.
 */
function updateOrderAndStatus(task, index, newStatus, tasksToUpdate) {
    task.order = index;
    task.status = newStatus;
    tasksToUpdate.push(task);
}

/**
 * Sends multiple task updates to the backend.
 * @param {Array<Object>} tasks - A list of task objects to update.
 */
async function updateMultipleTasks(tasks) {
    for (const task of tasks) {
        const path = `/board/tasks/${task.id}`;
        await updateData(path, task);
    }
}