import fs from 'fs';

async function check() {
  try {
    const res = await fetch('https://bhagvatprasadam.com/products/mix-chavanu');
    const html = await res.text();
    fs.writeFileSync('scratch/product_html.html', html);
    
    // Look for image tags
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    const candidates = [];
    while ((match = regex.exec(html)) !== null) {
      const tag = match[0];
      const src = match[1];
      candidates.push({ tag, src });
    }
    console.log('Total img tags:', candidates.length);
    
    // Filter candidates
    const filtered = candidates.filter(c => 
      c.tag.toLowerCase().includes('shipping') || 
      c.tag.toLowerCase().includes('free') || 
      c.tag.toLowerCase().includes('celebration') ||
      c.tag.toLowerCase().includes('celerbration') ||
      c.tag.toLowerCase().includes('999') ||
      c.src.toLowerCase().includes('banner') ||
      c.tag.toLowerCase().includes('product-form') ||
      c.tag.toLowerCase().includes('custom')
    );
    console.log('Filtered img matches:', filtered);
    
    // Also look for block in product form
    const formIdx = html.indexOf('product-form');
    if (formIdx !== -1) {
      console.log('Product form snippet:');
      console.log(html.substring(formIdx, formIdx + 3000));
    }
  } catch (err) {
    console.error(err);
  }
}

check();
