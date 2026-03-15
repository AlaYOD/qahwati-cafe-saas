const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = 'C:\\Users\\alada\\.gemini\\antigravity\\brain\\1e9271ad-f950-4167-81d4-eb09ef1ce404\\.system_generated\\steps\\13\\output.txt';

const text = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(text);

const outDir = path.join(__dirname, 'stitch_screens');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

data.screens.forEach((screen, i) => {
    let title = screen.title || `screen_${i}`;
    title = title.replace(/ /g, '_').replace(/&/g, 'and');
    const url = screen.htmlCode.downloadUrl;
    
    const file = fs.createWriteStream(path.join(outDir, `${title}.html`));
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close();  // close() is async, call cb after close completes.
            console.log(`Downloaded ${title}`);
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(path.join(outDir, `${title}.html`), () => {});
        console.error(`Error downloading ${title}:`, err.message);
    });
});
