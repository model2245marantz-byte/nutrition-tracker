// ============================================================
// NutriTrack - Main Application
// ============================================================

const DAILY_TARGETS = {
  calories: 2950,
  protein: 183,
  carbs: 350,
  fat: 90,
  fiber: 38,
  sodium: 1500,
};

// ============================================================
// Supabase Client
// ============================================================

const SUPABASE_URL = 'https://vitsincshpzqbdnkzxsz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EMRGr-0ADLo_LfmbIDdMLw_Axt8Cc_T';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// State
// ============================================================

let meals = [];          // All meals, persisted
let customProducts = []; // User's custom products
let currentPreview = null; // Preview of meal being entered
let editingMealId = null;  // ID of meal being edited
let previewGeneration = 0; // Cancellation counter for async preview

// ============================================================
// Auth
// ============================================================

function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideAuthError() {
  document.getElementById('auth-error').classList.add('hidden');
}

let isSignUpMode = false;

function initAuthEvents() {
  const form = document.getElementById('auth-form');
  const toggleBtn = document.getElementById('auth-toggle-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const submitBtn = document.getElementById('auth-submit-btn');

  toggleBtn.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    hideAuthError();
    if (isSignUpMode) {
      submitBtn.textContent = 'Sign Up';
      toggleText.textContent = 'Already have an account?';
      toggleBtn.textContent = 'Sign In';
    } else {
      submitBtn.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account?";
      toggleBtn.textContent = 'Sign Up';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthError();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('auth-submit-btn');

    submitBtn.disabled = true;
    submitBtn.textContent = isSignUpMode ? 'Signing up...' : 'Signing in...';

    try {
      let result;
      if (isSignUpMode) {
        result = await sb.auth.signUp({ email, password });
      } else {
        result = await sb.auth.signInWithPassword({ email, password });
      }

      if (result.error) {
        showAuthError(result.error.message);
        return;
      }

      if (isSignUpMode && !result.data.session) {
        // Email confirmation required
        showAuthError('Check your email to confirm your account, then sign in.');
        isSignUpMode = false;
        submitBtn.textContent = 'Sign In';
        document.getElementById('auth-toggle-text').textContent = "Don't have an account?";
        document.getElementById('auth-toggle-btn').textContent = 'Sign Up';
        return;
      }

      // Authenticated
      await Promise.all([loadMeals(), loadCustomProducts()]);
      showApp();
      renderLogView();
    } finally {
      submitBtn.disabled = false;
      if (isSignUpMode) {
        submitBtn.textContent = 'Sign Up';
      } else {
        submitBtn.textContent = 'Sign In';
      }
    }
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await sb.auth.signOut();
    meals = [];
    customProducts = [];
    currentPreview = null;
    editingMealId = null;
    showAuthScreen();
  });
}

// ============================================================
// Persistence (Supabase)
// ============================================================

async function loadMeals() {
  const { data, error } = await sb
    .from('meals')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Failed to load meals:', error.message);
    showToast('Failed to load meals');
    meals = [];
    return;
  }

  meals = data.map(row => ({
    id: row.id,
    type: row.type,
    description: row.description,
    items: row.items,
    totals: row.totals,
    date: row.date,
    timestamp: row.timestamp,
  }));
}

async function insertMeal(meal) {
  const { error } = await sb.from('meals').insert({
    id: meal.id,
    type: meal.type,
    description: meal.description,
    items: meal.items,
    totals: meal.totals,
    date: meal.date,
    timestamp: meal.timestamp,
  });

  if (error) {
    console.error('Failed to save meal:', error.message);
    showToast('Failed to save meal');
    return false;
  }
  return true;
}

async function updateMeal(meal) {
  const { error } = await sb.from('meals').update({
    items: meal.items,
    totals: meal.totals,
  }).eq('id', meal.id);

  if (error) {
    console.error('Failed to update meal:', error.message);
    showToast('Failed to update meal');
    return false;
  }
  return true;
}

async function deleteMeal(mealId) {
  const { error } = await sb.from('meals').delete().eq('id', mealId);

  if (error) {
    console.error('Failed to delete meal:', error.message);
    showToast('Failed to delete meal');
    return false;
  }
  return true;
}

// ============================================================
// Custom Products Persistence
// ============================================================

async function loadCustomProducts() {
  const { data, error } = await sb
    .from('custom_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load custom products:', error.message);
    customProducts = [];
    return;
  }

  customProducts = data.map(row => ({
    id: row.id,
    product_name: row.product_name,
    serving_size: row.serving_size,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
    fiber: Number(row.fiber),
    sodium: Number(row.sodium),
    created_at: row.created_at,
  }));
}

async function insertCustomProduct(product) {
  const { error } = await sb.from('custom_products').insert({
    id: product.id,
    product_name: product.product_name,
    serving_size: product.serving_size,
    calories: product.calories,
    protein: product.protein,
    carbs: product.carbs,
    fat: product.fat,
    fiber: product.fiber,
    sodium: product.sodium,
  });

  if (error) {
    console.error('Failed to save custom product:', error.message);
    showToast('Failed to save product');
    return false;
  }
  return true;
}

async function updateCustomProduct(product) {
  const { error } = await sb.from('custom_products').update({
    product_name: product.product_name,
    serving_size: product.serving_size,
    calories: product.calories,
    protein: product.protein,
    carbs: product.carbs,
    fat: product.fat,
    fiber: product.fiber,
    sodium: product.sodium,
  }).eq('id', product.id);

  if (error) {
    console.error('Failed to update custom product:', error.message);
    showToast('Failed to update product');
    return false;
  }
  return true;
}

async function deleteCustomProduct(productId) {
  const { error } = await sb.from('custom_products').delete().eq('id', productId);

  if (error) {
    console.error('Failed to delete custom product:', error.message);
    showToast('Failed to delete product');
    return false;
  }
  return true;
}

// ============================================================
// Utilities
// ============================================================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getTodayMeals() {
  const today = todayStr();
  return meals.filter(m => m.date === today);
}

function getTodayTotals() {
  const todayMeals = getTodayMeals();
  const allMacros = todayMeals.map(m => m.totals);
  return sumMacros(allMacros);
}

function getMealsByDate() {
  const groups = {};
  for (const m of meals) {
    if (!groups[m.date]) groups[m.date] = [];
    groups[m.date].push(m);
  }
  // Sort dates descending
  const sorted = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  return sorted.map(date => ({ date, meals: groups[date] }));
}

// ============================================================
// Navigation
// ============================================================

function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('view-' + viewName).classList.add('active');
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

  // Refresh view content
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'history') renderHistory();
  if (viewName === 'recommendations') renderRecommendations();
  if (viewName === 'log') renderLogView();
  if (viewName === 'custom') renderCustomProducts();
}

// ============================================================
// Dashboard
// ============================================================

function renderDashboard() {
  const totals = getTodayTotals();
  const today = new Date();
  document.getElementById('dashboard-date').textContent =
    today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Update each macro card
  updateMacroCard('calories', totals.calories, DAILY_TARGETS.calories);
  updateMacroCard('protein', totals.protein, DAILY_TARGETS.protein);
  updateMacroCard('carbs', totals.carbs, DAILY_TARGETS.carbs);
  updateMacroCard('fat', totals.fat, DAILY_TARGETS.fat);
  updateMacroCard('fiber', totals.fiber, DAILY_TARGETS.fiber);
  updateSodiumCard(totals.sodium, DAILY_TARGETS.sodium);

  // Render today's meals
  renderTodayMeals();
}

function updateMacroCard(name, current, target) {
  const card = document.getElementById('card-' + name);
  const currentEl = card.querySelector('.current');
  const fill = card.querySelector('.progress-fill');

  currentEl.textContent = Math.round(current).toLocaleString();
  const pct = Math.min((current / target) * 100, 100);
  fill.style.width = pct + '%';

  // Dim color if over target
  if (current > target) {
    fill.style.opacity = '0.7';
    fill.style.width = '100%';
  } else {
    fill.style.opacity = '1';
  }
}

function updateSodiumCard(current, target) {
  const card = document.getElementById('card-sodium');
  const currentEl = card.querySelector('.current');
  const fill = card.querySelector('.progress-fill');
  const status = document.getElementById('sodium-status');

  currentEl.textContent = Math.round(current).toLocaleString();
  const pct = Math.min((current / target) * 100, 100);
  fill.style.width = pct + '%';

  const ratio = current / target;
  card.classList.remove('warning', 'danger');

  if (ratio > 1) {
    card.classList.add('danger');
    status.textContent = `Over by ${Math.round(current - target)}mg`;
    fill.style.width = '100%';
  } else if (ratio > 0.8) {
    card.classList.add('warning');
    const remaining = Math.round(target - current);
    status.textContent = `${remaining}mg remaining - watch intake`;
  } else {
    status.textContent = `${Math.round(target - current)}mg remaining`;
  }
}

function renderTodayMeals() {
  const container = document.getElementById('today-meal-list');
  const todayMeals = getTodayMeals();

  if (todayMeals.length === 0) {
    container.innerHTML = '<p class="empty-state">No meals logged today. <button class="link-btn" data-view="log">Log your first meal</button></p>';
    return;
  }

  container.innerHTML = todayMeals.map(meal => mealEntryHTML(meal)).join('');
}

function mealEntryHTML(meal) {
  return `
    <div class="meal-entry" data-id="${meal.id}">
      <div class="meal-entry-header">
        <span class="meal-entry-type">${meal.type}</span>
        <span class="meal-entry-time">${formatTime(meal.timestamp)}</span>
      </div>
      <div class="meal-entry-description">${escapeHTML(meal.description)}</div>
      <div class="meal-entry-macros">
        <span class="macro-tag cal">${Math.round(meal.totals.calories)} cal</span>
        <span class="macro-tag pro">${Math.round(meal.totals.protein)}g P</span>
        <span class="macro-tag carb">${Math.round(meal.totals.carbs)}g C</span>
        <span class="macro-tag fat">${Math.round(meal.totals.fat)}g F</span>
        <span class="macro-tag fib">${Math.round(meal.totals.fiber)}g Fib</span>
        <span class="macro-tag sod">${Math.round(meal.totals.sodium)}mg Na</span>
      </div>
    </div>
  `;
}

// ============================================================
// Meal Logging
// ============================================================

function renderLogView() {
  renderQuickAddChips();
}

function renderQuickAddChips() {
  const container = document.getElementById('quick-add-chips');
  container.innerHTML = QUICK_ADD_MEALS.map(meal =>
    `<button class="quick-chip" data-meal="${escapeAttr(meal)}">${meal}</button>`
  ).join('');
}

async function previewMeal() {
  const input = document.getElementById('meal-input').value;
  if (!input.trim()) return;

  const gen = ++previewGeneration;

  // Show loading state immediately
  const container = document.getElementById('parsed-preview');
  const itemsEl = document.getElementById('preview-items');
  container.classList.remove('hidden');
  itemsEl.innerHTML = '<div class="preview-loading">Looking up nutrition data...</div>';
  document.getElementById('preview-totals').innerHTML = '';
  document.getElementById('log-btn').disabled = true;

  // Run async lookup (APIs + local fallback)
  const parsed = await parseMealInputAsync(input);

  // If the user typed again while we were fetching, discard this result
  if (gen !== previewGeneration) return;

  currentPreview = parsed;
  renderPreview(parsed);
  document.getElementById('log-btn').disabled = false;
}

function sourceClass(source) {
  if (!source) return 'source-estimated';
  const s = source.toLowerCase();
  if (s === 'custom') return 'source-custom';
  if (s.includes('open food')) return 'source-off';
  if (s.includes('usda')) return 'source-usda';
  return 'source-estimated';
}

function renderPreview(parsed) {
  const container = document.getElementById('parsed-preview');
  const itemsEl = document.getElementById('preview-items');
  const totalsEl = document.getElementById('preview-totals');

  container.classList.remove('hidden');

  itemsEl.innerHTML = parsed.items.map(item => {
    if (item.unknown) {
      return `
        <div class="preview-item">
          <div class="preview-item-header">
            <span class="preview-item-name">${escapeHTML(item.name)}</span>
          </div>
          <span class="preview-item-unknown">Not recognized - will be logged with 0 macros</span>
        </div>
      `;
    }
    const src = item.source || 'Estimated';
    return `
      <div class="preview-item">
        <div class="preview-item-header">
          <span class="preview-item-name">${escapeHTML(item.name)}${item.quantity !== 1 ? ' (x' + item.quantity + ')' : ''}</span>
          <span class="preview-source ${sourceClass(src)}">${escapeHTML(src)}</span>
        </div>
        <span class="preview-item-macros">
          <span>${item.macros.calories} cal</span>
          <span>${item.macros.protein}g P</span>
          <span>${item.macros.carbs}g C</span>
          <span>${item.macros.fat}g F</span>
        </span>
      </div>
    `;
  }).join('');

  const t = parsed.totals;
  totalsEl.innerHTML = `
    <span class="preview-total" style="color: var(--calories-color)">${t.calories} cal</span>
    <span class="preview-total" style="color: var(--protein-color)">${t.protein}g protein</span>
    <span class="preview-total" style="color: var(--carbs-color)">${t.carbs}g carbs</span>
    <span class="preview-total" style="color: var(--fat-color)">${t.fat}g fat</span>
    <span class="preview-total" style="color: var(--fiber-color)">${t.fiber}g fiber</span>
    <span class="preview-total" style="color: var(--sodium-red)">${t.sodium}mg sodium</span>
  `;
}

async function logMeal() {
  const input = document.getElementById('meal-input');
  const description = input.value.trim();
  if (!description) return;

  // If no preview, parse now (async with API lookup)
  if (!currentPreview) {
    currentPreview = await parseMealInputAsync(description);
  }

  const mealType = document.querySelector('.meal-type-btn.active').dataset.type;

  const meal = {
    id: generateId(),
    type: mealType,
    description: description,
    items: currentPreview.items,
    totals: currentPreview.totals,
    date: todayStr(),
    timestamp: new Date().toISOString(),
  };

  // Save to Supabase
  const ok = await insertMeal(meal);
  if (!ok) return;

  meals.push(meal);

  // Reset form
  input.value = '';
  currentPreview = null;
  document.getElementById('parsed-preview').classList.add('hidden');
  document.getElementById('log-btn').disabled = true;

  showToast('Meal logged!');

  // Switch to dashboard
  switchView('dashboard');
}

// ============================================================
// Meal History
// ============================================================

function renderHistory() {
  const container = document.getElementById('history-list');
  const groups = getMealsByDate();

  if (groups.length === 0) {
    container.innerHTML = '<p class="empty-state">No meals logged yet.</p>';
    return;
  }

  container.innerHTML = groups.map(group => {
    const dayTotals = sumMacros(group.meals.map(m => m.totals));
    return `
      <div class="history-date-group">
        <div class="history-date-header">
          <span>${formatDate(group.date)}</span>
          <span class="history-date-totals">
            ${Math.round(dayTotals.calories)} cal | ${Math.round(dayTotals.protein)}g P | ${Math.round(dayTotals.carbs)}g C | ${Math.round(dayTotals.fat)}g F
          </span>
        </div>
        ${group.meals.map(meal => `
          <div class="history-meal-item meal-entry" data-id="${meal.id}">
            <div class="meal-entry-header">
              <span class="meal-entry-type">${meal.type}</span>
              <span class="meal-entry-time">${formatTime(meal.timestamp)}</span>
            </div>
            <div class="meal-entry-description">${escapeHTML(meal.description)}</div>
            <div class="meal-entry-macros">
              <span class="macro-tag cal">${Math.round(meal.totals.calories)} cal</span>
              <span class="macro-tag pro">${Math.round(meal.totals.protein)}g P</span>
              <span class="macro-tag carb">${Math.round(meal.totals.carbs)}g C</span>
              <span class="macro-tag fat">${Math.round(meal.totals.fat)}g F</span>
              <span class="macro-tag fib">${Math.round(meal.totals.fiber)}g Fib</span>
              <span class="macro-tag sod">${Math.round(meal.totals.sodium)}mg Na</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

// ============================================================
// Edit Modal
// ============================================================

function openEditModal(mealId) {
  const meal = meals.find(m => m.id === mealId);
  if (!meal) return;

  editingMealId = mealId;
  const modal = document.getElementById('edit-modal');
  const editItems = document.getElementById('edit-items');

  editItems.innerHTML = meal.items.map((item, i) => `
    <div class="edit-item" data-index="${i}">
      <div class="edit-item-name">${escapeHTML(item.name)}${item.unknown ? ' (not recognized)' : ''}</div>
      <div class="edit-macro-grid">
        <div class="edit-macro-field">
          <label>Calories</label>
          <input type="number" data-macro="calories" value="${Math.round(item.macros.calories)}" min="0">
        </div>
        <div class="edit-macro-field">
          <label>Protein (g)</label>
          <input type="number" data-macro="protein" value="${Math.round(item.macros.protein * 10) / 10}" min="0" step="0.1">
        </div>
        <div class="edit-macro-field">
          <label>Carbs (g)</label>
          <input type="number" data-macro="carbs" value="${Math.round(item.macros.carbs * 10) / 10}" min="0" step="0.1">
        </div>
        <div class="edit-macro-field">
          <label>Fat (g)</label>
          <input type="number" data-macro="fat" value="${Math.round(item.macros.fat * 10) / 10}" min="0" step="0.1">
        </div>
        <div class="edit-macro-field">
          <label>Fiber (g)</label>
          <input type="number" data-macro="fiber" value="${Math.round(item.macros.fiber * 10) / 10}" min="0" step="0.1">
        </div>
        <div class="edit-macro-field">
          <label>Sodium (mg)</label>
          <input type="number" data-macro="sodium" value="${Math.round(item.macros.sodium)}" min="0">
        </div>
      </div>
    </div>
  `).join('');

  modal.classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
  editingMealId = null;
}

async function saveEditedMeal() {
  const meal = meals.find(m => m.id === editingMealId);
  if (!meal) return;

  const editItems = document.querySelectorAll('#edit-items .edit-item');
  editItems.forEach(el => {
    const idx = parseInt(el.dataset.index);
    const item = meal.items[idx];
    if (!item) return;

    item.macros.calories = parseFloat(el.querySelector('[data-macro="calories"]').value) || 0;
    item.macros.protein = parseFloat(el.querySelector('[data-macro="protein"]').value) || 0;
    item.macros.carbs = parseFloat(el.querySelector('[data-macro="carbs"]').value) || 0;
    item.macros.fat = parseFloat(el.querySelector('[data-macro="fat"]').value) || 0;
    item.macros.fiber = parseFloat(el.querySelector('[data-macro="fiber"]').value) || 0;
    item.macros.sodium = parseFloat(el.querySelector('[data-macro="sodium"]').value) || 0;
  });

  meal.totals = sumMacros(meal.items.map(i => i.macros));

  const ok = await updateMeal(meal);
  if (!ok) return;

  closeEditModal();
  showToast('Meal updated!');

  // Refresh current view
  const activeView = document.querySelector('.view.active').id.replace('view-', '');
  switchView(activeView);
}

async function deleteEditingMeal() {
  if (!editingMealId) return;

  const ok = await deleteMeal(editingMealId);
  if (!ok) return;

  meals = meals.filter(m => m.id !== editingMealId);
  closeEditModal();
  showToast('Meal deleted');

  const activeView = document.querySelector('.view.active').id.replace('view-', '');
  switchView(activeView);
}

// ============================================================
// Recommendations
// ============================================================

function renderRecommendations() {
  const totals = getTodayTotals();
  const remaining = {
    calories: DAILY_TARGETS.calories - totals.calories,
    protein: DAILY_TARGETS.protein - totals.protein,
    carbs: DAILY_TARGETS.carbs - totals.carbs,
    fat: DAILY_TARGETS.fat - totals.fat,
    fiber: DAILY_TARGETS.fiber - totals.fiber,
    sodium: DAILY_TARGETS.sodium - totals.sodium,
  };

  // Render remaining summary
  const summaryContainer = document.getElementById('remaining-summary');
  summaryContainer.innerHTML = Object.entries(remaining).map(([key, val]) => {
    const unit = key === 'calories' ? 'cal' : key === 'sodium' ? 'mg' : 'g';
    const isNeg = val < 0;
    return `
      <div class="remaining-item${isNeg ? ' negative' : ''}">
        <div class="remaining-label">${key}</div>
        <div class="remaining-value">${Math.round(val)}${unit}</div>
      </div>
    `;
  }).join('');

  // Score recommendations
  const scored = scoreRecommendations(remaining, totals);
  const container = document.getElementById('recommendations-list');

  if (scored.length === 0) {
    container.innerHTML = '<p class="empty-state">You\'ve met most of your targets! Consider a light snack if you\'re still hungry.</p>';
    return;
  }

  // Get active filter
  const activeFilter = document.querySelector('.rec-filter-btn.active')?.dataset.filter || 'all';

  // Filter by meal type if not "all"
  const filtered = activeFilter === 'all'
    ? scored
    : scored.filter(rec => rec.mealType === activeFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="empty-state">No ${activeFilter} suggestions match your remaining targets.</p>`;
    return;
  }

  // Group by meal type
  const typeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  const groups = {};
  for (const rec of filtered) {
    const type = rec.mealType || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(rec);
  }

  const typeLabels = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

  container.innerHTML = typeOrder
    .filter(type => groups[type]?.length > 0)
    .map(type => `
      <div class="rec-type-section">
        <h3 class="rec-type-header">${typeLabels[type]}</h3>
        ${groups[type].map(rec => {
          const m = rec.macros;
          return `
            <div class="recommendation-card">
              <h4>${escapeHTML(rec.name)}</h4>
              <p class="rec-description">${escapeHTML(rec.description)}</p>
              <div class="rec-macros">
                <span class="macro-tag cal">${m.calories} cal</span>
                <span class="macro-tag pro">${m.protein}g P</span>
                <span class="macro-tag carb">${m.carbs}g C</span>
                <span class="macro-tag fat">${m.fat}g F</span>
                <span class="macro-tag fib">${m.fiber}g Fib</span>
                <span class="macro-tag sod">${m.sodium}mg Na</span>
              </div>
              <div class="rec-fit">${rec.fitReason}</div>
              <button class="rec-add-btn" data-items="${escapeAttr(rec.items)}">+ Add to meal log</button>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');
}

function scoreRecommendations(remaining, todayTotals) {
  // If all targets are met or exceeded, don't recommend
  if (remaining.calories <= 50) return [];

  // Build preference profile from meal history
  const preferences = buildPreferences();

  const scored = RECOMMENDATION_TEMPLATES
    .map(rec => {
      let score = 0;
      const m = rec.macros;

      // Fits within remaining calories (major factor)
      if (m.calories <= remaining.calories + 100) {
        score += 30;
      } else {
        score -= 20;
      }

      // Protein fit: reward meals that help hit protein target
      if (remaining.protein > 20 && m.protein >= 20) {
        score += 15;
      }

      // Fiber fit: reward high-fiber if fiber is lacking
      if (remaining.fiber > 10 && m.fiber >= 5) {
        score += 10;
      }

      // Sodium awareness: penalize high-sodium if sodium is tight
      if (remaining.sodium < 400 && m.sodium > 500) {
        score -= 20;
      } else if (remaining.sodium > 500) {
        score += 5;
      }

      // Carb fit
      if (remaining.carbs > 50 && m.carbs >= 30) {
        score += 8;
      } else if (remaining.carbs < 30 && m.carbs > 50) {
        score -= 10;
      }

      // Fat fit
      if (remaining.fat > 15 && m.fat >= 10) {
        score += 5;
      } else if (remaining.fat < 10 && m.fat > 20) {
        score -= 10;
      }

      // Preference boost: if user frequently eats similar foods
      if (preferences.has(rec.name.toLowerCase())) {
        score += 8;
      }
      // Check ingredient overlap with user history
      const recWords = rec.items.toLowerCase().split(/[\s,]+/);
      for (const word of recWords) {
        if (preferences.has(word)) {
          score += 2;
        }
      }

      // Generate fit reason
      let fitReason = '';
      if (remaining.protein > 30 && m.protein >= 25) {
        fitReason = `Helps hit your protein target (${Math.round(remaining.protein)}g remaining)`;
      } else if (remaining.fiber > 15 && m.fiber >= 5) {
        fitReason = `Good source of fiber (${Math.round(remaining.fiber)}g remaining)`;
      } else if (remaining.calories > 500) {
        fitReason = `Fits well within your ${Math.round(remaining.calories)} remaining calories`;
      } else {
        fitReason = `Balanced option for your remaining targets`;
      }

      return { ...rec, score, fitReason };
    })
    .filter(rec => rec.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored;
}

function buildPreferences() {
  // Analyze all past meals to build a preference set
  const wordFreq = new Map();

  for (const meal of meals) {
    const words = meal.description.toLowerCase().split(/[\s,]+/).filter(w => w.length > 2);
    for (const w of words) {
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
    }
    // Track meal types used
    for (const item of meal.items) {
      if (item.matchedAs) {
        wordFreq.set(item.matchedAs, (wordFreq.get(item.matchedAs) || 0) + 1);
      }
    }
  }

  // Return words that appear more than once as "preferences"
  const prefs = new Set();
  for (const [word, count] of wordFreq) {
    if (count >= 2) prefs.add(word);
  }
  return prefs;
}

// ============================================================
// Custom Products Management
// ============================================================

function renderCustomProducts() {
  const container = document.getElementById('custom-products-list');

  if (customProducts.length === 0) {
    container.innerHTML = '<p class="empty-state">No custom products yet. Add your first one!</p>';
    return;
  }

  container.innerHTML = customProducts.map(p => `
    <div class="cp-card" data-id="${p.id}">
      <div class="cp-card-header">
        <div>
          <div class="cp-card-name">${escapeHTML(p.product_name)}</div>
          <div class="cp-card-serving">${escapeHTML(p.serving_size)}</div>
        </div>
        <div class="cp-card-actions">
          <button class="cp-edit-btn btn btn-secondary btn-sm" data-id="${p.id}">Edit</button>
          <button class="cp-delete-btn btn btn-danger btn-sm" data-id="${p.id}">Delete</button>
        </div>
      </div>
      <div class="cp-card-macros">
        <span class="macro-tag cal">${Math.round(p.calories)} cal</span>
        <span class="macro-tag pro">${Math.round(p.protein * 10) / 10}g P</span>
        <span class="macro-tag carb">${Math.round(p.carbs * 10) / 10}g C</span>
        <span class="macro-tag fat">${Math.round(p.fat * 10) / 10}g F</span>
        <span class="macro-tag fib">${Math.round(p.fiber * 10) / 10}g Fib</span>
        <span class="macro-tag sod">${Math.round(p.sodium)}mg Na</span>
      </div>
    </div>
  `).join('');
}

function showCustomProductForm(product) {
  const form = document.getElementById('custom-product-form');
  const title = document.getElementById('custom-form-title');

  if (product) {
    title.textContent = 'Edit Custom Product';
    document.getElementById('cp-edit-id').value = product.id;
    document.getElementById('cp-name').value = product.product_name;
    document.getElementById('cp-serving').value = product.serving_size;
    document.getElementById('cp-calories').value = product.calories;
    document.getElementById('cp-protein').value = product.protein;
    document.getElementById('cp-carbs').value = product.carbs;
    document.getElementById('cp-fat').value = product.fat;
    document.getElementById('cp-fiber').value = product.fiber;
    document.getElementById('cp-sodium').value = product.sodium;
  } else {
    title.textContent = 'Add Custom Product';
    document.getElementById('cp-edit-id').value = '';
    document.getElementById('cp-name').value = '';
    document.getElementById('cp-serving').value = '1 serving';
    document.getElementById('cp-calories').value = '0';
    document.getElementById('cp-protein').value = '0';
    document.getElementById('cp-carbs').value = '0';
    document.getElementById('cp-fat').value = '0';
    document.getElementById('cp-fiber').value = '0';
    document.getElementById('cp-sodium').value = '0';
  }

  form.classList.remove('hidden');
  document.getElementById('cp-name').focus();
}

function hideCustomProductForm() {
  document.getElementById('custom-product-form').classList.add('hidden');
}

async function saveCustomProduct() {
  const name = document.getElementById('cp-name').value.trim();
  if (!name) {
    showToast('Product name is required');
    return;
  }

  const editId = document.getElementById('cp-edit-id').value;
  const productData = {
    product_name: name,
    serving_size: document.getElementById('cp-serving').value.trim() || '1 serving',
    calories: parseFloat(document.getElementById('cp-calories').value) || 0,
    protein: parseFloat(document.getElementById('cp-protein').value) || 0,
    carbs: parseFloat(document.getElementById('cp-carbs').value) || 0,
    fat: parseFloat(document.getElementById('cp-fat').value) || 0,
    fiber: parseFloat(document.getElementById('cp-fiber').value) || 0,
    sodium: parseFloat(document.getElementById('cp-sodium').value) || 0,
  };

  if (editId) {
    // Update existing
    const product = { id: editId, ...productData };
    const ok = await updateCustomProduct(product);
    if (!ok) return;

    const idx = customProducts.findIndex(p => p.id === editId);
    if (idx !== -1) customProducts[idx] = product;
    showToast('Product updated!');
  } else {
    // Insert new
    const product = { id: generateId(), ...productData };
    const ok = await insertCustomProduct(product);
    if (!ok) return;

    customProducts.unshift(product);
    showToast('Product added!');
  }

  hideCustomProductForm();
  renderCustomProducts();
}

async function handleDeleteCustomProduct(productId) {
  const ok = await deleteCustomProduct(productId);
  if (!ok) return;

  customProducts = customProducts.filter(p => p.id !== productId);
  showToast('Product deleted');
  renderCustomProducts();
}

// ============================================================
// Toast
// ============================================================

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================================
// Helpers
// ============================================================

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================
// Event Listeners
// ============================================================

function initEvents() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Also handle link-btn clicks for navigation (delegated)
  document.addEventListener('click', e => {
    if (e.target.classList.contains('link-btn') && e.target.dataset.view) {
      switchView(e.target.dataset.view);
    }
  });

  // Meal type selector
  document.querySelectorAll('.meal-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.meal-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Meal input - auto-preview on typing (debounced)
  const mealInput = document.getElementById('meal-input');
  let debounceTimer;
  mealInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (mealInput.value.trim()) {
        previewMeal();
      } else {
        document.getElementById('parsed-preview').classList.add('hidden');
        document.getElementById('log-btn').disabled = true;
        currentPreview = null;
      }
    }, 600);
  });

  // Keyboard shortcut: Enter to log (when Shift not pressed for newlines)
  mealInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentPreview && mealInput.value.trim()) {
        logMeal();
      } else if (mealInput.value.trim()) {
        previewMeal();
      }
    }
  });

  // Preview button
  document.getElementById('preview-btn').addEventListener('click', previewMeal);

  // Log button
  document.getElementById('log-btn').addEventListener('click', logMeal);

  // Quick add chips (delegated)
  document.getElementById('quick-add-chips').addEventListener('click', e => {
    const chip = e.target.closest('.quick-chip');
    if (!chip) return;
    mealInput.value = chip.dataset.meal;
    previewMeal();
    // Scroll to top of form
    mealInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Meal entry click to edit (delegated)
  document.addEventListener('click', e => {
    const entry = e.target.closest('.meal-entry');
    if (entry && entry.dataset.id) {
      openEditModal(entry.dataset.id);
    }
  });

  // Modal events
  document.querySelector('.modal-close').addEventListener('click', closeEditModal);
  document.querySelector('.modal-overlay').addEventListener('click', closeEditModal);
  document.getElementById('save-edit-btn').addEventListener('click', saveEditedMeal);
  document.getElementById('delete-meal-btn').addEventListener('click', deleteEditingMeal);

  // Recommendation filter buttons
  document.querySelectorAll('.rec-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rec-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecommendations();
    });
  });

  // Recommendation add button (delegated)
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('.rec-add-btn');
    if (!addBtn) return;

    const items = addBtn.dataset.items;
    mealInput.value = items;
    switchView('log');
    previewMeal();
  });

  // Custom products: show add form
  document.getElementById('show-add-product-btn').addEventListener('click', () => {
    showCustomProductForm(null);
  });

  // Custom products: cancel form
  document.getElementById('cp-cancel-btn').addEventListener('click', hideCustomProductForm);

  // Custom products: save
  document.getElementById('cp-save-btn').addEventListener('click', saveCustomProduct);

  // Custom products: edit and delete (delegated)
  document.getElementById('custom-products-list').addEventListener('click', e => {
    const editBtn = e.target.closest('.cp-edit-btn');
    if (editBtn) {
      const product = customProducts.find(p => p.id === editBtn.dataset.id);
      if (product) showCustomProductForm(product);
      return;
    }
    const deleteBtn = e.target.closest('.cp-delete-btn');
    if (deleteBtn) {
      handleDeleteCustomProduct(deleteBtn.dataset.id);
    }
  });
}

// ============================================================
// Init
// ============================================================

async function init() {
  initAuthEvents();
  initEvents();

  // Check for existing session
  const { data: { session } } = await sb.auth.getSession();

  if (session) {
    await Promise.all([loadMeals(), loadCustomProducts()]);
    showApp();
    renderLogView();
  } else {
    showAuthScreen();
  }
}

document.addEventListener('DOMContentLoaded', init);
