const slugs = [
  'mohanthal',
  'kaju-katli',
  'gau-dham-traditional-desi-cow-ghee',
  'groundnut-oil',
  'banana-mari-wafer',
  'dry-fruits-chikki'
];

async function check() {
  for (const s of slugs) {
    try {
      const res = await fetch('https://bhagvatprasadam.com/products/' + s);
      const text = await res.text();
      const imgs = [...text.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
      for (const m of imgs) {
        const src = m[1];
        if (src.includes('files/') && !src.includes('webp') && !src.includes('icon')) {
          console.log(s, src);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}
check();
