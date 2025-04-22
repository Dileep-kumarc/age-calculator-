document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const yearsResult = document.getElementById('years');
    const monthsResult = document.getElementById('months');
    const daysResult = document.getElementById('days');
    const additionalInfo = document.getElementById('additional-info');
    
    // Add input validation
    [dayInput, monthInput, yearInput].forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            validateInput(this);
        });
    });
    
    function validateInput(input) {
        const id = input.id;
        const value = parseInt(input.value);
        
        if (id === 'day') {
            if (value < 1 || value > 31) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        } else if (id === 'month') {
            if (value < 1 || value > 12) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
                // Update max days based on month
                if (dayInput.value) {
                    const year = yearInput.value ? parseInt(yearInput.value) : new Date().getFullYear();
                    const maxDays = new Date(year, value, 0).getDate();
                    if (parseInt(dayInput.value) > maxDays) {
                        dayInput.classList.add('invalid');
                    } else {
                        dayInput.classList.remove('invalid');
                    }
                }
            }
        } else if (id === 'year') {
            const currentYear = new Date().getFullYear();
            if (value < 1900 || value > currentYear) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        }
    }
    
    calculateBtn.addEventListener('click', calculateAge);
    
    // Allow Enter key to trigger calculation
    [dayInput, monthInput, yearInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAge();
            }
        });
    });
    
    function calculateAge() {
        // Get input values
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        
        // Validate inputs
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            showError('Please fill in all fields');
            return;
        }
        
        // Check if date is valid
        const inputDate = new Date(year, month - 1, day);
        if (inputDate.getFullYear() !== year || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
            showError('Please enter a valid date');
            return;
        }
        
        // Check if date is in the future
        const currentDate = new Date();
        if (inputDate > currentDate) {
            showError('Birth date cannot be in the future');
            return;
        }
        
        // Calculate age
        let ageYears = currentDate.getFullYear() - inputDate.getFullYear();
        let ageMonths = currentDate.getMonth() - inputDate.getMonth();
        let ageDays = currentDate.getDate() - inputDate.getDate();
        
        // Adjust for negative months or days
        if (ageDays < 0) {
            ageMonths--;
            // Get the last day of the previous month
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            ageDays += lastMonth.getDate();
        }
        
        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }
        
        // Display the result with animation
        animateValue(yearsResult, 0, ageYears, 1000);
        animateValue(monthsResult, 0, ageMonths, 1000);
        animateValue(daysResult, 0, ageDays, 1000);
        
        // Show additional information
        showAdditionalInfo(inputDate, ageYears, ageMonths, ageDays);
        
        // Add animation to result section
        document.querySelector('.result-section').classList.add('active');
        setTimeout(() => {
            document.querySelector('.result-section').classList.remove('active');
        }, 1500);
    }
    
    function showError(message) {
        additionalInfo.innerHTML = `<div class="error">${message}</div>`;
        yearsResult.textContent = '-';
        monthsResult.textContent = '-';
        daysResult.textContent = '-';
    }
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function showAdditionalInfo(birthDate, years, months, days) {
        const currentDate = new Date();
        
        // Calculate total days lived
        const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        
        // Calculate next birthday
        const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < currentDate) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.floor((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));
        
        // Calculate zodiac sign
        const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
        
        // Calculate day of week born
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[birthDate.getDay()];
        
        // Display additional information
        additionalInfo.innerHTML = `
            <p><i class="fas fa-calendar-day"></i> You've lived for <strong>${totalDays.toLocaleString()}</strong> days</p>
            <p><i class="fas fa-birthday-cake"></i> Your next birthday is in <strong>${daysUntilBirthday}</strong> days</p>
            <p><i class="fas fa-star"></i> Your zodiac sign is <strong>${zodiacSign}</strong></p>
            <p><i class="fas fa-calendar-week"></i> You were born on a <strong>${dayOfWeek}</strong></p>
        `;
    }
    
    function getZodiacSign(month, day) {
        const signs = [
            { name: 'Capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
            { name: 'Aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
            { name: 'Pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
            { name: 'Aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
            { name: 'Taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
            { name: 'Gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
            { name: 'Cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
            { name: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
            { name: 'Virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
            { name: 'Libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
            { name: 'Scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
            { name: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
        ];
        
        for (const sign of signs) {
            if (
                (month === sign.start.month && day >= sign.start.day) ||
                (month === sign.end.month && day <= sign.end.day)
            ) {
                return sign.name;
            }
        }
        
        return 'Capricorn'; // Default fallback
    }
    
    // Add CSS class for invalid inputs
    const style = document.createElement('style');
    style.textContent = `
        .input-group input.invalid {
            border-color: #ff6b6b;
            background-color: rgba(255, 107, 107, 0.1);
        }
        
        .error {
            color: #ff6b6b;
            font-weight: 500;
            margin-bottom: 10px;
        }
        
        .result-section.active .age-box {
            animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Add a README.md file with instructions for GitHub hosting
    console.log('Age Calculator ready!');
});