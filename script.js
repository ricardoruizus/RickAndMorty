// =========================================
// 1. REFERENCIAS AL DOM
// =========================================
const charactersContainer = document.getElementById('charactersContainer');
const messagesContainer = document.getElementById('messages');
const favoritesContainer = document.getElementById('favoritesContainer');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const speciesFilter = document.getElementById('speciesFilter');
const genderFilter = document.getElementById('genderFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlElement = document.documentElement;

const API_URL = 'https://rickandmortyapi.com/api/character';

// Variables globales para manejar el estado
let favoritos = [];
let personajesActuales = []; // Guarda la última búsqueda para actualizar los corazones

// =========================================
// 2. FUNCIONES DE FAVORITOS Y LOCALSTORAGE
// =========================================

/**
 * Lee los favoritos guardados en el navegador
 */
function cargarFavoritos() {
    const favoritosGuardados = localStorage.getItem('rick_morty_favoritos');
    
    if (favoritosGuardados) {
        try {
            // Intentamos convertir el texto a un arreglo de objetos JS
            favoritos = JSON.parse(favoritosGuardados);
        } catch (error) {
            console.error('Los datos en localStorage estaban corruptos:', error);
            favoritos = []; // Si hay error, reiniciamos la lista para evitar que la app colapse
        }
    } else {
        favoritos = [];
    }
    mostrarFavoritos();
}

/**
 * Guarda el arreglo actual de favoritos en el navegador
 */
function guardarFavoritos() {
    localStorage.setItem('rick_morty_favoritos', JSON.stringify(favoritos));
}

/**
 * Agrega o quita un personaje de la lista de favoritos
 */
function toggleFavorito(personaje) {
    // Buscamos si el personaje ya existe en favoritos usando su ID
    const indice = favoritos.findIndex(fav => fav.id === personaje.id);
    
    if (indice === -1) {
        // No está en favoritos, lo agregamos
        favoritos.push(personaje);
    } else {
        // Ya está en favoritos, lo eliminamos (splice borra 1 elemento en la posición 'indice')
        favoritos.splice(indice, 1);
    }
    
    guardarFavoritos();
    mostrarFavoritos();
    mostrarPersonajes(personajesActuales); // Re-renderizamos para actualizar los ♥ y ♡
}

/**
 * Pinta la sección de favoritos en el HTML
 */
function mostrarFavoritos() {
    favoritesContainer.innerHTML = '';

    if (favoritos.length === 0) {
        favoritesContainer.innerHTML = '<p style="color: var(--message-color); font-style: italic;">Aún no tienes favoritos.</p>';
        return;
    }

    favoritos.forEach(personaje => {
        const tarjeta = crearElementoTarjeta(personaje);
        favoritesContainer.appendChild(tarjeta);
    });
}

// =========================================
// 3. FUNCIONES DE INTERFAZ GENERAL
// =========================================

function mostrarMensaje(mensaje, esError = false) {
    messagesContainer.textContent = mensaje;
    messagesContainer.style.color = esError ? '#d32f2f' : 'var(--message-color)';
}

/**
 * Crea el elemento HTML (DOM) para una tarjeta (se usa tanto en favoritos como en la lista principal)
 */
function crearElementoTarjeta(personaje) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Verificamos si este personaje está en el arreglo de favoritos
    const esFavorito = favoritos.some(fav => fav.id === personaje.id);
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3 style="margin-bottom: 10px;">${personaje.name}</h3>
            <button class="fav-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;" title="${esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                ${esFavorito ? '❤️' : '🤍'}
            </button>
        </div>
        <img src="${personaje.image}" alt="Imagen de ${personaje.name}" style="width: 100%; border-radius: var(--border-radius); margin-bottom: 10px;">
        <p><strong>Estado:</strong> ${personaje.status}</p>
        <p><strong>Especie:</strong> ${personaje.species}</p>
        <p><strong>Género:</strong> ${personaje.gender}</p>
        <p><strong>Origen:</strong> ${personaje.origin.name}</p>
    `;
    
    // Agregamos el evento click específicamente al botón de favorito
    const btnFav = card.querySelector('.fav-btn');
    btnFav.addEventListener('click', () => toggleFavorito(personaje));
    
    return card;
}

function mostrarPersonajes(personajes) {
    charactersContainer.innerHTML = '';
    personajesActuales = personajes; // Guardamos la referencia para el toggleFavorito

    personajes.forEach(personaje => {
        const tarjeta = crearElementoTarjeta(personaje);
        charactersContainer.appendChild(tarjeta);
    });
}

// =========================================
// 4. LÓGICA DE API Y BÚSQUEDA
// =========================================

async function obtenerPersonajes() {
    mostrarMensaje('Cargando personajes...');
    charactersContainer.innerHTML = ''; 

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
                personajesActuales = []; // Limpiamos la referencia actual
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
        personajesActuales = [];
    }
}

// =========================================
// 5. EVENT LISTENERS Y ARRANQUE
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

/**
 * Carga el tema guardado en localStorage al abrir la página
 */
function cargarTema() {
    const temaGuardado = localStorage.getItem('rick_morty_tema');
    
    // Si el usuario guardó el tema oscuro previamente
    if (temaGuardado === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️'; // Cambiamos el icono al sol
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '🌙'; // Icono de luna por defecto
    }
}

/**
 * Event Listener para el botón de cambiar tema
 */
themeToggleBtn.addEventListener('click', () => {
    // Leemos el tema actual
    const temaActual = htmlElement.getAttribute('data-theme');
    
    if (temaActual === 'dark') {
        // Cambiar a claro
        htmlElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('rick_morty_tema', 'light');
    } else {
        // Cambiar a oscuro
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('rick_morty_tema', 'dark');
    }
});

// IMPORTANTE: Agrega la llamada a cargarTema() justo donde llamas a cargarFavoritos()
// cargarTema();


// Arrancamos la aplicación
cargarFavoritos(); // Primero cargamos los favoritos guardados
obtenerPersonajes(); // Luego traemos los personajes de la API
