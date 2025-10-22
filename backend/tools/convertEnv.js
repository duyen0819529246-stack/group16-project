const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
try {
  const raw = fs.readFileSync(envPath);
  // detect BOM for UTF-16 LE (0xFF 0xFE)
  if (raw[0] === 0xFF && raw[1] === 0xFE) {
    console.log('Detected UTF-16 LE BOM, converting to UTF-8...');
    const txt = raw.toString('utf16le');
    fs.writeFileSync(envPath, txt, { encoding: 'utf8' });
    console.log('Converted .env to UTF-8 successfully.');
  } else {
    console.log('No UTF-16 LE BOM detected. No change made.');
  }
} catch (err) {
  console.error('Failed to convert .env:', err.message);
  process.exit(1);
}
