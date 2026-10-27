# Explorador Interactivo de Rick and Morty

Una aplicación web de una sola página (SPA) que consume la API REST pública de Rick and Morty. Permite a los usuarios buscar personajes, aplicar filtros combinados, guardar favoritos y alternar entre modo claro y oscuro, garantizando la persistencia de datos mediante el almacenamiento local del navegador.

## Integrantes
* Ricardo de Jesus Ruiz Us

## Instrucciones de Uso
1. Ingresa a la página mediante el enlace de GitHub Pages.
2. Utiliza la **barra de búsqueda** para encontrar personajes por nombre. Los resultados se actualizan automáticamente mientras escribes (con un retraso optimizado).
3. Utiliza los **filtros desplegables** para refinar tu búsqueda por Estado, Especie o Género.
4. Haz clic en el icono **🤍 / ❤️** en cualquier tarjeta para agregar o quitar al personaje de tu lista de Favoritos.
5. Utiliza el botón **🌙 / ☀️** en el encabezado para alternar entre el modo oscuro y claro de la aplicación.
6. Si actualizas la página o cierras el navegador, tanto tu tema elegido como tus favoritos seguirán allí la próxima vez que entres.

## Enlace a GitHub Pages
🔗 https://ricardoruizus.github.io/RickAndMorty/

## Tecnologías Usadas
* **HTML5:** Estructura semántica de la aplicación.
* **CSS3:** Variables CSS para el sistema de temas (Dark Mode), CSS Grid para las tarjetas y Flexbox para la barra de navegación.
* **JavaScript (Vanilla):** Lógica asíncrona (`async/await`, `fetch`), manejo del DOM, uso del objeto nativo `URLSearchParams` y persistencia con `localStorage`.
* **Rick and Morty API:** Interfaz de datos externa para consumir el catálogo de personajes.
* **GitHub (Web):** Control de versiones y edición de código.

---

## Documentación del uso de Inteligencia Artificial

Durante el desarrollo de este proyecto, utilizamos herramientas de IA como mentores y asistentes de código. A continuación, documentamos nuestra interacción con la herramienta:

### 1. Tres Prompts Importantes que utilizamos:
* **Prompt 1:** * Explícame cómo funciona fetch() con try/catch como si fuera para una presentación escolar'] *
* **Prompt 2:** *Genera el CSS necesario para hacer una cuadrícula responsiva sin usar media queries complejas*
* **Prompt 3:** *¿Cómo puedo hacer que mi buscador espere a que el usuario termine de escribir para no saturar la API?*

### 2. Respuesta de la IA que requirió correcciones:
* **Lo que respondió la IA:** *Describe una respuesta que no te sirvió del todo o que tuvo que ser adaptada*
* **Por qué estaba mal o incompleta:** *Asumió que estábamos usando un archivo local de JSON en lugar de una API, o generó código para Node.js y no para el navegador*
* **Cómo lo solucionamos:** *Le especificamos que el entorno era Vanilla JS en el navegador web*

### 3. Un error encontrado y cómo lo resolvimos:
* **El error (Bug):** *Cuando borrábamos un personaje de favoritos, la página se rompía si el localStorage estaba vacío*
* **La solución:** *Implementamos un bloque try/catch alrededor del JSON.parse y validamos que el arreglo existiera antes de hacer el renderizado*

