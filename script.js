// =========================================
// 1. REFERENCIAS AL DOM
// =========================================
const charactersContainer = document.getElementById('charactersContainer');
const messagesContainer = document.getElementById('messages');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const speciesFilter = document.getElementById('speciesFilter');
const genderFilter = document.getElementById('genderFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn'); // Recuerda agregar este botón en tu HTML

const API_URL = 'https://rickandmortyapi.com/api/character';

// =========================================
// 2. FUNCIONES DE INTERFAZ
// =========================================

/**
 * Muestra un mensaje en la interfaz (ej. Cargando, Errores)
 */
function mostrarMensaje(mensaje, esError = false) {
    messagesContainer.textContent = mensaje;
    messagesContainer.style.color = esError ? '#d32f2f' : 'var(--message-color)';
}

/**
 * Recibe un arreglo de personajes y crea las tarjetas en el DOM
 */
function mostrarPersonajes(personajes) {
    charactersContainer.innerHTML = '';

    personajes.forEach(personaje => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <img src="${personaje.image}" alt="Imagen de ${personaje.name}" style="width: 100%; border-radius: var(--border-radius); margin-bottom: 10px;">
            <h3>${personaje.name}</h3>
            <p><strong>Estado:</strong> ${personaje.status}</p>
            <p><strong>Especie:</strong> ${personaje.species}</p>
            <p><strong>Género:</strong> ${personaje.gender}</p>
            <p><strong>Origen:</strong> ${personaje.origin.name}</p>
        `;
        
        charactersContainer.appendChild(card);
    });
}

// =========================================
// 3. LÓGICA DE API Y BÚSQUEDA
// =========================================

/**
 * Consulta la API dinámicamente según los filtros aplicados
 */
async function obtenerPersonajes() {
    mostrarMensaje('Cargando personajes...');
    charactersContainer.innerHTML = ''; // Limpiamos las tarjetas previas

    // Construimos la URL con los parámetros de búsqueda
    const url = new URL(API_URL);
    if (searchInput.value) url.searchParams.append('name', searchInput.value);
    if (statusFilter.value) url.searchParams.append('status', statusFilter.value);
    if (speciesFilter.value) url.searchParams.append('species', speciesFilter.value);
    if (genderFilter.value) url.searchParams.append('gender', genderFilter.value);

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                mostrarMensaje('No se encontraron personajes.', false);
                return; 
            }
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        mostrarMensaje(''); 
        mostrarPersonajes(data.results);

    } catch (error) {
        console.error('Detalle del error:', error);
        mostrarMensaje('No se pudieron cargar los personajes. Revisa tu conexión a internet.', true);
    }
}

// =========================================
// 4. EVENT LISTENERS (Filtros y Debounce)
// =========================================

statusFilter.addEventListener('change', obtenerPersonajes);
speciesFilter.addEventListener('change', obtenerPersonajes);
genderFilter.addEventListener('change', obtenerPersonajes);

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    statusFilter.value = '';
    speciesFilter.value = '';
    genderFilter.value = '';
    obtenerPersonajes(); 
});

let debounceTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer); 
    debounceTimer = setTimeout(() => {
        obtenerPersonajes();
    }, 400);
});

// Iniciar la aplicación por primera vez
obtenerPersonajes();
