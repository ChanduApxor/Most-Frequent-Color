document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        processImage(img);
    };
});

document.getElementById('processUrlButton').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    if (!url) {
        return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Needed to handle CORS for image URLs from different origins
    img.src = url;
    img.onload = function() {
        processImage(img);
    };
});

function processImage(img) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorCounts = {};
    let maxCount = 0;
    let mostFrequentColor = '';

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Skip transparent pixels
        if (alpha === 0) {
            continue;
        }

        const rgb = `${r},${g},${b}`;
        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;

        if (colorCounts[rgb] > maxCount) {
            maxCount = colorCounts[rgb];
            mostFrequentColor = rgb;
        }
    }

    document.getElementById('mostFrequentColor').innerText = `Most Frequent Color: rgb(${mostFrequentColor})`;
    document.getElementById('mostFrequentColor').style.backgroundColor = `rgb(${mostFrequentColor})`;
}
