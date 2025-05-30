document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const calendarHeader = document.getElementById('calendar-header');
    const pageHeading = calendarHeader.querySelector('h1'); // Get the H1 inside the header
    let currentDisplayYear;

    const today = new Date();
    const actualCurrentYear = today.getFullYear();
    const actualCurrentMonth = today.getMonth(); // 0-indexed
    const actualCurrentDay = today.getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create navigation buttons and year display *once*
    const navContainer = document.createElement('div');
    navContainer.classList.add('calendar-nav');

    const prevYearBtn = document.createElement('button');
    prevYearBtn.id = 'prevYear';
    prevYearBtn.textContent = 'Previous Year';
    navContainer.appendChild(prevYearBtn);

    const displayYearSpan = document.createElement('span');
    displayYearSpan.id = 'display-year';
    displayYearSpan.classList.add('display-year-text');
    navContainer.appendChild(displayYearSpan);

    const nextYearBtn = document.createElement('button');
    nextYearBtn.id = 'nextYear';
    nextYearBtn.textContent = 'Next Year';
    navContainer.appendChild(nextYearBtn);

    // Insert the nav container *before* the h1 in the header
    calendarHeader.insertBefore(navContainer, pageHeading);

    // Function to generate the calendar for a given year
    function generateCalendar(year) {
        calendarElement.innerHTML = ''; // Clear previous calendar
        currentDisplayYear = year; // Set the current displayed year

        // Update the header year text
        displayYearSpan.textContent = year;
        pageHeading.textContent = `${year} Calendar`; // Update the main H1 too

        for (let i = 0; i < 12; i++) {
            const monthDiv = document.createElement('div');
            monthDiv.classList.add('month');

            const monthName = monthNames[i];
            const h3 = document.createElement('h3');
            h3.textContent = `${monthName}`; // Month name only in h3, year in header
            monthDiv.appendChild(h3);

            const daysContainer = document.createElement('div');
            daysContainer.classList.add('days');

            // Add day names (Sun, Mon, Tue, etc.)
            dayNamesShort.forEach(dayName => {
                const dayNameDiv = document.createElement('div');
                dayNameDiv.classList.add('day-name');
                dayNameDiv.textContent = dayName;
                daysContainer.appendChild(dayNameDiv);
            });

            // Get the first day of the month and number of days in the month
            const firstDayOfMonth = new Date(year, i, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
            const daysInMonth = new Date(year, i + 1, 0).getDate();

            // Add empty divs for the days before the 1st of the month
            for (let j = 0; j < firstDayOfMonth; j++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.classList.add('day', 'empty');
                daysContainer.appendChild(emptyDiv);
            }

            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day');
                dayDiv.textContent = day;

                const currentDateInLoop = new Date(year, i, day);

                // Highlight progress:
                // Only for the current *actual* year (the year today is in),
                // and if the day in loop is <= actual current date.
                // This ensures progress is only shown for the year "today" is in.
                if (year === actualCurrentYear && currentDateInLoop.getTime() <= today.getTime()) {
                    dayDiv.classList.add('progress-gone');
                }

                // Highlight the actual current day
                if (year === actualCurrentYear && i === actualCurrentMonth && day === actualCurrentDay) {
                    dayDiv.classList.add('current-day');
                }

                daysContainer.appendChild(dayDiv);
            }

            monthDiv.appendChild(daysContainer);
            calendarElement.appendChild(monthDiv);
        }
    }

    // Initialize the calendar with the actual current year
    generateCalendar(actualCurrentYear);

    // Event Listeners for navigation buttons
    prevYearBtn.addEventListener('click', () => {
        generateCalendar(currentDisplayYear - 1);
    });

    nextYearBtn.addEventListener('click', () => {
        generateCalendar(currentDisplayYear + 1);
    });
});
