document.addEventListener('DOMContentLoaded', function() {
    // Get calculator option elements
    const diffOption = document.getElementById('diff-option');
    const addOption = document.getElementById('add-option');
    const convertOption = document.getElementById('convert-option');
    
    // Get calculator section elements
    const diffCalculator = document.getElementById('diff-calculator');
    const addCalculator = document.getElementById('add-calculator');
    const convertCalculator = document.getElementById('convert-calculator');
    
    // Get button elements
    const calculateDiffBtn = document.getElementById('calculate-diff-btn');
    const calculateAddBtn = document.getElementById('calculate-add-btn');
    const calculateConvertBtn = document.getElementById('calculate-convert-btn');
    
    // Get result element
    const timeResult = document.getElementById('time-result');
    
    // Get time format conversion elements
    const convertFrom = document.getElementById('convert-from');
    const hourInput12 = document.getElementById('12-hour-input');
    const hourInput24 = document.getElementById('24-hour-input');
    
    // Switch between calculator options
    diffOption.addEventListener('click', function() {
        diffOption.classList.add('active');
        addOption.classList.remove('active');
        convertOption.classList.remove('active');
        diffCalculator.classList.add('active');
        addCalculator.classList.remove('active');
        convertCalculator.classList.remove('active');
    });
    
    addOption.addEventListener('click', function() {
        addOption.classList.add('active');
        diffOption.classList.remove('active');
        convertOption.classList.remove('active');
        addCalculator.classList.add('active');
        diffCalculator.classList.remove('active');
        convertCalculator.classList.remove('active');
    });
    
    convertOption.addEventListener('click', function() {
        convertOption.classList.add('active');
        diffOption.classList.remove('active');
        addOption.classList.remove('active');
        convertCalculator.classList.add('active');
        diffCalculator.classList.remove('active');
        addCalculator.classList.remove('active');
    });
    
    // Toggle time input format based on selection
    convertFrom.addEventListener('change', function() {
        if (this.value === '12') {
            hourInput12.style.display = 'flex';
            hourInput24.style.display = 'none';
        } else {
            hourInput12.style.display = 'none';
            hourInput24.style.display = 'flex';
        }
    });
    
    // Calculate time difference
    calculateDiffBtn.addEventListener('click', function() {
        const startHours = parseInt(document.getElementById('start-hours').value);
        const startMinutes = parseInt(document.getElementById('start-minutes').value);
        const endHours = parseInt(document.getElementById('end-hours').value);
        const endMinutes = parseInt(document.getElementById('end-minutes').value);
        
        if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
            showError('Please enter valid time values');
            return;
        }
        
        if (startHours < 0 || startHours > 23 || startMinutes < 0 || startMinutes > 59 ||
            endHours < 0 || endHours > 23 || endMinutes < 0 || endMinutes > 59) {
            showError('Please enter valid time values (hours: 0-23, minutes: 0-59)');
            return;
        }
        
        // Calculate difference in minutes
        let startTotalMinutes = startHours * 60 + startMinutes;
        let endTotalMinutes = endHours * 60 + endMinutes;
        
        // Handle case where end time is on the next day
        if (endTotalMinutes < startTotalMinutes) {
            endTotalMinutes += 24 * 60; // Add 24 hours in minutes
        }
        
        const diffMinutes = endTotalMinutes - startTotalMinutes;
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        
        // Format the result
        let resultHTML = '<h3>Time Difference</h3>';
        
        resultHTML += `
            <p><i class="fas fa-clock"></i> Start time: <strong>${formatTime(startHours, startMinutes)}</strong></p>
            <p><i class="fas fa-clock"></i> End time: <strong>${formatTime(endHours, endMinutes)}</strong></p>
            <p><i class="fas fa-hourglass-half"></i> Time difference: <strong>${diffHours} hour${diffHours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}</strong></p>
            <p><i class="fas fa-calculator"></i> Total minutes: <strong>${diffMinutes}</strong></p>
        `;
        
        // Add additional information
        if (diffMinutes >= 60) {
            const hours12 = diffHours > 12 ? diffHours % 12 : (diffHours === 0 ? 12 : diffHours);
            const amPm = diffHours >= 12 ? 'PM' : 'AM';
            resultHTML += `<p><i class="fas fa-info-circle"></i> In 12-hour format: <strong>${hours12} hour${hours12 !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}</strong></p>`;
        }
        
        timeResult.innerHTML = resultHTML;
        animateResult();
    });
    
    // Calculate add/subtract time
    calculateAddBtn.addEventListener('click', function() {
        const baseHours = parseInt(document.getElementById('base-hours').value);
        const baseMinutes = parseInt(document.getElementById('base-minutes').value);
        const addHours = parseInt(document.getElementById('add-hours').value);
        const addMinutes = parseInt(document.getElementById('add-minutes').value);
        const operation = document.querySelector('input[name="time-operation"]:checked').value;
        
        if (isNaN(baseHours) || isNaN(baseMinutes) || isNaN(addHours) || isNaN(addMinutes)) {
            showError('Please enter valid time values');
            return;
        }
        
        if (baseHours < 0 || baseHours > 23 || baseMinutes < 0 || baseMinutes > 59) {
            showError('Please enter valid base time values (hours: 0-23, minutes: 0-59)');
            return;
        }
        
        // Calculate total minutes
        let baseTotalMinutes = baseHours * 60 + baseMinutes;
        const addTotalMinutes = addHours * 60 + addMinutes;
        
        // Perform operation
        let resultTotalMinutes;
        if (operation === 'add') {
            resultTotalMinutes = baseTotalMinutes + addTotalMinutes;
        } else {
            resultTotalMinutes = baseTotalMinutes - addTotalMinutes;
            
            // Handle negative result by adding 24 hours until positive
            while (resultTotalMinutes < 0) {
                resultTotalMinutes += 24 * 60;
            }
        }
        
        // Convert back to hours and minutes (24-hour format)
        const resultHours = Math.floor(resultTotalMinutes / 60) % 24;
        const resultMinutes = resultTotalMinutes % 60;
        
        // Format the result
        let resultHTML = '<h3>Time Calculation Result</h3>';
        
        resultHTML += `
            <p><i class="fas fa-clock"></i> Base time: <strong>${formatTime(baseHours, baseMinutes)}</strong></p>
            <p><i class="fas fa-calculator"></i> ${operation === 'add' ? 'Added' : 'Subtracted'}: <strong>${addHours} hour${addHours !== 1 ? 's' : ''} and ${addMinutes} minute${addMinutes !== 1 ? 's' : ''}</strong></p>
            <p><i class="fas fa-clock"></i> Result time: <strong>${formatTime(resultHours, resultMinutes)}</strong></p>
        `;
        
        // Add 12-hour format
        const hours12 = resultHours > 12 ? resultHours - 12 : (resultHours === 0 ? 12 : resultHours);
        const amPm = resultHours >= 12 ? 'PM' : 'AM';
        resultHTML += `<p><i class="fas fa-info-circle"></i> In 12-hour format: <strong>${hours12}:${resultMinutes.toString().padStart(2, '0')} ${amPm}</strong></p>`;
        
        timeResult.innerHTML = resultHTML;
        animateResult();
    });
    
    // Calculate time conversion
    calculateConvertBtn.addEventListener('click', function() {
        const convertFromFormat = document.getElementById('convert-from').value;
        let hours, minutes, amPm;
        
        if (convertFromFormat === '12') {
            hours = parseInt(document.getElementById('convert-hours').value);
            minutes = parseInt(document.getElementById('convert-minutes').value);
            amPm = document.getElementById('am-pm').value;
            
            if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
                showError('Please enter valid time values (hours: 1-12, minutes: 0-59)');
                return;
            }
            
            // Convert to 24-hour format
            let hours24 = hours;
            if (amPm === 'PM' && hours !== 12) {
                hours24 += 12;
            } else if (amPm === 'AM' && hours === 12) {
                hours24 = 0;
            }
            
            // Format the result
            let resultHTML = '<h3>Time Conversion Result</h3>';
            resultHTML += `
                <p><i class="fas fa-clock"></i> 12-hour format: <strong>${hours}:${minutes.toString().padStart(2, '0')} ${amPm}</strong></p>
                <p><i class="fas fa-exchange-alt"></i> 24-hour format: <strong>${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}</strong></p>
            `;
            
            timeResult.innerHTML = resultHTML;
        } else {
            hours = parseInt(document.getElementById('convert-hours-24').value);
            minutes = parseInt(document.getElementById('convert-minutes-24').value);
            
            if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                showError('Please enter valid time values (hours: 0-23, minutes: 0-59)');
                return;
            }
            
            // Convert to 12-hour format
            let hours12 = hours % 12;
            if (hours12 === 0) hours12 = 12;
            const amPm = hours >= 12 ? 'PM' : 'AM';
            
            // Format the result
            let resultHTML = '<h3>Time Conversion Result</h3>';
            resultHTML += `
                <p><i class="fas fa-clock"></i> 24-hour format: <strong>${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}</strong></p>
                <p><i class="fas fa-exchange-alt"></i> 12-hour format: <strong>${hours12}:${minutes.toString().padStart(2, '0')} ${amPm}</strong></p>
            `;
            
            timeResult.innerHTML = resultHTML;
        }
        
        animateResult();
    });
    
    // Helper function to show error
    function showError(message) {
        timeResult.innerHTML = `<div class="error">${message}</div>`;
    }
    
    // Helper function to format time
    function formatTime(hours, minutes) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Helper function to animate result
    function animateResult() {
        document.querySelector('.result-section').classList.add('active');
        setTimeout(() => {
            document.querySelector('.result-section').classList.remove('active');
        }, 1500);
    }
});