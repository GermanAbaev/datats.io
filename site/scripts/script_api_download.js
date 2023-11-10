document.addEventListener('DOMContentLoaded', function () {
    function downloadHTML() {
    const htmlContent = document.documentElement.outerHTML; // Get the entire HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dynamic-input-fields.html';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Add a click event listener to the "Download HTML" button
const downloadButton = document.getElementById('download-html');
downloadButton.addEventListener('click', downloadHTML);

});