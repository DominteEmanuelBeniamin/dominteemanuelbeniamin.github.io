let GUESTS_DATA = []; // Va conține datele încărcate din JSON

const resultsDiv = document.getElementById('resultsContainer');
const tableNumberDisplay = document.getElementById('tableNumber');
const groupNameDisplay = document.getElementById('groupName');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

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
        // Afișează un mesaj clar pe ecran dacă eșuează încărcarea
        document.getElementById('searchScreen').innerHTML = '<h2>Ne pare rău! Nu am putut încărca lista de așezare. Vă rugăm reîncărcați pagina sau cereți ajutor.</h2>';
    }
}

// 2. INIȚIALIZAREA APLICAȚIEI (după ce datele sunt gata)
function initializeApp() {
    // Setează ascultătorii de evenimente
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        handleSearch(searchTerm);
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        handleSearch(searchTerm, true);
    });
}


// 3. LOGICA PRINCIPALĂ DE CĂUTARE ȘI FILTRARE
function handleSearch(searchTerm, isFinalSearch = false) {
    const term = searchTerm.trim().toLowerCase();
    resultsDiv.innerHTML = ''; // Golește sugestiile

    // Ascunde rezultatul mare când se reîncepe căutarea
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('searchScreen').style.display = 'block';

    if (term.length < 3 && !isFinalSearch) {
         resultsDiv.style.display = 'none';
         return; 
    }

    // Filtrarea datelor
    const matches = GUESTS_DATA.filter(guest => 
        guest.nume_grup.toLowerCase().includes(term)
    );

    if (isFinalSearch) {
        // Căutare finală (pe buton)
        const exactMatch = matches.find(guest => guest.nume_grup.toLowerCase() === term);

        if (exactMatch) {
            displayResult(exactMatch.masa, exactMatch.nume_grup);
        } else {
            // Dacă nu e potrivire exactă, afișează sugestiile de eroare/rafinare
            displayError("Numele nu a fost găsit. Vă rugăm verificați ortografia sau selectați din sugestii.");
            displaySuggestions(matches.slice(0, 5)); 
        }
    } else {
        // Autocomplete (sugestii la tastare)
        if (matches.length > 0 && term.length >= 3) {
            displaySuggestions(matches.slice(0, 5));
        }
    }
}

function displaySuggestions(suggestions) {
    resultsDiv.style.display = 'block';
    suggestions.forEach(guest => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = guest.nume_grup;
        suggestionItem.addEventListener('click', () => {
            searchInput.value = guest.nume_grup;
            resultsDiv.innerHTML = '';
            resultsDiv.style.display = 'none';
            // După click pe sugestie, afișăm direct rezultatul
            displayResult(guest.masa, guest.nume_grup); 
        });
        resultsDiv.appendChild(suggestionItem);
    });
}

function displayResult(masa, nume) {
    document.getElementById('searchScreen').style.display = 'none'; 
    document.getElementById('resultScreen').style.display = 'flex'; 
    tableNumberDisplay.textContent = masa;
    groupNameDisplay.textContent = nume;
}

function displayError(message) {
    // O modalitate simplă de a arăta eroarea (poate fi îmbunătățită cu un div sub input)
    alert(message);
}

// GENERARE FULGI DE ZĂPADĂ
function createSnowflakes() {
    const container = document.getElementById('snowflakes');
    const snowflakeChars = ['✦', '✧', '❄', '✶', '•', '◦'];
    const numberOfFlakes = 50;
    
    for (let i = 0; i < numberOfFlakes; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        // Poziție aleatoare pe orizontală
        flake.style.left = Math.random() * 100 + '%';
        
        // Dimensiune aleatoare
        const size = Math.random() * 0.8 + 0.4; // între 0.4 și 1.2 rem
        flake.style.fontSize = size + 'rem';
        
        // Opacitate aleatoare pentru adâncime
        flake.style.opacity = Math.random() * 0.4 + 0.2;
        
        // Durata și delay aleator
        const duration = Math.random() * 10 + 8; // între 8 și 18 secunde
        const delay = Math.random() * 15; // delay între 0 și 15 secunde
        
        flake.style.animationDuration = duration + 's';
        flake.style.animationDelay = delay + 's';
        
        container.appendChild(flake);
    }
}

// PORNIRE: Generez fulgii, apoi încarc datele
createSnowflakes();
loadGuestData();