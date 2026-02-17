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

const STORAGE_KEY = 'nutritrack_meals';

// ============================================================
// State
// ============================================================

let meals = [];          // All meals, persisted
let currentPreview = null; // Preview of meal being entered
let editingMealId = null;  // ID of meal being edited

// ============================================================
// Persistence
// ============================================================

function loadMeals() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    meals = data ? JSON.parse(data) : [];
  } catch {
    meals = [];
  }
}

function saveMeals() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
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

function previewMeal() {
  const input = document.getElementById('meal-input').value;
  if (!input.trim()) return;

  currentPreview = parseMealInput(input);
  renderPreview(currentPreview);
  document.getElementById('log-btn').disabled = false;
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
          <span class="preview-item-name">${escapeHTML(item.name)}</span>
          <span class="preview-item-unknown">Not recognized - will be logged with 0 macros</span>
        </div>
      `;
    }
    return `
      <div class="preview-item">
        <span class="preview-item-name">${escapeHTML(item.name)}${item.quantity !== 1 ? ' (x' + item.quantity + ')' : ''}</span>
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

function logMeal() {
  const input = document.getElementById('meal-input');
  const description = input.value.trim();
  if (!description) return;

  // If no preview, parse now
  if (!currentPreview) {
    currentPreview = parseMealInput(description);
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

  meals.push(meal);
  saveMeals();

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

function saveEditedMeal() {
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
  saveMeals();
  closeEditModal();
  showToast('Meal updated!');

  // Refresh current view
  const activeView = document.querySelector('.view.active').id.replace('view-', '');
  switchView(activeView);
}

function deleteEditingMeal() {
  if (!editingMealId) return;
  meals = meals.filter(m => m.id !== editingMealId);
  saveMeals();
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

  // Score and filter recommendations
  const scored = scoreRecommendations(remaining, totals);
  const container = document.getElementById('recommendations-list');

  if (scored.length === 0) {
    container.innerHTML = '<p class="empty-state">You\'ve met most of your targets! Consider a light snack if you\'re still hungry.</p>';
    return;
  }

  container.innerHTML = scored.map(rec => {
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
  }).join('');
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
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

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
    }, 400);
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

  // Recommendation add button (delegated)
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('.rec-add-btn');
    if (!addBtn) return;

    const items = addBtn.dataset.items;
    mealInput.value = items;
    switchView('log');
    previewMeal();
  });
}

// ============================================================
// Init
// ============================================================

function init() {
  loadMeals();
  initEvents();
  renderLogView();
}

document.addEventListener('DOMContentLoaded', init);
