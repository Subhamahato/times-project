document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('timeClock');
    const ctx = canvas.getContext('2d');
    const currentTimeDiv = document.getElementById('currentTime');
    
    let dpr = window.devicePixelRatio || 1; // Get the device's pixel ratio
    
    function setCanvasDimensions() {
        // Get the CSS computed dimensions of the canvas
        const canvasDisplayWidth = canvas.clientWidth;
        const canvasDisplayHeight = canvas.clientHeight;
        
        // Set the canvas's internal drawing buffer dimensions to be high-resolution
        canvas.width = canvasDisplayWidth * dpr;
        canvas.height = canvasDisplayHeight * dpr;
        
        // Scale the context. All drawing operations will now be implicitly scaled up
        ctx.scale(dpr, dpr);
    }
    
    // Initial setting of canvas dimensions
    setCanvasDimensions();
    
    
    // Function to map an hour (0-23) to a radian angle
    // 12 AM (0 or 24) is at the top (12 o'clock position: -Math.PI/2)
    // As hours increase, angle increases clockwise.
    // Angle per hour: (2 * Math.PI) / 24
    const mapHourToAngle = (hour) => {
        const angleOffset = -Math.PI / 2; // Offset to start 12 AM at the top
        return angleOffset + (hour / 24) * (2 * Math.PI);
    };
    
    function updateClock() {
        // Recalculate dimensions and radii based on current CSS size
        const canvasDisplayWidth = canvas.clientWidth;
        const canvasDisplayHeight = canvas.clientHeight;
        
        const centerX = canvasDisplayWidth / 2;
        const centerY = canvasDisplayHeight / 2;
        const outerRadius = Math.min(centerX, centerY) - (canvasDisplayWidth * 0.01); // Adjust padding based on size
        const outerRingThickness = outerRadius * 0.1; // Make thickness a percentage of radius
        const innerRadius = outerRadius - outerRingThickness;
        
        // Define colors
        const dayColor = '#87CEEB'; // SkyBlue
        const nightColor = '#191970'; // MidnightBlue
        const spentTimeColor = '#FFD700'; // Gold
        const remainingTimeColor = '#D0D0D0'; // Slightly darker grey for contrast
        const hourLineColor = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white for lines
        const indicatorColor = 'red'; // For the current time line
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const currentFractionalHour = hours + minutes / 60 + seconds / 3600;
        const currentTimeAngle = mapHourToAngle(currentFractionalHour);
        
        // Clear canvas (clears the high-resolution buffer)
        // Use logical dimensions for clearRect
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        
        // --- 1. Draw Spent Time and Remaining Time (as full inner pie) ---
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, mapHourToAngle(0), currentTimeAngle);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = spentTimeColor;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, currentTimeAngle, mapHourToAngle(24));
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = remainingTimeColor;
        ctx.fill();
        
        // --- 2. Draw Day and Night Outer Ring (Annulus) ---
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, mapHourToAngle(6), mapHourToAngle(18));
        ctx.arc(centerX, centerY, innerRadius, mapHourToAngle(18), mapHourToAngle(6), true); // Inner arc (counter-clockwise)
        ctx.closePath();
        ctx.fillStyle = dayColor;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, mapHourToAngle(18), mapHourToAngle(6) + 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, mapHourToAngle(6) + 2 * Math.PI, mapHourToAngle(18), true); // Inner arc (counter-clockwise)
        ctx.closePath();
        ctx.fillStyle = nightColor;
        ctx.fill();
        
        // --- 3. Draw Hour Lines ---
        ctx.strokeStyle = hourLineColor;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 24; i++) {
            const angle = mapHourToAngle(i);
            const x1 = centerX + innerRadius * Math.cos(angle);
            const y1 = centerY + innerRadius * Math.sin(angle);
            const x2 = centerX + outerRadius * Math.cos(angle);
            const y2 = centerY + outerRadius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // --- 4. Draw Current Time Indicator ---
        ctx.strokeStyle = indicatorColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + innerRadius * Math.cos(currentTimeAngle), centerY + innerRadius * Math.sin(currentTimeAngle));
        ctx.stroke();
        
        const indicatorDotRadius = Math.min(5, outerRadius * 0.02); // Make dot size responsive
        ctx.beginPath();
        ctx.arc(centerX, centerY, indicatorDotRadius, 0, 2 * Math.PI);
        ctx.fillStyle = indicatorColor;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + outerRadius * Math.cos(currentTimeAngle), centerY + outerRadius * Math.sin(currentTimeAngle), indicatorDotRadius, 0, 2 * Math.PI);
        ctx.fillStyle = indicatorColor;
        ctx.fill();
        
        ctx.strokeStyle = indicatorColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + innerRadius * Math.cos(currentTimeAngle), centerY + innerRadius * Math.sin(currentTimeAngle));
        ctx.lineTo(centerX + outerRadius * Math.cos(currentTimeAngle), centerY + outerRadius * Math.sin(currentTimeAngle));
        ctx.stroke();
    }
    
    function updateTimeDisplay() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        currentTimeDiv.textContent = `Current Time: ${now.toLocaleTimeString('en-US', options)}`;
    }
    
    // Initial update
    updateClock();
    updateTimeDisplay();
    
    // Update every second
    setInterval(() => {
        updateClock();
        updateTimeDisplay();
    }, 1000);
    
    // Debounce function for resize event
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newDpr = window.devicePixelRatio || 1;
            if (newDpr !== dpr) {
                dpr = newDpr; // Update DPR
                setCanvasDimensions(); // Re-set canvas dimensions for new DPR
            }
            updateClock(); // Redraw clock
        }, 250); // Debounce for 250ms
    });
});
