let GUESTS_DATA = [];

const resultsDiv = document.getElementById('resultsContainer');
const tableNumberDisplay = document.getElementById('tableNumber');
const groupNameDisplay = document.getElementById('groupName');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchScreen = document.getElementById('searchScreen');
const resultScreen = document.getElementById('resultScreen');
const searchAgainBtn = document.getElementById('searchAgainBtn');

// 1. ÎNCĂRCAREA DATELOR DIN JSON
async function loadGuestData() {
    try {
        const response = await fetch('./guests.json'); 
        if (!response.ok) {
            throw new Error(`Eroare la încărcarea datelor: ${response.statusText}`);
        }
        GUESTS_DATA = await response.json();
        console.log("Date invitați încărcate cu succes:", GUESTS_DATA.length);
        initializeApp(); 
    } catch (error) {
        console.error("Nu s-a putut încărca lista de invitați:", error);
        searchScreen.innerHTML = `
            <div class="rings-decoration mb-4">
                <img src="inel.png" alt="Verighete" style="width: 180px; height: auto;">
            </div>
            <h2 class="font-playfair" style="color: var(--gold);">Ne pare rău!</h2>
            <p>Nu am putut încărca lista. Vă rugăm reîncărcați pagina.</p>
        `;
    }
}

// 2. INIȚIALIZAREA APLICAȚIEI
function initializeApp() {
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchInput.value, true);
        }
    });

    searchButton.addEventListener('click', () => {
        handleSearch(searchInput.value, true);
    });

    searchAgainBtn.addEventListener('click', () => {
        resetToSearch();
    });
}

// 3. RESETARE LA ECRANUL DE CĂUTARE
function resetToSearch() {
    searchInput.value = '';
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'none';
    
    resultScreen.style.display = 'none';
    searchScreen.style.display = 'block';
    
    searchInput.focus();
}

// 4. LOGICA PRINCIPALĂ DE CĂUTARE
function handleSearch(searchTerm, isFinalSearch = false) {
    const term = searchTerm.trim().toLowerCase();
    resultsDiv.innerHTML = '';

    if (term.length < 2 && !isFinalSearch) {
        resultsDiv.style.display = 'none';
        return; 
    }

    // Filtrarea datelor
    const matches = GUESTS_DATA.filter(guest => 
        guest.nume_grup.toLowerCase().includes(term)
    );

    if (isFinalSearch) {
        // Căutare finală (pe buton sau Enter)
        const exactMatch = matches.find(guest => 
            guest.nume_grup.toLowerCase() === term
        );

        if (exactMatch) {
            displayResult(exactMatch.masa, exactMatch.nume_grup);
        } else if (matches.length === 1) {
            // Dacă e un singur rezultat, îl afișăm direct
            displayResult(matches[0].masa, matches[0].nume_grup);
        } else if (matches.length > 1) {
            // Mai multe rezultate - afișăm TOATE
            displaySuggestions(matches);
        } else {
            // Nimic găsit
            showNotFound();
        }
    } else {
        // Autocomplete (sugestii la tastare) - TOATE rezultatele
        if (matches.length > 0 && term.length >= 2) {
            displaySuggestions(matches);
        } else {
            resultsDiv.style.display = 'none';
        }
    }
}

// 5. AFIȘARE SUGESTII
function displaySuggestions(suggestions) {
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'block';
    
    suggestions.forEach(guest => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = guest.nume_grup;
        
        suggestionItem.addEventListener('click', () => {
            displayResult(guest.masa, guest.nume_grup);
        });
        
        resultsDiv.appendChild(suggestionItem);
    });
}

// 6. AFIȘARE REZULTAT FINAL
function displayResult(masa, nume) {
    // Ascunde complet ecranul de căutare
    searchScreen.style.display = 'none';
    resultsDiv.style.display = 'none';
    
    // Actualizează și afișează ecranul de rezultat
    tableNumberDisplay.textContent = masa;
    groupNameDisplay.textContent = nume;
    
    resultScreen.style.display = 'flex';
}

// 7. AFIȘARE MESAJ "NU S-A GĂSIT"
function showNotFound() {
    resultsDiv.innerHTML = `
        <div class="suggestion-item" style="text-align: center; cursor: default; opacity: 0.7;">
            <i class="fa-solid fa-circle-exclamation me-2"></i>
            Numele nu a fost găsit. Verificați ortografia.
        </div>
    `;
    resultsDiv.style.display = 'block';
}

// GENERARE FULGI DE ZĂPADĂ
function createSnowflakes() {
    const container = document.getElementById('snowflakes');
    const snowflakeChars = ['✦', '✧', '❄', '✶', '•', '◦'];
    const numberOfFlakes = 45;
    
    for (let i = 0; i < numberOfFlakes; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        flake.style.left = Math.random() * 100 + '%';
        
        const size = Math.random() * 0.7 + 0.4;
        flake.style.fontSize = size + 'rem';
        
        flake.style.opacity = Math.random() * 0.4 + 0.2;
        
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 15;
        
        flake.style.animationDuration = duration + 's';
        flake.style.animationDelay = delay + 's';
        
        container.appendChild(flake);
    }
}

// PORNIRE
createSnowflakes();
loadGuestData();