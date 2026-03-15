/* ============================================
   iSeekBlinds Product Configurator Engine
   Usage: initConfigurator(config)
   ============================================ */

function initConfigurator(config) {
  const container = document.getElementById('configurator');
  if (!container) return;

  // State
  const state = {
    width: config.defaultWidth || 900,
    drop: config.defaultDrop || 1200,
    selectedType: 0,       // index into config.types
    selectedColor: 0,      // index into current type's colors
    selectedOptions: {},    // keyed by option group id
  };

  // Initialize default selections for option groups
  if (config.optionGroups) {
    config.optionGroups.forEach(group => {
      state.selectedOptions[group.id] = 0;
    });
  }

  // --- Build HTML ---
  container.innerHTML = buildConfiguratorHTML(config, state);

  // --- Bind Events ---
  bindEvents(config, state, container);

  // Initial render
  updatePrice(config, state, container);
  updatePreview(config, state, container);
}

function buildConfiguratorHTML(config, state) {
  let stepNum = 1;

  let html = `
    <div class="configurator-layout">
      <!-- Preview Panel -->
      <div class="cfg-preview-panel">
        <div class="cfg-preview-window">
          <div class="cfg-preview-frame">
            <div class="cfg-preview-wall">
              <div class="cfg-preview-blind" id="cfgPreviewBlind"></div>
            </div>
            <div class="cfg-preview-label">
              <span class="cfg-preview-dims" id="cfgPreviewDims">${state.width}mm × ${state.drop}mm</span>
              <br><span id="cfgPreviewDesc">${config.types[0].name}</span>
            </div>
          </div>
        </div>
        ${config.productImage ? `<img src="${config.productImage}" alt="${config.productName}" class="cfg-preview-image" loading="lazy">` : ''}
      </div>

      <!-- Options Panel -->
      <div class="cfg-options-panel">
        <!-- Dimensions -->
        <div class="cfg-group">
          <div class="cfg-group-label">
            <span class="cfg-step-num">${stepNum++}</span>
            ${config.dimensionLabel || 'Choose Your Size'}
          </div>
          <div class="cfg-dimensions">
            <div class="cfg-dim-input">
              <span class="cfg-dim-label">Width</span>
              <div class="cfg-dim-field">
                <input type="number" id="cfgWidth" value="${state.width}" min="${config.minWidth || 300}" max="${config.maxWidth || 3600}" step="10">
                <span class="cfg-dim-unit">mm</span>
              </div>
              <input type="range" class="cfg-slider" id="cfgWidthSlider" value="${state.width}" min="${config.minWidth || 300}" max="${config.maxWidth || 3600}" step="10">
            </div>
            <div class="cfg-dim-input">
              <span class="cfg-dim-label">${config.dropLabel || 'Drop / Height'}</span>
              <div class="cfg-dim-field">
                <input type="number" id="cfgDrop" value="${state.drop}" min="${config.minDrop || 300}" max="${config.maxDrop || 3600}" step="10">
                <span class="cfg-dim-unit">mm</span>
              </div>
              <input type="range" class="cfg-slider" id="cfgDropSlider" value="${state.drop}" min="${config.minDrop || 300}" max="${config.maxDrop || 3600}" step="10">
            </div>
          </div>
        </div>

        <!-- Type / Fabric Selection -->
        <div class="cfg-group">
          <div class="cfg-group-label">
            <span class="cfg-step-num">${stepNum++}</span>
            ${config.typeLabel || 'Select Fabric Type'}
          </div>
          <div class="cfg-option-btns" id="cfgTypeButtons">
            ${config.types.map((t, i) => `
              <button class="cfg-option-btn${i === 0 ? ' active' : ''}" data-type-idx="${i}">
                ${t.name}
                ${t.priceLabel ? `<span class="btn-subtitle">${t.priceLabel}</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Colors -->
        <div class="cfg-group">
          <div class="cfg-group-label">
            <span class="cfg-step-num">${stepNum++}</span>
            Choose Your Colour
          </div>
          <div class="cfg-swatches" id="cfgSwatches">
            ${buildSwatches(config.types[0].colors, 0)}
          </div>
        </div>

        <!-- Dynamic Option Groups -->
        ${(config.optionGroups || []).map(group => `
          <div class="cfg-group">
            <div class="cfg-group-label">
              <span class="cfg-step-num">${stepNum++}</span>
              ${group.label}
            </div>
            <div class="cfg-option-btns" id="cfgGroup_${group.id}">
              ${group.options.map((opt, i) => `
                <button class="cfg-option-btn${i === 0 ? ' active' : ''}" data-group="${group.id}" data-opt-idx="${i}">
                  ${opt.name}
                  ${opt.priceLabel ? `<span class="btn-subtitle">${opt.priceLabel}</span>` : ''}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <!-- Price Summary -->
        <div class="cfg-group" style="border-bottom:none;">
          <div class="cfg-price-summary" id="cfgPriceSummary">
            <div class="cfg-price-row">
              <span id="cfgPriceTypeLabel">${config.types[0].name}</span>
              <span id="cfgPriceBase">$${config.types[0].basePrice}</span>
            </div>
            <div id="cfgPriceAddons"></div>
            <div class="cfg-price-total">
              <span class="cfg-price-total-label">Estimated Price</span>
              <span class="cfg-price-total-value" id="cfgPriceTotal">$0</span>
            </div>
            <p class="cfg-price-note">* Estimate only. Final price confirmed after professional measure. Prices include GST.</p>
          </div>
          <button class="cfg-quote-btn" id="cfgQuoteBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Get Free Quote with These Specs
          </button>
          <p class="cfg-or-call">or call <a href="tel:0400000000">0400 000 000</a> for instant help</p>
        </div>
      </div>
    </div>

    <!-- Quote Modal -->
    <div class="cfg-modal-overlay" id="cfgModal">
      <div class="cfg-modal">
        <div class="cfg-modal-header">
          <h3>Get Your Free Quote</h3>
          <button class="cfg-modal-close" id="cfgModalClose">✕</button>
        </div>
        <div class="cfg-modal-body">
          <div class="cfg-modal-summary" id="cfgModalSummary"></div>
          <form class="cfg-modal-form" id="cfgQuoteForm">
            <label>Your Name
              <input type="text" name="name" required placeholder="Full name">
            </label>
            <label>Email
              <input type="email" name="email" required placeholder="your@email.com">
            </label>
            <label>Phone
              <input type="tel" name="phone" required placeholder="04XX XXX XXX">
            </label>
            <label>Additional Notes (optional)
              <textarea name="notes" placeholder="Any special requirements, room details, etc."></textarea>
            </label>
            <button type="submit" class="cfg-submit-btn">Submit Quote Request</button>
          </form>
        </div>
      </div>
    </div>
  `;

  return html;
}

function buildSwatches(colors, activeIdx) {
  return colors.map((c, i) => `
    <div class="cfg-swatch${i === activeIdx ? ' active' : ''}" data-color-idx="${i}" data-color="${c.hex}">
      <div class="cfg-swatch-circle" style="background:${c.hex};"></div>
      <span class="cfg-swatch-name">${c.name}</span>
    </div>
  `).join('');
}

function bindEvents(config, state, container) {
  // Width input + slider
  const widthInput = container.querySelector('#cfgWidth');
  const widthSlider = container.querySelector('#cfgWidthSlider');
  const dropInput = container.querySelector('#cfgDrop');
  const dropSlider = container.querySelector('#cfgDropSlider');

  function syncWidth(val) {
    val = clamp(val, config.minWidth || 300, config.maxWidth || 3600);
    state.width = val;
    widthInput.value = val;
    widthSlider.value = val;
    updatePrice(config, state, container);
    updatePreview(config, state, container);
  }

  function syncDrop(val) {
    val = clamp(val, config.minDrop || 300, config.maxDrop || 3600);
    state.drop = val;
    dropInput.value = val;
    dropSlider.value = val;
    updatePrice(config, state, container);
    updatePreview(config, state, container);
  }

  widthInput.addEventListener('input', () => syncWidth(parseInt(widthInput.value) || 300));
  widthSlider.addEventListener('input', () => syncWidth(parseInt(widthSlider.value)));
  dropInput.addEventListener('input', () => syncDrop(parseInt(dropInput.value) || 300));
  dropSlider.addEventListener('input', () => syncDrop(parseInt(dropSlider.value)));

  // Type buttons
  container.querySelector('#cfgTypeButtons').addEventListener('click', (e) => {
    const btn = e.target.closest('.cfg-option-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.typeIdx);
    state.selectedType = idx;
    state.selectedColor = 0;
    container.querySelectorAll('#cfgTypeButtons .cfg-option-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });
    // Rebuild swatches
    container.querySelector('#cfgSwatches').innerHTML = buildSwatches(config.types[idx].colors, 0);
    bindSwatchEvents(config, state, container);
    updatePrice(config, state, container);
    updatePreview(config, state, container);
  });

  // Swatches
  bindSwatchEvents(config, state, container);

  // Option groups
  (config.optionGroups || []).forEach(group => {
    const groupEl = container.querySelector(`#cfgGroup_${group.id}`);
    if (!groupEl) return;
    groupEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.cfg-option-btn');
      if (!btn) return;
      const idx = parseInt(btn.dataset.optIdx);
      state.selectedOptions[group.id] = idx;
      groupEl.querySelectorAll('.cfg-option-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
      updatePrice(config, state, container);
      updatePreview(config, state, container);
    });
  });

  // Quote button
  container.querySelector('#cfgQuoteBtn').addEventListener('click', () => {
    openQuoteModal(config, state, container);
  });

  // Modal close
  container.querySelector('#cfgModalClose').addEventListener('click', () => {
    container.querySelector('#cfgModal').classList.remove('open');
  });

  container.querySelector('#cfgModal').addEventListener('click', (e) => {
    if (e.target === container.querySelector('#cfgModal')) {
      container.querySelector('#cfgModal').classList.remove('open');
    }
  });

  // Quote form
  container.querySelector('#cfgQuoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! We\'ll contact you within 24 hours with your personalised quote.');
    container.querySelector('#cfgModal').classList.remove('open');
    e.target.reset();
  });
}

function bindSwatchEvents(config, state, container) {
  const swatchContainer = container.querySelector('#cfgSwatches');
  swatchContainer.addEventListener('click', (e) => {
    const swatch = e.target.closest('.cfg-swatch');
    if (!swatch) return;
    const idx = parseInt(swatch.dataset.colorIdx);
    state.selectedColor = idx;
    swatchContainer.querySelectorAll('.cfg-swatch').forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    updatePreview(config, state, container);
  });
}

function updatePrice(config, state, container) {
  const type = config.types[state.selectedType];
  const areaMm2 = state.width * state.drop;
  let price = type.basePrice + (areaMm2 * (type.ratePerMm2 || 0));

  const addonsEl = container.querySelector('#cfgPriceAddons');
  let addonsHTML = '';

  // Add option group addons
  (config.optionGroups || []).forEach(group => {
    const opt = group.options[state.selectedOptions[group.id] || 0];
    if (opt.priceAddon) {
      price += opt.priceAddon;
      addonsHTML += `<div class="cfg-price-row"><span>${opt.name}</span><span>+$${opt.priceAddon}</span></div>`;
    }
  });

  addonsEl.innerHTML = addonsHTML;
  container.querySelector('#cfgPriceTypeLabel').textContent = type.name;
  container.querySelector('#cfgPriceBase').textContent = `$${type.basePrice}`;
  container.querySelector('#cfgPriceTotal').textContent = `$${Math.round(price)}`;
}

function updatePreview(config, state, container) {
  const type = config.types[state.selectedType];
  const color = type.colors[state.selectedColor];
  const blind = container.querySelector('#cfgPreviewBlind');
  const dims = container.querySelector('#cfgPreviewDims');
  const desc = container.querySelector('#cfgPreviewDesc');

  // Update color
  blind.style.setProperty('--preview-color', color.hex);
  blind.style.background = color.hex;

  // Update aspect ratio based on width/drop
  const ratio = state.width / state.drop;
  blind.style.setProperty('--preview-ratio', ratio);
  blind.style.aspectRatio = `${state.width} / ${state.drop}`;

  // Update text
  dims.textContent = `${state.width}mm × ${state.drop}mm`;

  let descParts = [type.name, color.name];
  (config.optionGroups || []).forEach(group => {
    const opt = group.options[state.selectedOptions[group.id] || 0];
    descParts.push(opt.name);
  });
  desc.textContent = descParts.join(' · ');
}

function openQuoteModal(config, state, container) {
  const type = config.types[state.selectedType];
  const color = type.colors[state.selectedColor];
  const price = container.querySelector('#cfgPriceTotal').textContent;

  let summary = `<strong>${config.productName}</strong><br>`;
  summary += `${type.name} — ${color.name}<br>`;
  summary += `Size: ${state.width}mm × ${state.drop}mm<br>`;

  (config.optionGroups || []).forEach(group => {
    const opt = group.options[state.selectedOptions[group.id] || 0];
    summary += `${group.label}: ${opt.name}<br>`;
  });

  summary += `<br>Estimated price: <strong>${price}</strong>`;

  container.querySelector('#cfgModalSummary').innerHTML = summary;
  container.querySelector('#cfgModal').classList.add('open');
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
