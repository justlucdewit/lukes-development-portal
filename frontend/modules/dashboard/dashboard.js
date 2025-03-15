console.log("script loaded");

// Get current date and time
currentDate = new Date();

// Set the correct time of day
timeIndication = "";
currentHour = currentDate.getHours();
if (currentHour >= 5 && currentHour < 12) {
    timeIndication = "morning";
} else if (currentHour >= 12 && currentHour < 18) {
    timeIndication = "afternoon";
} else {
    timeIndication = "evening";
}

// Update the time indication
document.getElementById("time_indication").innerText = timeIndication;

// Set the current date in "DD / MM / YYYY" format
day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
year = currentDate.getFullYear();
formattedDate = `${day}/${month}/${year}`;

// Update the date
document.getElementById("date").innerText = formattedDate;
document.getElementById("name").innerText = userdata.name;
