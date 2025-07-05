document.addEventListener('DOMContentLoaded', function() {
    const time = new Date().getHours();
    let greeting;
    if (time >= 17) {
      greeting = 'Good evening,';
    } else if (time >= 12) {
      greeting = 'Good afternoon,';
    } else {
      greeting = 'Good morning,';
    }
    document.getElementById('greeting').textContent = greeting;
    initGreetingUser();
  });

  function initializeMetricCards(){
    updateToDoCount();
    updateDoneCount();
    updateUrgentCount();
    updateTasksTotalCount();
    updateInProgressCount();
    updateAwaitFeedbackCount();
  }

  async function updateToDoCount() {
    try {
      const tasksResponse = await fetch(`${FIREBASE_URL}/board/tasks.json`);
      const tasksData = await tasksResponse.json();
      const toDoTasks = Object.values(tasksData).filter(task => task.status === 'to-do');
      const toDoCount = toDoTasks.length;
      const toDoCountElement = document.getElementById('number-to-do');

      toDoCountElement.textContent = toDoCount;
    } catch (err) {
      console.error('Failed to update To-Do count:', err);
    }
  }

  async function updateDoneCount() {
    try {
      const tasksResponse = await fetch(`${FIREBASE_URL}/board/tasks.json`);
      const tasksData = await tasksResponse.json();
      const doneTasks = Object.values(tasksData).filter(task => task.status === 'done');
      const doneCount = doneTasks.length;
      const doneCountElement = document.getElementById('number-done');
      
      doneCountElement.textContent = doneCount;
    } catch (err) {
      console.error('Failed to update To-Do count:', err);
    }
  }

  async function updateUrgentCount() {
    try {
      const tasksResponse = await fetch(`${FIREBASE_URL}/board/tasks.json`);
      const tasksData = await tasksResponse.json();
      const urgentTasks = Object.values(tasksData).filter(task => task.status === 'to-do'&& task.priority === 'urgent');
      const urgentCount = urgentTasks.length;
      const urgentCountElement = document.getElementById('number-urgent');
      
      urgentCountElement.textContent = urgentCount;
    } catch (err) {
      console.error('Failed to update To-Do count:', err);
    }
  }

  async function updateTasksTotalCount() {
    try {
      const response = await fetch(`${FIREBASE_URL}/board/tasks.json`);
      const tasksData = await response.json() || {};
      const totalTaskCount = Object.keys(tasksData).length;
      const totalTasksCountElement = document.getElementById('number-tasks-total');

      if (!totalTasksCountElement) {
        console.error('Element with ID "number-total-tasks" not found');
        return;
      }
      totalTasksCountElement.textContent = totalTaskCount;
    } catch (err) {
      console.error('Failed to update total Tasks count:', err);
    }
  }
  

  async function updateInProgressCount() {
    try {
      const tasksResponse = await fetch(`${FIREBASE_URL}/board/tasks.json`);
      const tasksData = await tasksResponse.json() || {};
      const inProgressTasks = Object.values(tasksData).filter(task => task.status === 'in-progress');
      const inProgressCount = inProgressTasks.length;
      const inProgressCountElement = document.getElementById('number-in-progress');
      
      inProgressCountElement.textContent = inProgressCount;
    } catch (err) {
      console.error('Failed to update To-Do count:', err);
    }
  }

  async function updateAwaitFeedbackCount() {
    try {
      const tasksResponse = await fetch(`${FIREBASE_URL}/board/tasks.json`);
      const tasksData = await tasksResponse.json();
      const awaitFeedbackTasks = Object.values(tasksData).filter(task => task.status === 'await-feedback');
      const awaitFeedbackCount = awaitFeedbackTasks.length;
      const awaitFeedbackCountElement = document.getElementById('number-await-feedback');
      
      awaitFeedbackCountElement.textContent = awaitFeedbackCount;
    } catch (err) {
      console.error('Failed to update To-Do count:', err);
    }
  }



function initGreetingUser() {
  const userName = document.getElementById('greeting-user-name');
  userName.innerText = activeUser;
}

  initializeMetricCards();