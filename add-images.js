const fs = require('fs');
const path = require('path');

const BASE = __dirname;

const URLS = {
  hero: {
    index: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=80",
    "roller-blinds": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1400&q=80",
    curtains: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
    "plantation-shutters": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
    "venetian-blinds": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=80",
    "honeycomb-blinds": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80",
    motorised: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=80",
    about: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
    gallery: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80"
  },
  products: {
    roller: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
    curtains: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    shutters: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    venetian: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    honeycomb: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    motorised: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"
  },
  gallery: [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80",
    "https://images.unsplash.com/photo-1616137466211-f73a09ec33fb?w=600&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
  ],
  landing: {
    "acoustic-solutions": "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80",
    "apartment-solutions": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    "bathroom-kitchen": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
    "bedroom-blackout": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
    "blinds-vs-curtains": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    "care-maintenance": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
    "child-safety": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80",
    "colour-trends-2026": "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80",
    "commercial-blinds": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    "day-night-blinds": "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    "design-inspiration": "https://images.unsplash.com/photo-1616137466211-f73a09ec33fb?w=1200&q=80",
    "eco-friendly": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "energy-efficient": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    "free-samples": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
    "heritage-homes": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "home-office": "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200&q=80",
    "hospitality-blinds": "https://images.unsplash.com/photo-1590490360182-c33d955e5d31?w=1200&q=80",
    "large-windows": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    "layered-treatments": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    "media-room": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80",
    "melbourne-service-areas": "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1200&q=80",
    "new-home-packages": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    "outdoor-blinds": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    "pet-friendly": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80",
    "property-styling": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    "rental-property": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    "seasonal-sale": "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    "skylight-blinds": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "smart-home": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
    "testimonials": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
  }
};

let changed = 0;

function updateFile(filePath, transformer) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = transformer(content, filePath);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    changed++;
    console.log(`✅ Updated: ${path.relative(BASE, filePath)}`);
  } else {
    console.log(`⏭️  No change: ${path.relative(BASE, filePath)}`);
  }
}

// === INDEX.HTML ===
updateFile(path.join(BASE, 'index.html'), (html) => {
  // Replace hero background image
  html = html.replace(
    /(<section\s+class="hero"\s+style="background-image:\s*url\(')[^']*('\))/,
    `$1${URLS.hero.index}$2`
  );

  // Replace product card images - map by alt text
  const productMap = {
    'Roller Blinds': URLS.products.roller,
    'Curtains': URLS.products.curtains,
    'Plantation Shutters': URLS.products.shutters,
    'Venetian Blinds': URLS.products.venetian,
    'Honeycomb Blinds': URLS.products.honeycomb,
    'Motorised Solutions': URLS.products.motorised
  };
  for (const [alt, url] of Object.entries(productMap)) {
    const regex = new RegExp(`(<img\\s+src=")[^"]*("\\s+alt="${alt}")`);
    html = html.replace(regex, `$1${url}$2`);
  }

  // Replace showroom image
  html = html.replace(
    /(<img\s+src=")[^"]*("\s+alt="iSeekBlinds showroom")/,
    `$1${URLS.hero.about}$2`
  );

  return html;
});

// === PRODUCT PAGES ===
const productHeroMap = {
  'roller-blinds.html': URLS.hero['roller-blinds'],
  'curtains.html': URLS.hero.curtains,
  'plantation-shutters.html': URLS.hero['plantation-shutters'],
  'venetian-blinds.html': URLS.hero['venetian-blinds'],
  'honeycomb-blinds.html': URLS.hero['honeycomb-blinds'],
  'motorised.html': URLS.hero.motorised
};

for (const [file, url] of Object.entries(productHeroMap)) {
  const filePath = path.join(BASE, 'products', file);
  if (!fs.existsSync(filePath)) continue;
  updateFile(filePath, (html) => {
    // Replace product-hero background-image url
    html = html.replace(
      /(<section\s+class="product-hero"\s+style="background-image:\s*url\(')[^']*('\))/,
      `$1${url}$2`
    );
    return html;
  });
}

// === GALLERY.HTML ===
updateFile(path.join(BASE, 'gallery.html'), (html) => {
  // Replace hero if present
  html = html.replace(
    /(<section\s+class="[^"]*hero[^"]*"\s+style="background-image:\s*url\(')[^']*('\))/,
    `$1${URLS.hero.gallery}$2`
  );

  // Replace gallery card images - match each img src inside gallery-image divs
  let galleryIdx = 0;
  html = html.replace(
    /(<div class="gallery-image"><img src=")[^"]*(" alt=")/g,
    (match, p1, p2) => {
      const url = URLS.gallery[galleryIdx % URLS.gallery.length];
      galleryIdx++;
      return `${p1}${url}${p2}`;
    }
  );

  return html;
});

// === ABOUT.HTML ===
const aboutPath = path.join(BASE, 'about.html');
if (fs.existsSync(aboutPath)) {
  updateFile(aboutPath, (html) => {
    // Try to replace hero background
    html = html.replace(
      /(<section\s+class="[^"]*hero[^"]*"\s+style="background-image:\s*url\(')[^']*('\))/,
      `$1${URLS.hero.about}$2`
    );
    // Also replace any local images in about page
    html = html.replace(
      /src="images\/hero\/[^"]*"/g,
      `src="${URLS.hero.about}"`
    );
    return html;
  });
}

// === LANDING PAGES ===
const landingDir = path.join(BASE, 'landing');
const landingFiles = fs.readdirSync(landingDir).filter(f => f.endsWith('.html'));

for (const file of landingFiles) {
  const slug = file.replace('.html', '');
  const url = URLS.landing[slug];
  if (!url) {
    console.log(`⚠️  No URL mapping for landing/${file}`);
    continue;
  }

  const filePath = path.join(landingDir, file);
  updateFile(filePath, (html) => {
    // Landing pages have various hero class prefixes. Find the hero section with inline style
    // Pattern: style="background-image: linear-gradient(...), url('...')..." or style="background-image: url('...')"
    
    // Find the hero section line and replace the url('...') in it
    // Landing pages have patterns like: class="XX-hero" or class="hero-XX"
    const heroRegex = /(<section\s+class="(?:[a-z]+-hero|hero-[a-z]+)"\s+style="[^"]*?url\(')([^']*)('\))/;
    html = html.replace(heroRegex, `$1${url}$3`);

    // For landing pages that have background-image in their <style> block
    // Match .XX-hero { ... background-image: url('...') pattern
    const heroClassMatch = html.match(/class="([a-z]+-hero)"/);
    if (heroClassMatch) {
      const heroClass = heroClassMatch[1];
      const cssRegex = new RegExp(
        `(\\.${heroClass.replace('-', '\\-')}\\s*\\{[^}]*background-image:\\s*url\\(')[^']*('\\))`,
        'i'
      );
      html = html.replace(cssRegex, `$1${url}$2`);
    }

    return html;
  });
}

// === OTHER PAGES (contact, faq, free-quote) - replace any local hero images ===
for (const file of ['contact.html', 'faq.html', 'free-quote.html']) {
  const filePath = path.join(BASE, file);
  if (!fs.existsSync(filePath)) continue;
  updateFile(filePath, (html) => {
    html = html.replace(
      /(<section\s+class="[^"]*hero[^"]*"\s+style="background-image:\s*url\(')[^']*('\))/,
      `$1${URLS.hero.index}$2`
    );
    return html;
  });
}

console.log(`\n🎉 Done! Updated ${changed} files.`);
