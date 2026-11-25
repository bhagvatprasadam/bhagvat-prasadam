import fs from 'fs';

const html = fs.readFileSync('scratch/product_html.html', 'utf8');

// Find all cdn URLs
const regex = /(?:https?:)?\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|webp|gif|svg)(?:\?[^\s"'<>]*)?/gi;
const matches = [...new Set(html.match(regex) || [])];
console.log('Total media URLs found:', matches.length);
matches.forEach(m => {
  if (!m.includes('avatar') && !m.includes('icon') && !m.includes('flags') && !m.includes('logo')) {
    console.log(m);
  }
});
