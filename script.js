// Referencias a los elementos del DOM
const charactersContainer = document.getElementById('charactersContainer');
const messagesContainer = document.getElementById('messages');
const API_URL = 'https://rickandmortyapi.com/api/character';

/**
 * Muestra un mensaje en la interfaz (ej. Cargando, Errores)
 */
function mostrarMensaje(mensaje, esError = false) {
    messagesContainer.textContent = mensaje;
    // Si es un error, cambiamos el color a rojo; si no, usa el color por defecto
    messagesContainer.style.color = esError ? '#d32f2f' : 'var(--message-color)';
}

/**
 * Recibe un arreglo de personajes y crea las tarjetas en el DOM
 */
function mostrarPersonajes(personajes) {
    // Limpiamos el contenedor antes de agregar nuevos elementos
    charactersContainer.innerHTML = '';

    // Iteramos sobre los personajes recibidos (la API devuelve 20 por página)
    personajes.forEach(personaje => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Construimos el contenido de la tarjeta
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

/**
 * Consulta la API y maneja la respuesta
 */
async function obtenerPersonajes() {
    // 1. Mostramos el estado de carga inicial
    mostrarMensaje('Cargando personajes...');

    try {
        // 2. Realizamos la petición a la API
        const respuesta = await fetch(API_URL);

        // 3. Verificamos si la respuesta HTTP fue exitosa
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // 4. Convertimos la respuesta a formato JSON
        const data = await respuesta.json();

        // 5. Limpiamos el mensaje de carga y mostramos los datos
        mostrarMensaje(''); 
        mostrarPersonajes(data.results);

    } catch (error) {
        // 6. Capturamos cualquier error (de red o lanzado manualmente)
        console.error('Detalle del error:', error);
        mostrarMensaje('No se pudieron cargar los personajes. Revisa tu conexión a internet o intenta más tarde.', true);
    }
}

// Iniciar la aplicación llamando a la función principal
obtenerPersonajes();
