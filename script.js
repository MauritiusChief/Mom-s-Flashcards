const cardContainer = document.getElementById('cardContainer');
const fileInput = document.getElementById('fileInput');

// Load flashcards from local storage
function loadFromLocalStorage() {
    const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    renderFlashcards(flashcards);
}

// Render flashcards
function renderFlashcards(flashcards) {
    cardContainer.innerHTML = '';
    flashcards.forEach(({ term, definition }) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">${term}</div>
            <div class="card-back">${definition}</div>
        </div>
        `;
        cardContainer.appendChild(card);
    });
}

// Handle file upload and save to local storage
fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Convert rows to flashcards and save to local storage
        const flashcards = rows.slice(1).map(row => ({
            term: row[0] || '',
            definition: row[1] || ''
        }));
        localStorage.setItem('flashcards', JSON.stringify(flashcards));

        // Render the updated flashcards
        renderFlashcards(flashcards);
        };
        reader.readAsArrayBuffer(file);
    }
});

// Clear flashcards from local storage and UI
function clearFlashcards() {
    localStorage.removeItem('flashcards');
    cardContainer.innerHTML = '';
}

// Load flashcards on page load
window.onload = loadFromLocalStorage;