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
    document.querySelectorAll('.greeting-text').forEach(welcome => {
        welcome.textContent = greeting;
      });
    initProfile();
    redirectIfNotLoggedIn();
    initGreetingUser();
    showMobileWelcomeScreen();
    initMetricCards();
  });


  async function initMetricCards(){
    try{
        const taskData = await getData("board/tasks");
        const tasks = Object.values(taskData);

        updateCount(tasks, 'number-to-do', task => task.status === 'to-do');
        updateCount(tasks, 'number-done', task => task.status === 'done');
        updateCount(tasks, 'number-urgent', task => task.status === 'to-do' && task.priority === 'urgent');
        updateCount(tasks, 'number-tasks-total', () => true);
        updateCount(tasks, 'number-in-progress', task => task.status === 'in-progress');
        updateCount(tasks, 'number-await-feedback', task => task.status === 'await-feedback');
        updateUrgentDeadline(tasks);
      } catch (err) {
        console.error('Failed to initialize metric cards:', err);
      }
    }

    function updateUrgentDeadline(tasks) {
        const urgentTasks = tasks
          .filter(task => task.status === 'to-do' && task.priority === 'urgent' && task.due_date)
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      
        const deadlineElement = document.getElementById('deadline-date-urgent');
        if (deadlineElement) {
          if (urgentTasks.length > 0) {
            deadlineElement.textContent = formatDate(urgentTasks[0].due_date);
          } else {
            deadlineElement.textContent = 'Keine Deadline';
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
    loadUser();
    document.querySelectorAll('.greeting-user-name').forEach(userName => {
      userName.innerText = activeUser;
    });
  }
  

  function showMobileWelcomeScreen() {
    if (window.innerWidth > 992) return;
    if (sessionStorage.getItem('welcomeScreen') === 'true') return;
    const welcomeScreen = document.getElementById('welcome-screen-mobile');
    if (!welcomeScreen) return;
    welcomeScreen.classList.remove('d-none');
    welcomeScreen.classList.add('show');
    sessionStorage.setItem('welcomeScreen', 'true');

    setTimeout(() => {
      welcomeScreen.classList.remove('show');
      welcomeScreen.classList.add('d-none');
    }, 2000);
  }