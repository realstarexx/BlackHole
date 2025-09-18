    let timeLeft = 30;
    const timerEl = document.getElementById('timer');
    const countdown = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        history.back();
      }
    }, 1000);
