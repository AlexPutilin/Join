/**
 * On DOMContentLoaded:
 * - Sets greeting based on current hour.
 * - Initializes profile, auth redirect, user greeting, mobile welcome, and metric cards.
 * @listens document#DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
  const time = new Date().getHours();
  let greeting;
  if (time >= 17) {
    greeting = "Good evening,";
  } else if (time >= 12) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good morning,";
  }
  document.querySelectorAll(".greeting-text").forEach((welcome) => {
    welcome.textContent = greeting;
  });
  initSummaryPage();
});

/**
 * Initializes the summary page by setting up profile, authentication redirect,
 * user greeting, mobile welcome screen, and dashboard metrics.
 * @function initSummaryPage
 * @returns {void}
 */
function initSummaryPage() {
  initProfile();
  redirectIfNotLoggedIn();
  initGreetingUser();
  showMobileWelcomeScreen();
  initMetricCards();
}

/**
 * Fetches all tasks and updates dashboard metrics.
 * @async
 * @function initMetricCards
 * @returns {Promise<void>}
 */
async function initMetricCards() {
  try {
    const taskData = await getData("board/tasks");
    const tasks = Object.values(taskData);

    updateCount(tasks, "number-to-do", (task) => task.status === "to-do");
    updateCount(tasks, "number-done", (task) => task.status === "done");
    updateCount(
      tasks,
      "number-urgent",
      (task) => task.status === "to-do" && task.priority === "urgent"
    );
    updateCount(tasks, "number-tasks-total", () => true);
    updateCount(
      tasks,
      "number-in-progress",
      (task) => task.status === "in-progress"
    );
    updateCount(
      tasks,
      "number-await-feedback",
      (task) => task.status === "await-feedback"
    );
    updateUrgentDeadline(tasks);
  } catch (err) {
    console.error("Failed to initialize metric cards:", err);
  }
}

/**
 * Finds the next urgent due date and displays it, or shows a fallback.
 * @function updateUrgentDeadline
 * @param {Array<Object>} tasks - List of task objects.
 * @returns {void}
 */
function updateUrgentDeadline(tasks) {
  const urgentTasks = tasks
    .filter(
      (task) =>
        task.status === "to-do" && task.priority === "urgent" && task.due_date
    )
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const deadlineElement = document.getElementById("deadline-date-urgent");
  if (deadlineElement) {
    if (urgentTasks.length > 0) {
      deadlineElement.textContent = formatDate(urgentTasks[0].due_date);
    } else {
      deadlineElement.textContent = "No open Deadlines";
    }
  }
}

/**
 * Formats an ISO date string to "DD.MM.YYYY" using German locale.
 * @function formatDate
 * @param {string} dateString - ISO date.
 * @returns {string} Formatted date.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Updates a metric element’s text to the count of tasks matching a filter.
 * @function updateCount
 * @param {Array<Object>} tasks - List of tasks.
 * @param {string} elementId - DOM id to update.
 * @param {function(Object): boolean} taskFilter - Predicate for counting.
 * @returns {void}
 */
function updateCount(tasks, elementId, taskFilter) {
  const taskElement = document.getElementById(elementId);
  const metricCount = tasks.filter(taskFilter).length;
  taskElement.textContent = metricCount;
}

/**
 * Loads user data and injects the user’s name into greeting elements.
 * @function initGreetingUser
 * @returns {void}
 */
function initGreetingUser() {
  loadUser();
  document.querySelectorAll(".greeting-user-name").forEach((userName) => {
    userName.innerText = activeUser;
  });
}

/**
 * Shows a one‑time mobile welcome screen on small viewports.
 * @function showMobileWelcomeScreen
 * @returns {void}
 */
function showMobileWelcomeScreen() {
  if (window.innerWidth > 992) return;
  if (sessionStorage.getItem("welcomeScreen") === "true") return;
  const welcomeScreen = document.getElementById("welcome-screen-mobile");
  if (!welcomeScreen) return;
  welcomeScreen.classList.remove("d-none");
  welcomeScreen.classList.add("show");
  sessionStorage.setItem("welcomeScreen", "true");

  setTimeout(() => {
    welcomeScreen.classList.remove("show");
    welcomeScreen.classList.add("d-none");
  }, 2000);
}
