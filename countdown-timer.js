document.addEventListener('DOMContentLoaded', function() {
    // Get calculator elements
    const calculateCountdownBtn = document.getElementById('calculate-countdown-btn');
    const countdownResult = document.getElementById('countdown-result');
    const eventNameInput = document.getElementById('event-name');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const shareButtons = document.querySelectorAll('.share-btn');

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    }

    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggleBtn.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i><span>Light Mode</span>' : 
            '<i class="fas fa-moon"></i><span>Dark Mode</span>';
    });

    // Social sharing functionality
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const eventName = eventNameInput.value.trim() || 'My Event';
            const eventDate = document.getElementById('event-date').value;
            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent(`Counting down to ${eventName} on ${eventDate}!`);
            
            let shareLink = '';
            switch(platform) {
                case 'facebook':
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                    break;
                case 'twitter':
                    shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
                    break;
                case 'whatsapp':
                    shareLink = `https://wa.me/?text=${shareText} ${shareUrl}`;
                    break;
            }
            
            window.open(shareLink, '_blank', 'width=600,height=400');
        });
    });

    // Switch to countdown calculator
    countdownOption.addEventListener('click', function() {
        document.querySelectorAll('.calculator-option').forEach(opt => opt.classList.remove('active'));
        document.querySelectorAll('.calculator-section').forEach(sect => sect.classList.remove('active'));
        countdownOption.classList.add('active');
        countdownCalculator.classList.add('active');
    });

    // Calculate countdown
    calculateCountdownBtn.addEventListener('click', function() {
        const eventDate = new Date(document.getElementById('event-date').value);
        const eventName = eventNameInput.value.trim() || 'Event';

        if (isNaN(eventDate.getTime())) {
            showError('Please enter a valid date');
            return;
        }

        // Calculate time difference
        const now = new Date();
        const difference = eventDate - now;

        if (difference < 0) {
            showError('Please enter a future date');
            return;
        }

        // Calculate days, hours, minutes, seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format the result
        let resultHTML = `<h3>Countdown to ${eventName}</h3>`;
        resultHTML += `
            <div class="countdown-display">
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
            <p><i class="fas fa-calendar-check"></i> Event Date: <strong>${formatDate(eventDate)}</strong></p>
        `;

        countdownResult.innerHTML = resultHTML;
        animateResult();

        // Update countdown every second
        const countdownInterval = setInterval(() => {
            const newDifference = eventDate - new Date();
            
            if (newDifference <= 0) {
                clearInterval(countdownInterval);
                countdownResult.innerHTML = `<h3>${eventName} has arrived!</h3>`;
                return;
            }

            const newDays = Math.floor(newDifference / (1000 * 60 * 60 * 24));
            const newHours = Math.floor((newDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const newMinutes = Math.floor((newDifference % (1000 * 60 * 60)) / (1000 * 60));
            const newSeconds = Math.floor((newDifference % (1000 * 60)) / 1000);

            document.querySelectorAll('.countdown-value')[0].textContent = newDays;
            document.querySelectorAll('.countdown-value')[1].textContent = newHours;
            document.querySelectorAll('.countdown-value')[2].textContent = newMinutes;
            document.querySelectorAll('.countdown-value')[3].textContent = newSeconds;
        }, 1000);

        // Clear interval when switching to another calculator
        document.querySelectorAll('.calculator-option').forEach(opt => {
            opt.addEventListener('click', () => {
                if (opt.id !== 'countdown-option') {
                    clearInterval(countdownInterval);
                }
            });
        });
    });

    // Helper function to show error
    function showError(message) {
        countdownResult.innerHTML = `<div class="error">${message}</div>`;
    }

    // Helper function to format date
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Helper function to animate result
    function animateResult() {
        document.querySelector('.result-section').classList.add('active');
        setTimeout(() => {
            document.querySelector('.result-section').classList.remove('active');
        }, 1500);
    }
});