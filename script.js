// ========== ELEMENT SEÇİMLERİ ==========
const addBtn = document.getElementById('addBtn');
const cardsContainer = document.getElementById('cardsContainer');
const emptyMessage = document.getElementById('emptyMessage');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const writeModal = document.getElementById('writeModal');
const writeTitle = document.getElementById('writeTitle');
const writeTextarea = document.getElementById('writeTextarea');
const writeDate = document.getElementById('writeDate');
const saveWriteBtn = document.getElementById('saveWrite');
const closeModalBtn = document.getElementById('closeModal');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const emptyNoteModal = document.getElementById('emptyNoteModal');
const confirmEmptyBtn = document.getElementById('confirmEmpty');
const cancelEmptyBtn = document.getElementById('cancelEmpty');
const clearTasksModal = document.getElementById('clearTasksModal');
const confirmClearTasksBtn = document.getElementById('confirmClearTasks');
const cancelClearTasksBtn = document.getElementById('cancelClearTasks');
const taskCountSpan = document.getElementById('taskCount');
const body = document.body;

// İstatistik elementleri
const statsMonthYear = document.getElementById('statsMonthYear');
const statsEventCount = document.getElementById('statsEventCount');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const todayBtn = document.getElementById('todayBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarGrid = document.getElementById('calendarGrid');
const boxesContainer = document.getElementById('boxesContainer');

// Sayfa elementleri
const homePage = document.getElementById('homePage');
const listPage = document.getElementById('listPage');
const statsPage = document.getElementById('statsPage');

// Görev elementleri
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainer = document.getElementById('tasksContainer');
const emptyTasks = document.getElementById('emptyTasks');
const tasksList = document.getElementById('tasksList');
const tasksFooter = document.getElementById('tasksFooter');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// ========== GLOBAL DEĞİŞKENLER ==========
let cards = [];
let tasks = [];
let deleteCardId = null;
let currentEditingCardId = null;
let currentPage = 'home';

let currentStatsYear = new Date().getFullYear();
let currentStatsMonth = new Date().getMonth();
let selectedBoxId = null;
let boxData = {};

// ========== YARDIMCI FONKSİYONLAR ==========
function closeModal(modal) {
    modal.classList.remove('active');
}

function validateNumberInput(value) {
    return /^[+-]?\d*$/.test(value);
}

// ========== LOCALSTORAGE FONKSİYONLARI ==========
function loadCards() {
    try {
        const savedCards = localStorage.getItem('gunlukKartlari');
        if (savedCards) {
            cards = JSON.parse(savedCards);
        }
    } catch (error) {
        console.error('Kartlar yüklenemedi:', error);
    }
}

function saveCards() {
    try {
        localStorage.setItem('gunlukKartlari', JSON.stringify(cards));
    } catch (error) {
        console.error('Kaydetme hatası:', error);
        alert('Veriler kaydedilemedi!');
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('gorevler');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (error) {
        console.error('Görevler yüklenemedi:', error);
    }
}

function saveTasks() {
    try {
        localStorage.setItem('gorevler', JSON.stringify(tasks));
    } catch (error) {
        console.error('Görevler kaydedilemedi:', error);
    }
}

function loadCurrentPage() {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage || 'home';
}

function saveCurrentPage(pageName) {
    localStorage.setItem('currentPage', pageName);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="5"/%3E%3Cline x1="12" y1="1" x2="12" y2="3"/%3E%3Cline x1="12" y1="21" x2="12" y2="23"/%3E%3Cline x1="4.22" y1="4.22" x2="5.64" y2="5.64"/%3E%3Cline x1="18.36" y1="18.36" x2="19.78" y2="19.78"/%3E%3Cline x1="1" y1="12" x2="3" y2="12"/%3E%3Cline x1="21" y1="12" x2="23" y2="12"/%3E%3Cline x1="4.22" y1="19.78" x2="5.64" y2="18.36"/%3E%3Cline x1="18.36" y1="5.64" x2="19.78" y2="4.22"/%3E%3C/svg%3E';
    } else {
        body.classList.remove('light-mode');
        themeIcon.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"%3E%3Cpath d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/%3E%3C/svg%3E';
    }
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function loadBoxData() {
    try {
        const saved = localStorage.getItem('boxData');
        if (saved) {
            boxData = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Box verileri yüklenemedi:', error);
    }
}

function saveBoxData() {
    try {
        localStorage.setItem('boxData', JSON.stringify(boxData));
    } catch (error) {
        console.error('Box verileri kaydedilemedi:', error);
    }
}

// ========== TARİH FONKSİYONU ==========
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleDateString('tr-TR', options);
}

function updateWriteDate() {
    const now = new Date();
    const today = now.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long' 
    });
    const time = now.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    writeDate.textContent = `${today}, ${time}`;
}

// ========== KART FONKSİYONLARI ==========
function createEmptyCard() {
    const newCard = {
        id: Date.now(),
        title: '',
        text: '',
        date: new Date().toISOString(),
        isEmpty: true
    };
    
    cards.unshift(newCard);
    saveCards();
    renderCards();
}

function renderCards() {
    if (cards.length === 0) {
        emptyMessage.style.display = 'flex';
        cardsContainer.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        cardsContainer.style.display = 'grid';
        cardsContainer.innerHTML = '';
        
        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.id = card.id;
            
            if (card.isEmpty && !card.text) {
                cardEl.innerHTML = `
                    <button class="delete-btn" data-id="${card.id}">SİL</button>
                    <div class="empty-card-content">
                        <p>
                            <svg class="empty-card-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path>
                            </svg> 
                            Buraya tıklayarak not ekleyin
                        </p>
                    </div>
                `;
            } else {
                const summary = card.text.substring(0, 100) + (card.text.length > 100 ? '...' : '');
                cardEl.innerHTML = `
                    <button class="delete-btn" data-id="${card.id}">SİL</button>
                    <h3 class="card-title">${card.title || 'Başlıksız Not'}</h3>
                    <p class="card-summary">${summary}</p>
                    <p class="card-date">${formatDate(card.date)}</p>
                `;
            }
            
            cardEl.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    openEditModal(card.id);
                }
            });
            
            const deleteBtn = cardEl.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openDeleteModal(card.id);
            });
            
            cardsContainer.appendChild(cardEl);
        });
    }
}

function openWriteModal() {
    currentEditingCardId = null;
    writeTitle.value = '';
    writeTextarea.value = '';
    updateWriteDate();
    writeModal.classList.add('active');
    writeTitle.focus();
}

function openEditModal(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (card) {
        currentEditingCardId = cardId;
        writeTitle.value = card.title;
        writeTextarea.value = card.text;
        writeDate.textContent = formatDate(card.date);
        writeModal.classList.add('active');
        writeTitle.focus();
    }
}

function closeWriteModal() {
    writeModal.classList.remove('active');
    currentEditingCardId = null;
}

function saveCard() {
    const title = writeTitle.value.trim();
    const text = writeTextarea.value.trim();
    
    if (!text) {
        alert('Lütfen bir not yazın!');
        return;
    }
    
    if (currentEditingCardId) {
        const cardIndex = cards.findIndex(c => c.id === currentEditingCardId);
        if (cardIndex !== -1) {
            cards[cardIndex].title = title;
            cards[cardIndex].text = text;
            cards[cardIndex].date = new Date().toISOString();
            cards[cardIndex].isEmpty = false;
        }
    } else {
        const newCard = {
            id: Date.now(),
            title: title,
            text: text,
            date: new Date().toISOString()
        };
        cards.unshift(newCard);
    }
    
    saveCards();
    renderCards();
    closeWriteModal();
}

function openDeleteModal(cardId) {
    deleteCardId = cardId;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deleteCardId = null;
}

function deleteCard() {
    if (deleteCardId) {
        cards = cards.filter(card => card.id !== deleteCardId);
        saveCards();
        renderCards();
        closeDeleteModal();
    }
}

// ========== GÖREV FONKSİYONLARI ==========
function renderTasks() {
    if (tasks.length === 0) {
        emptyTasks.style.display = 'block';
        tasksList.style.display = 'none';
        tasksFooter.style.display = 'none';
    } else {
        emptyTasks.style.display = 'none';
        tasksList.style.display = 'flex';
        tasksFooter.style.display = 'flex';
        tasksList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            
            taskEl.innerHTML = `
                <span class="task-icon">
                    <svg class="task-icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                        <path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path>
                    </svg>
                </span>
                <div class="task-content">
                    <span class="task-label">GÖREV ${index + 1}</span>
                    <input 
                        type="text" 
                        class="task-input ${task.completed ? 'completed' : ''}" 
                        value="${task.text}" 
                        data-id="${task.id}"
                        placeholder="Görev adını yazın..."
                    >
                </div>
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    data-id="${task.id}"
                >
            `;
            
            const input = taskEl.querySelector('.task-input');
            const checkbox = taskEl.querySelector('.task-checkbox');
            
            input.addEventListener('change', (e) => {
                updateTaskText(task.id, e.target.value);
            });
            
            checkbox.addEventListener('change', (e) => {
                toggleTaskComplete(task.id, e.target.checked);
            });
            
            tasksList.appendChild(taskEl);
        });
        
        updateTaskStats();
    }
}

function addTask() {
    const newTask = {
        id: Date.now(),
        text: '',
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    setTimeout(() => {
        const inputs = tasksList.querySelectorAll('.task-input');
        const lastInput = inputs[inputs.length - 1];
        if (lastInput) {
            lastInput.focus();
        }
    }, 100);
}

function updateTaskText(taskId, newText) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.text = newText;
        saveTasks();
    }
}

function toggleTaskComplete(taskId, completed) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = completed;
        saveTasks();
        renderTasks();
    }
}

function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        return;
    }
    
    taskCountSpan.textContent = completedCount;
    clearTasksModal.classList.add('active');
}

// ========== KUTU SİSTEMİ FONKSİYONLARI ==========
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function createBoxes() {
    if (!boxesContainer) return;
    
    boxesContainer.innerHTML = '';
    
    const daysInMonth = getDaysInMonth(currentStatsYear, currentStatsMonth);
    const firstDayOfMonth = new Date(currentStatsYear, currentStatsMonth, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Önceki ayın bilgilerini al
    const prevMonth = currentStatsMonth === 0 ? 11 : currentStatsMonth - 1;
    const prevYear = currentStatsMonth === 0 ? currentStatsYear - 1 : currentStatsYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    // Önceki ayın günlerini ekle
    for (let i = 0; i < startOffset; i++) {
        const dayNum = daysInPrevMonth - startOffset + i + 1;
        const prevMonthKey = `${prevYear}-${prevMonth}-${dayNum}`;
        const savedValue = boxData[prevMonthKey] || '';
        
        const box = document.createElement('div');
        box.className = 'box-item box-other-month';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'box-input';
        input.value = savedValue;
        input.readOnly = true;
        
        if (savedValue) {
            if (savedValue.startsWith('-')) {
                input.classList.add('negative');
            } else if (savedValue.startsWith('+') || savedValue) {
                input.classList.add('positive');
            }
        }
        
        const number = document.createElement('div');
        number.className = 'box-number';
        number.textContent = dayNum < 10 ? `0${dayNum}` : dayNum;
        
        box.appendChild(input);
        box.appendChild(number);
        boxesContainer.appendChild(box);
    }
    
    // Gerçek günleri ekle
    for (let i = 1; i <= daysInMonth; i++) {
        const box = document.createElement('div');
        box.className = 'box-item';
        box.dataset.id = i;
        box.dataset.dayIndex = startOffset + i - 1;
        
        const boxKey = `${currentStatsYear}-${currentStatsMonth}-${i}`;
        const savedValue = boxData[boxKey] || '';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'box-input';
        input.placeholder = '';
        input.value = savedValue;
        input.dataset.id = i;
        
        if (savedValue) {
            if (savedValue.startsWith('-')) {
                input.classList.add('negative');
            } else if (savedValue.startsWith('+') || savedValue) {
                input.classList.add('positive');
            }
            box.classList.add('has-value');
        }
        
        input.addEventListener('input', (e) => {
            let value = e.target.value;
            let cleaned = value.replace(/[^0-9+\-]/g, '');
            let firstChar = cleaned.length > 0 ? cleaned[0] : '';
            let restChars = cleaned.slice(1);
            
            if (firstChar === '+' || firstChar === '-') {
                restChars = restChars.replace(/[+\-]/g, '');
                cleaned = firstChar + restChars;
            } else {
                restChars = cleaned.replace(/[+\-]/g, '');
                cleaned = restChars;
            }
            
            if (cleaned.length > 10) {
                cleaned = cleaned.slice(0, 10);
            }
            
            e.target.value = cleaned;
            
            input.classList.remove('positive', 'negative');
            if (cleaned.startsWith('-')) {
                input.classList.add('negative');
            } else if (cleaned.startsWith('+') || (cleaned && !cleaned.startsWith('-'))) {
                input.classList.add('positive');
            }
            
            const boxKey = `${currentStatsYear}-${currentStatsMonth}-${i}`;
            boxData[boxKey] = cleaned;
            saveBoxData();
            
            if (cleaned) {
                box.classList.add('has-value');
            } else {
                box.classList.remove('has-value');
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            }
        });
        
        const number = document.createElement('div');
        number.className = 'box-number';
        number.textContent = i < 10 ? `0${i}` : i;
        
        box.appendChild(input);
        box.appendChild(number);
        
        box.addEventListener('click', () => selectBox(i));
        
        boxesContainer.appendChild(box);
    }
}

function selectBox(boxId) {
    const allBoxes = document.querySelectorAll('.box-item:not(.box-other-month)');
    allBoxes.forEach(box => box.classList.remove('selected'));
    
    const selectedBox = boxesContainer.querySelector(`.box-item[data-id="${boxId}"]`);
    if (selectedBox && !selectedBox.classList.contains('box-other-month')) {
        selectedBox.classList.add('selected');
        selectedBoxId = boxId;
        
        const input = selectedBox.querySelector('.box-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
}

function updateStatsMonthYear() {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const monthName = months[currentStatsMonth];
    
    if (statsMonthYear) {
        statsMonthYear.textContent = `${monthName} ${currentStatsYear}`;
    }
}

function previousMonth() {
    currentStatsMonth--;
    if (currentStatsMonth < 0) {
        currentStatsMonth = 11;
        currentStatsYear--;
    }
    updateStatsMonthYear();
    createBoxes();
}

function nextMonth() {
    currentStatsMonth++;
    if (currentStatsMonth > 11) {
        currentStatsMonth = 0;
        currentStatsYear++;
    }
    updateStatsMonthYear();
    createBoxes();
}

function goToToday() {
    const today = new Date();
    currentStatsYear = today.getFullYear();
    currentStatsMonth = today.getMonth();
    updateStatsMonthYear();
    createBoxes();
    
    const todayDay = today.getDate();
    setTimeout(() => selectBox(todayDay), 200);
}

// ========== SAYFA NAVİGASYONU ==========
function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const pageMap = {
        'home': homePage,
        'calendar': listPage,
        'stats': statsPage
    };
    
    if (pageMap[pageName]) {
        pageMap[pageName].classList.add('active');
        currentPage = pageName;
        saveCurrentPage(pageName);
    }
    
    const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    if (pageName === 'home') {
        addBtn.style.display = 'flex';
    } else {
        addBtn.style.display = 'none';
    }
    
    if (pageName === 'stats') {
        updateStatsMonthYear();
        createBoxes();
        const today = new Date();
        if (today.getFullYear() === currentStatsYear && today.getMonth() === currentStatsMonth) {
            setTimeout(() => selectBox(today.getDate()), 200);
        }
    }
}

// ========== TEMA DEĞİŞTİRME ==========
function toggleTheme() {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        saveTheme('light');
        themeIcon.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="5"/%3E%3Cline x1="12" y1="1" x2="12" y2="3"/%3E%3Cline x1="12" y1="21" x2="12" y2="23"/%3E%3Cline x1="4.22" y1="4.22" x2="5.64" y2="5.64"/%3E%3Cline x1="18.36" y1="18.36" x2="19.78" y2="19.78"/%3E%3Cline x1="1" y1="12" x2="3" y2="12"/%3E%3Cline x1="21" y1="12" x2="23" y2="12"/%3E%3Cline x1="4.22" y1="19.78" x2="5.64" y2="18.36"/%3E%3Cline x1="18.36" y1="5.64" x2="19.78" y2="4.22"/%3E%3C/svg%3E';
    } else {
        saveTheme('dark');
        themeIcon.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"%3E%3Cpath d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/%3E%3C/svg%3E';
    }
}

// ========== EVENT LİSTENERLAR ==========
confirmEmptyBtn.addEventListener('click', () => {
    emptyNoteModal.classList.remove('active');
    const title = writeTitle.value.trim();
    const newCard = {
        id: Date.now(),
        title: title,
        text: '',
        date: new Date().toISOString(),
        isEmpty: true
    };
    cards.unshift(newCard);
    saveCards();
    renderCards();
    closeWriteModal();
});

cancelEmptyBtn.addEventListener('click', () => {
    emptyNoteModal.classList.remove('active');
});

emptyNoteModal.addEventListener('click', (e) => {
    if (e.target === emptyNoteModal) {
        emptyNoteModal.classList.remove('active');
    }
});

addBtn.addEventListener('click', createEmptyCard);
closeModalBtn.addEventListener('click', closeWriteModal);
saveWriteBtn.addEventListener('click', saveCard);
confirmDeleteBtn.addEventListener('click', deleteCard);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

themeToggle.addEventListener('click', toggleTheme);

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pageName = btn.dataset.page;
        switchPage(pageName);
    });
});

addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

prevMonthBtn?.addEventListener('click', previousMonth);
nextMonthBtn?.addEventListener('click', nextMonth);
todayBtn?.addEventListener('click', goToToday);

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

writeModal.addEventListener('click', (e) => {
    if (e.target === writeModal) {
        closeWriteModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (writeModal.classList.contains('active')) {
            closeWriteModal();
        }
        if (deleteModal.classList.contains('active')) {
            closeDeleteModal();
        }
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (writeModal.classList.contains('active')) {
            saveCard();
        }
    }
});

confirmClearTasksBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    clearTasksModal.classList.remove('active');
});

cancelClearTasksBtn.addEventListener('click', () => {
    clearTasksModal.classList.remove('active');
});

clearTasksModal.addEventListener('click', (e) => {
    if (e.target === clearTasksModal) {
        clearTasksModal.classList.remove('active');
    }
});

// ========== SAYFA YÜKLENME ==========
window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadCards();
    loadTasks();
    renderTasks();
    renderCards();
    loadBoxData();
    updateStatsMonthYear();
    createBoxes();
    
    const lastPage = loadCurrentPage();
    switchPage(lastPage);
});