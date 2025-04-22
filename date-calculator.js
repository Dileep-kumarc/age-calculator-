document.addEventListener('DOMContentLoaded', function() {
    // Get calculator option elements
    const diffOption = document.getElementById('diff-option');
    const addOption = document.getElementById('add-option');
    
    // Get calculator section elements
    const diffCalculator = document.getElementById('diff-calculator');
    const addCalculator = document.getElementById('add-calculator');
    
    // Get button elements
    const calculateDiffBtn = document.getElementById('calculate-diff-btn');
    const calculateAddBtn = document.getElementById('calculate-add-btn');
    
    // Get result element
    const dateResult = document.getElementById('date-result');
    
    // Switch between calculator options
    diffOption.addEventListener('click', function() {
        diffOption.classList.add('active');
        addOption.classList.remove('active');
        diffCalculator.classList.add('active');
        addCalculator.classList.remove('active');
    });
    
    addOption.addEventListener('click', function() {
        addOption.classList.add('active');
        diffOption.classList.remove('active');
        addCalculator.classList.add('active');
        diffCalculator.classList.remove('active');
    });
    
    // Calculate date difference
    calculateDiffBtn.addEventListener('click', function() {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            showError('Please enter valid dates');
            return;
        }
        
        // Calculate difference in days
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate years, months, and remaining days
        let years = 0;
        let months = 0;
        let days = 0;
        
        // Create temporary date objects to manipulate
        let tempStartDate = new Date(startDate);
        let tempEndDate = new Date(endDate);
        
        // Ensure start date is before end date for calculation
        if (startDate > endDate) {
            [tempStartDate, tempEndDate] = [tempEndDate, tempStartDate];
        }
        
        // Calculate years
        while (tempStartDate.getFullYear() < tempEndDate.getFullYear()) {
            const nextYear = new Date(tempStartDate);
            nextYear.setFullYear(tempStartDate.getFullYear() + 1);
            
            if (nextYear <= tempEndDate) {
                years++;
                tempStartDate = nextYear;
            } else {
                break;
            }
        }
        
        // Calculate months
        while (tempStartDate.getMonth() !== tempEndDate.getMonth() || tempStartDate.getFullYear() !== tempEndDate.getFullYear()) {
            const nextMonth = new Date(tempStartDate);
            nextMonth.setMonth(tempStartDate.getMonth() + 1);
            
            if (nextMonth <= tempEndDate) {
                months++;
                tempStartDate = nextMonth;
            } else {
                break;
            }
        }
        
        // Calculate remaining days
        days = tempEndDate.getDate() - tempStartDate.getDate();
        if (days < 0) {
            // Go back one month and add days of that month
            months--;
            const lastMonth = new Date(tempEndDate.getFullYear(), tempEndDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // Format the result
        let resultHTML = '<h3>Date Difference</h3>';
        
        if (startDate > endDate) {
            resultHTML += '<p><i class="fas fa-info-circle"></i> End date is before start date. Showing absolute difference.</p>';
        }
        
        resultHTML += `
            <p><i class="fas fa-calendar-day"></i> <strong>${diffDays}</strong> total days difference</p>
        `;
        
        if (years > 0 || months > 0) {
            resultHTML += `<p><i class="fas fa-calendar-week"></i> That's `;
            
            if (years > 0) {
                resultHTML += `<strong>${years}</strong> year${years !== 1 ? 's' : ''}`;
                if (months > 0 || days > 0) resultHTML += ', ';
            }
            
            if (months > 0) {
                resultHTML += `<strong>${months}</strong> month${months !== 1 ? 's' : ''}`;
                if (days > 0) resultHTML += ', ';
            }
            
            if (days > 0 || (years === 0 && months === 0)) {
                resultHTML += `<strong>${days}</strong> day${days !== 1 ? 's' : ''}`;
            }
            
            resultHTML += '</p>';
        }
        
        // Add weekday information
        const startDay = startDate.toLocaleDateString('en-US', { weekday: 'long' });
        const endDay = endDate.toLocaleDateString('en-US', { weekday: 'long' });
        
        resultHTML += `
            <p><i class="fas fa-calendar"></i> Start date: <strong>${formatDate(startDate)}</strong> (${startDay})</p>
            <p><i class="fas fa-calendar"></i> End date: <strong>${formatDate(endDate)}</strong> (${endDay})</p>
        `;
        
        // Show weeks information
        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        
        if (weeks > 0) {
            resultHTML += `<p><i class="fas fa-calendar-week"></i> That's <strong>${weeks}</strong> week${weeks !== 1 ? 's' : ''}`;
            if (remainingDays > 0) {
                resultHTML += ` and <strong>${remainingDays}</strong> day${remainingDays !== 1 ? 's' : ''}`;
            }
            resultHTML += '</p>';
        }
        
        dateResult.innerHTML = resultHTML;
        animateResult();
    });
    
    // Calculate add/subtract days
    calculateAddBtn.addEventListener('click', function() {
        const baseDate = new Date(document.getElementById('base-date').value);
        const daysNumber = parseInt(document.getElementById('days-number').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;
        
        if (isNaN(baseDate.getTime())) {
            showError('Please enter a valid date');
            return;
        }
        
        if (isNaN(daysNumber)) {
            showError('Please enter a valid number of days');
            return;
        }
        
        // Calculate result date
        const resultDate = new Date(baseDate);
        if (operation === 'add') {
            resultDate.setDate(baseDate.getDate() + daysNumber);
        } else {
            resultDate.setDate(baseDate.getDate() - daysNumber);
        }
        
        // Format the result
        const baseDay = baseDate.toLocaleDateString('en-US', { weekday: 'long' });
        const resultDay = resultDate.toLocaleDateString('en-US', { weekday: 'long' });
        
        let resultHTML = '<h3>Date Calculation Result</h3>';
        resultHTML += `
            <p><i class="fas fa-calendar"></i> Base date: <strong>${formatDate(baseDate)}</strong> (${baseDay})</p>
            <p><i class="fas fa-calculator"></i> ${operation === 'add' ? 'Added' : 'Subtracted'} <strong>${daysNumber}</strong> day${daysNumber !== 1 ? 's' : ''}</p>
            <p><i class="fas fa-calendar-check"></i> Result date: <strong>${formatDate(resultDate)}</strong> (${resultDay})</p>
        `;
        
        dateResult.innerHTML = resultHTML;
        animateResult();
    });
    
    // Helper function to show error
    function showError(message) {
        dateResult.innerHTML = `<div class="error">${message}</div>`;
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
    
    // Set default dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    document.getElementById('start-date').valueAsDate = yesterday;
    document.getElementById('end-date').valueAsDate = today;
    document.getElementById('base-date').valueAsDate = today;
});