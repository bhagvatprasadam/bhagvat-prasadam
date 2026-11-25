const https = require('https');

https.get('https://bhagvatprasadam.com/', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('hero_KLjfmK');
    if (idx !== -1) {
      console.log('=== hero_KLjfmK HTML ===');
      console.log(data.slice(idx, idx + 2500));
    }

    const secGi = data.indexOf('section_GiE6mU');
    if (secGi !== -1) {
      console.log('=== section_GiE6mU HTML ===');
      console.log(data.slice(secGi, secGi + 2500));
    }
  });
});
