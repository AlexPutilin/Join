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
  });