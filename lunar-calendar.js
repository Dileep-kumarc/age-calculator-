document.addEventListener('DOMContentLoaded', function() {
    // Get calculator elements
    const lunarOption = document.getElementById('lunar-option');
    const lunarCalculator = document.getElementById('lunar-calculator');
    const calculateLunarBtn = document.getElementById('calculate-lunar-btn');
    const lunarResult = document.getElementById('lunar-result');

    // Lunar calendar conversion constants
    const LUNAR_MONTHS = [
        'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth',
        'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'
    ];

    const CHINESE_ZODIAC = [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ];

    // Switch to lunar calculator
    lunarOption.addEventListener('click', function() {
        document.querySelectorAll('.calculator-option').forEach(opt => opt.classList.remove('active'));
        document.querySelectorAll('.calculator-section').forEach(sect => sect.classList.remove('active'));
        lunarOption.classList.add('active');
        lunarCalculator.classList.add('active');
    });

    // Calculate lunar date
    calculateLunarBtn.addEventListener('click', function() {
        const solarDate = new Date(document.getElementById('solar-date').value);

        if (isNaN(solarDate.getTime())) {
            showError('Please enter a valid date');
            return;
        }

        // Calculate lunar date (simplified calculation for demonstration)
        const year = solarDate.getFullYear();
        const lunarYear = calculateLunarYear(year);
        const lunarMonth = calculateLunarMonth(solarDate);
        const lunarDay = calculateLunarDay(solarDate);

        // Get Chinese zodiac sign
        const zodiacSign = CHINESE_ZODIAC[(year - 4) % 12];

        // Format the result
        let resultHTML = '<h3>Lunar Calendar Conversion</h3>';
        resultHTML += `
            <p><i class="fas fa-sun"></i> Solar Date: <strong>${formatDate(solarDate)}</strong></p>
            <p><i class="fas fa-moon"></i> Lunar Date: <strong>${LUNAR_MONTHS[lunarMonth-1]} Month, ${lunarDay}th Day, ${lunarYear}</strong></p>
            <p><i class="fas fa-dragon"></i> Chinese Zodiac: <strong>${zodiacSign}</strong></p>
        `;

        lunarResult.innerHTML = resultHTML;
        animateResult();
    });

    // Helper function to calculate lunar year
    function calculateLunarYear(solarYear) {
        // Simplified calculation (actual lunar calendar conversion is more complex)
        return solarYear;
    }

    // Helper function to calculate lunar month
    function calculateLunarMonth(solarDate) {
        // Simplified calculation (actual lunar calendar conversion is more complex)
        return ((solarDate.getMonth() + 1) % 12) + 1;
    }

    // Helper function to calculate lunar day
    function calculateLunarDay(solarDate) {
        // Simplified calculation (actual lunar calendar conversion is more complex)
        return ((solarDate.getDate() - 1) % 29) + 1;
    }

    // Helper function to show error
    function showError(message) {
        lunarResult.innerHTML = `<div class="error">${message}</div>`;
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