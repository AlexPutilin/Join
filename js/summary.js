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


  async function initializeMetricCards(){
    try{
        const taskData = await getData("board/tasks");
        const tasks = Object.values(taskData);

        updateCount(tasks, 'number-to-do', task => task.status === 'to-do');
        updateCount(tasks, 'number-done', task => task.status === 'done');
        updateCount(tasks, 'number-urgent', task => task.status === 'to-do' && task.priority === 'urgent');
        updateCount(tasks, 'number-tasks-total', () => true);
        updateCount(tasks, 'number-in-progress', task => task.status === 'in-progress');
        updateCount(tasks, 'number-await-feedback', task => task.status === 'await-feedback');
      } catch (err) {
        console.error('Failed to initialize metric cards:', err);
      }
    }

function updateUrgentDeadline(tasks) {
  const urgentTasks = tasks
    .filter(task => task.status === 'to-do' && task.priority === 'urgent' && task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const deadlineElement = document.getElementById('deadline-date-urgent');
  if (deadlineElement) {
    if (urgentTasks.length > 0) {
      deadlineElement.textContent = formatDate(urgentTasks[0].dueDate);
    } else {
      deadlineElement.textContent = 'No Deadline';
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}


function updateCount(tasks, elementId, taskFilter){
    const taskElement = document.getElementById(elementId);
    const metricCount = tasks.filter(taskFilter).length;
    taskElement.textContent = metricCount;
}


function initGreetingUser() {
  const userName = document.getElementById('greeting-user-name');
  userName.innerText = activeUser;
}

initializeMetricCards();