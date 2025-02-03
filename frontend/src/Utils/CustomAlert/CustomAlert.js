import "./CustomAlert.css";

export const CustomAlert = (message) => {
    // Remove existing alert if any
    const existingAlert = document.getElementById("custom-alert");
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert container
    const customAlert = document.createElement("div");
    customAlert.id = "custom-alert";
    customAlert.innerHTML = `
        <p>ServiceXchange says: ${message}</p>
        <button onclick="document.getElementById('custom-alert').remove()">OK</button>
    `;

    // Apply styles from CSS file
    document.body.appendChild(customAlert);

    // Auto-remove after 5 seconds if the user doesn't click "OK"
    setTimeout(() => {
        if (document.body.contains(customAlert)) {
            customAlert.remove();
        }
    }, 5000);
};
