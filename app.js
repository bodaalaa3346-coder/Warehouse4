const fieldNames = {
  'All fields': 'all',
  'Product name': 'name',
  'Company name': 'name',
  SKU: 'sku',
  'Order number': 'order',
  Category: 'category'
};
const fieldPicker = document.getElementById('searchBy');
const fieldToggle = document.getElementById('searchByToggle');
const fieldValue = document.getElementById('searchByValue');
const searchInput = document.getElementById('searchInput');
const rows = [...document.querySelectorAll('#inventoryRows tr')];
const options = [...fieldPicker.querySelectorAll('[data-field]')];
const summary = document.getElementById('summary');
const resultsPanel = document.getElementById('resultsPanel');
const emptyState = document.getElementById('emptyState');
let activeField = 'Company name';

let currentLanguage = 'en';
const fieldLabelsArabic = {
  'All fields': '\u0643\u0644 \u0627\u0644\u062d\u0642\u0648\u0644',
  'Product name': '\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062a\u062c',
  'Company name': '\u0627\u0633\u0645 \u0627\u0644\u0634\u0631\u0643\u0629',
  SKU: 'SKU',
  'Order number': '\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628',
  Category: '\u0627\u0644\u0641\u0626\u0629'
};
function localizedField(value) {
  return currentLanguage === 'ar' ? (fieldLabelsArabic[value] || value) : value;
}
function applyLanguage(language) {
  currentLanguage = language;
  const isArabic = language === 'ar';
  document.documentElement.lang = isArabic ? 'ar' : 'en';
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  usersPopup.dir = isArabic ? 'rtl' : 'ltr';
  document.querySelector('.navigation').setAttribute('aria-label', isArabic ? '\u0627\u0644\u062a\u0646\u0642\u0644 \u0627\u0644\u0631\u0626\u064a\u0633\u064a' : 'Main navigation');
  document.querySelector('.language-switch').setAttribute('aria-label', isArabic ? '\u0627\u0644\u0644\u063a\u0629' : 'Language');
  document.querySelector('.search-controls').setAttribute('aria-label', isArabic ? '\u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u062e\u0632\u0648\u0646' : 'Inventory search');
  document.querySelector('.results-panel').setAttribute('aria-label', isArabic ? '\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u062e\u0632\u0648\u0646' : 'Inventory search results');
  document.title = isArabic ? '\u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u062e\u0632\u0648\u0646 | \u0627\u0644\u0645\u062e\u0627\u0632\u0646 \u0627\u0644\u0630\u0643\u064a\u0629' : 'Search inventory | Smart Warehouse';
  document.getElementById('backButton').textContent = isArabic ? '\u2192 \u0631\u062c\u0648\u0639' : '\u2190 Back';
  document.querySelector('h1').textContent = isArabic ? '\u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u062e\u0632\u0648\u0646' : 'Search inventory';
  const headings = isArabic ? ['\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a', '\u0627\u0644\u062a\u062e\u0637\u064a\u0637'] : ['OPERATIONS', 'PLANNING'];
  document.querySelectorAll('.nav-heading').forEach((heading, index) => { heading.textContent = headings[index]; });
  const navLabels = isArabic
    ? ['\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645', '\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a', '\u0627\u0644\u0645\u062e\u0632\u0648\u0646', '\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a', '\u0627\u0644\u062a\u0646\u0628\u0624 \u0627\u0644\u0630\u0643\u064a', '\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0634\u0631\u0627\u0621', '\u0627\u0644\u0645\u0648\u0631\u062f\u0648\u0646', '\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631']
    : ['Dashboard', 'Alerts', 'Inventory', 'Products', 'AI forecast', 'Purchase orders', 'Suppliers', 'Reports'];
  document.querySelectorAll('.nav-link').forEach((link, index) => {
    const textNode = [...link.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode) textNode.textContent = navLabels[index] + (link.querySelector('.nav-count') ? ' ' : '');
  });
  document.querySelectorAll('.nav-count').forEach((count, index) => {
    count.textContent = isArabic ? ['\u0665', '\u0666'][index] : ['5', '6'][index];
  });
  document.querySelector('.team-count').textContent = isArabic ? '\u0665' : '5';
  document.querySelector('.profile-role').textContent = isArabic ? '\u0645\u062f\u064a\u0631' : 'Manager';
  document.querySelector('.profile-name').textContent = isArabic ? '\u0645\u062f\u064a\u0631 \u0627\u0644\u0645\u062e\u0632\u0646' : 'Warehou...';
  document.querySelector('.avatar').textContent = isArabic ? '\u0645 \u0623' : 'WM';
  document.querySelector('.search-by-label').textContent = isArabic ? '\u0627\u0628\u062d\u062b \u062d\u0633\u0628' : 'SEARCH BY';
  fieldValue.textContent = localizedField(activeField);
  options.forEach((option) => { option.textContent = localizedField(option.dataset.field); });
  searchInput.placeholder = isArabic ? '\u0627\u0628\u062d\u062b \u0639\u0646 \u0645\u0646\u062a\u062c' : 'Product';
  if (isArabic && searchInput.value.trim() === 'Product') searchInput.value = '\u0645\u0646\u062a\u062c';
  if (!isArabic && searchInput.value.trim() === '\u0645\u0646\u062a\u062c') searchInput.value = 'Product';
  searchInput.setAttribute('aria-label', isArabic ? '\u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u062e\u0632\u0648\u0646' : 'Search inventory');
  document.querySelector('.notification').setAttribute('aria-label', isArabic ? '\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a' : 'Notifications');
  document.getElementById('searchByToggle').setAttribute('aria-label', isArabic ? '\u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u062c\u0627\u0644 \u0627\u0644\u0628\u062d\u062b' : 'Choose search field');
  emptyState.textContent = isArabic ? '\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0645\u062e\u0632\u0648\u0646 \u0645\u0637\u0627\u0628\u0642.' : 'No matching inventory found.';
  document.querySelectorAll('.status').forEach((status) => { status.textContent = isArabic ? (status.classList.contains('low') ? '\u0645\u0646\u062e\u0641\u0636' : '\u0645\u062a\u0648\u0641\u0631') : (status.classList.contains('low') ? 'Low' : 'OK'); });
  document.querySelectorAll('.stock').forEach((stock) => {
    const amount = stock.textContent.match(/^\s*(\d+)/)?.[1] || '';
    stock.textContent = isArabic ? `${amount} \u0641\u064a \u0627\u0644\u0645\u062e\u0632\u0648\u0646` : `${amount} in stock`;
  });
  document.querySelector('.footer').lastChild.textContent = isArabic ? ' \u0662\u0660\u0662\u0667 Smart Warehouse. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.' : ' 2027 Smart Warehouse. All rights reserved.';
  document.querySelectorAll('.product-name').forEach((name, index) => { name.textContent = isArabic ? `\u0645\u0646\u062a\u062c ${index + 1}` : `product ${index + 1}`; });
  document.querySelectorAll('.product-meta').forEach((meta) => { meta.textContent = isArabic ? meta.textContent.replace('Zone', '\u0627\u0644\u0645\u0646\u0637\u0642\u0629') : meta.textContent.replace('\u0627\u0644\u0645\u0646\u0637\u0642\u0629', 'Zone'); });
  document.querySelector('.users-header strong').textContent = isArabic ? '\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646 \u0627\u0644\u0646\u0634\u0637\u0648\u0646' : 'Active users';
  document.querySelector('.users-header > div span').textContent = isArabic ? '\u0633\u062c\u0644\u0648\u0627 \u0627\u0644\u062f\u062e\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0648\u0642\u0639' : 'Signed in to the website';
  document.querySelector('.users-online').lastChild.textContent = isArabic ? '\u0665 \u0645\u062a\u0635\u0644\u0648\u0646' : '5 online';
  const userRows = [...document.querySelectorAll('.users-list .user-row')];
  const userNames = ['Ahmed Hassan', 'Sara Mostafa', 'Karim Adel', 'Nour Youssef', 'Mona Tarek'];
  const userInitials = ['AH', 'SM', 'KA', 'NY', 'MT'];
  userRows.forEach((row, index) => {
    row.querySelector('.user-copy strong').textContent = userNames[index];
    row.querySelector('.user-avatar').firstChild.textContent = userInitials[index];
  });
  document.querySelectorAll('.user-role').forEach((role) => {
    role.textContent = isArabic ? (role.classList.contains('merchant') ? '\u062a\u0627\u062c\u0631' : '\u0645\u0648\u0638\u0641') : (role.classList.contains('merchant') ? 'Merchant' : 'Employee');
  });
  const recentActivity = [...document.querySelectorAll('.users-list .user-copy small')].find((label) => label.textContent.includes('Active') || label.textContent.includes('\u0646\u0634\u0637'));
  if (recentActivity) recentActivity.textContent = isArabic ? '\u0646\u0634\u0637\u0629 \u0642\u0628\u0644 8 \u062f\u0642\u0627\u0626\u0642' : 'Active 8 min ago';
  document.querySelector('.users-manager .user-avatar').firstChild.textContent = isArabic ? '\u0645 \u0623' : 'WM';
  document.querySelector('.users-manager .user-copy strong').textContent = isArabic ? '\u0645\u062f\u064a\u0631 \u0627\u0644\u0645\u062e\u0632\u0646' : 'Warehouse Manager';
  document.querySelector('.users-manager .user-copy small').textContent = isArabic ? '\u0645\u062f\u064a\u0631' : 'Admin';
  document.querySelector('.users-signout').setAttribute('aria-label', isArabic ? '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c' : 'Sign out');
  const languageButtons = [...document.querySelectorAll('.language-switch button')];
  languageButtons[0].classList.toggle('selected', !isArabic);
  languageButtons[1].classList.toggle('selected', isArabic);
  languageButtons[0].textContent = isArabic ? '\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629' : 'English';
  languageButtons[0].setAttribute('aria-pressed', String(!isArabic));
  languageButtons[1].setAttribute('aria-pressed', String(isArabic));
  updateResults();
}
function updateResults() {
  const visibleQuery = searchInput.value.trim().toLowerCase();
  const query = currentLanguage === 'ar' && visibleQuery === '\u0645\u0646\u062a\u062c' ? 'product' : visibleQuery;
  const key = fieldNames[activeField];
  let count = 0;

  rows.forEach((row) => {
    const values = key === 'all'
      ? ['name', 'sku', 'zone', 'company', 'order', 'category'].map((field) => row.dataset[field] || '').join(' ')
      : (row.dataset[key] || '');
    const matches = !query || values.toLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) count += 1;
  });

  const term = document.createElement('strong');
  term.textContent = searchInput.value.trim() || (currentLanguage === 'ar' ? '\u0627\u0644\u0645\u0646\u062a\u062c' : 'Product');
  const field = document.createElement('strong');
  const summaryField = activeField === 'Company name' ? 'Product name' : activeField;
  field.textContent = localizedField(summaryField);
  summary.replaceChildren(
    document.createTextNode(currentLanguage === 'ar' ? '\u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0644\u0640 "' : 'Showing results for "'),
    term,
    document.createTextNode(currentLanguage === 'ar' ? '" \u0641\u064a ' : '" in '),
    field,
    document.createTextNode(currentLanguage === 'ar' ? ` - ${count} \u0646\u062a\u064a\u062c\u0629` : ' - ' + count + ' result' + (count === 1 ? '' : 's'))
  );
  resultsPanel.style.display = count ? 'block' : 'none';
  emptyState.style.display = count ? 'none' : 'block';
}

function setSelectedOption() {
  options.forEach((option) => {
    option.setAttribute('aria-selected', String(option.dataset.field === activeField));
  });
}

fieldToggle.addEventListener('click', () => {
  const open = fieldPicker.classList.toggle('open');
  fieldToggle.setAttribute('aria-expanded', String(open));
});
options.forEach((option) => {
  option.addEventListener('click', () => {
    activeField = option.dataset.field;
    fieldValue.textContent = localizedField(activeField);
    setSelectedOption();
    fieldPicker.classList.remove('open');
    fieldToggle.setAttribute('aria-expanded', 'false');
    updateResults();
  });
});
document.addEventListener('click', (event) => {
  if (!fieldPicker.contains(event.target)) {
    fieldPicker.classList.remove('open');
    fieldToggle.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    fieldPicker.classList.remove('open');
    fieldToggle.setAttribute('aria-expanded', 'false');
  }
});
document.getElementById('backButton').addEventListener('click', () => history.back());
searchInput.addEventListener('input', updateResults);
setSelectedOption();
updateResults();
const usersToggle = document.getElementById('usersToggle');
const usersPopup = document.getElementById('usersPopup');
usersToggle.addEventListener('click', () => {
  const open = usersPopup.hidden;
  usersPopup.hidden = !open;
  usersToggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (event) => {
  if (!usersPopup.hidden && !usersPopup.contains(event.target) && !usersToggle.contains(event.target)) {
    usersPopup.hidden = true;
    usersToggle.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !usersPopup.hidden) {
    usersPopup.hidden = true;
    usersToggle.setAttribute('aria-expanded', 'false');
    usersToggle.focus();
  }
});
document.querySelectorAll('.language-switch button').forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.lang === 'ar' ? 'ar' : 'en'));
});
const usersList = document.getElementById('usersList');
const usersScrollbar = document.getElementById('usersScrollbar');
const usersScrollbarThumb = document.getElementById('usersScrollbarThumb');
let usersScrollbarDragging = false;
let usersDragStartY = 0;
let usersDragStartScroll = 0;

function updateUsersScrollbar() {
  const maxScroll = usersList.scrollHeight - usersList.clientHeight;
  if (maxScroll <= 1) {
    usersScrollbar.hidden = true;
    usersScrollbar.setAttribute('aria-valuemax', '0');
    usersScrollbar.setAttribute('aria-valuenow', '0');
    return;
  }

  usersScrollbar.hidden = false;
  const trackHeight = usersScrollbar.clientHeight;
  const thumbHeight = Math.max(24, trackHeight * usersList.clientHeight / usersList.scrollHeight);
  const thumbTravel = Math.max(0, trackHeight - thumbHeight);
  const thumbTop = thumbTravel * usersList.scrollTop / maxScroll;
  usersScrollbarThumb.style.height = `${thumbHeight}px`;
  usersScrollbarThumb.style.top = `${thumbTop}px`;
  usersScrollbar.setAttribute('aria-valuemax', String(Math.round(maxScroll)));
  usersScrollbar.setAttribute('aria-valuenow', String(Math.round(usersList.scrollTop)));
}

usersList.addEventListener('scroll', updateUsersScrollbar, { passive: true });
usersToggle.addEventListener('click', () => requestAnimationFrame(updateUsersScrollbar));
window.addEventListener('resize', updateUsersScrollbar);
usersScrollbar.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  const trackRect = usersScrollbar.getBoundingClientRect();
  const thumbHeight = usersScrollbarThumb.offsetHeight;
  if (event.target === usersScrollbarThumb) {
    usersDragStartY = event.clientY;
    usersDragStartScroll = usersList.scrollTop;
  } else {
    const targetTop = Math.min(trackRect.height - thumbHeight, Math.max(0, event.clientY - trackRect.top - thumbHeight / 2));
    const maxScroll = usersList.scrollHeight - usersList.clientHeight;
    usersList.scrollTop = targetTop / Math.max(1, trackRect.height - thumbHeight) * maxScroll;
    usersDragStartY = event.clientY;
    usersDragStartScroll = usersList.scrollTop;
  }
  usersScrollbarDragging = true;
  usersScrollbar.classList.add('is-dragging');
  usersScrollbar.setPointerCapture(event.pointerId);
});
usersScrollbar.addEventListener('pointermove', (event) => {
  if (!usersScrollbarDragging) return;
  const trackHeight = usersScrollbar.clientHeight;
  const thumbTravel = Math.max(1, trackHeight - usersScrollbarThumb.offsetHeight);
  const maxScroll = usersList.scrollHeight - usersList.clientHeight;
  const scale = maxScroll / thumbTravel;
  usersList.scrollTop = usersDragStartScroll + (event.clientY - usersDragStartY) * scale;
});
function stopUsersScrollbarDrag() {
  usersScrollbarDragging = false;
  usersScrollbar.classList.remove('is-dragging');
}
usersScrollbar.addEventListener('pointerup', stopUsersScrollbarDrag);
usersScrollbar.addEventListener('pointercancel', stopUsersScrollbarDrag);
usersScrollbar.addEventListener('keydown', (event) => {
  const steps = { ArrowDown: 40, ArrowUp: -40, PageDown: usersList.clientHeight, PageUp: -usersList.clientHeight, Home: -Infinity, End: Infinity };
  if (!(event.key in steps)) return;
  event.preventDefault();
  usersList.scrollTop = event.key === 'Home' ? 0 : event.key === 'End' ? usersList.scrollHeight : usersList.scrollTop + steps[event.key];
});
applyLanguage('en');
