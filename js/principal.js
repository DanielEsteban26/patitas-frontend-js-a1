window.addEventListener('load', () => {
    // Referenciar elementos de la página
    const msgSuccess = document.getElementById('msgSuccess');
    const msgCerrandoSesion = document.getElementById('msgCerrandoSesion');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Recuperar nombre del usuario del localStorage
    const result = JSON.parse(localStorage.getItem('result'));
    mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);

    // Implementar listener para el botón de cerrar sesión
    btnCerrarSesion.addEventListener('click', cerrarSesion);
});


function mostrarAlerta(mensaje) {
    const msgSuccess = document.getElementById('msgSuccess');
    msgSuccess.innerHTML = mensaje;
    msgSuccess.style.display = 'block';
}

function ocultarAlerta() {
    const msgSuccess = document.getElementById('msgSuccess');
    msgSuccess.innerHTML = '';
    msgSuccess.style.display = 'none';
}

/**
 * Muestra el mensaje de "Cerrando sesión..." y oculta el mensaje de bienvenida.
 */
function mostrarCerrandoSesion() {
    const msgSuccess = document.getElementById('msgSuccess');
    const msgCerrandoSesion = document.getElementById('msgCerrandoSesion');
    const loadingOverlay = document.getElementById('loadingOverlay');
    msgSuccess.style.display = 'none'; // Ocultar el mensaje de bienvenida
    msgCerrandoSesion.style.display = 'block';
    loadingOverlay.style.display = 'flex'; // Mostrar la pantalla de carga
}

/**
 * Oculta el mensaje de "Cerrando sesión..." y la pantalla de carga.
 */
function ocultarCerrandoSesion() {
    const msgCerrandoSesion = document.getElementById('msgCerrandoSesion');
    const loadingOverlay = document.getElementById('loadingOverlay');
    msgCerrandoSesion.style.display = 'none';
    loadingOverlay.style.display = 'none'; // Ocultar la pantalla de carga
}

/**
 * Cierra la sesión del usuario.
 */
async function cerrarSesion() {
    const url = 'http://localhost:8082/login/logout-feign';
    const data = {
        tipoDocumento: localStorage.getItem('tipoDocumento'),
        numeroDocumento: localStorage.getItem('numeroDocumento')
    };

    try {
        mostrarCerrandoSesion();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            mostrarAlerta('Error: Ocurrió un problema al cerrar sesión');
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor: ', result);

        if (result.codigo === '00') {
            localStorage.removeItem('result');
            localStorage.removeItem('tipoDocumento');
            localStorage.removeItem('numeroDocumento');
            window.location.replace('index.html');
        } else {
            mostrarAlerta(result.mensaje);
        }

    } catch (error) {
        console.error('Error: Ocurrió un problema no identificado', error);
        mostrarAlerta('Error: Ocurrió un problema no identificado');
    } finally {
        ocultarCerrandoSesion();
    }
}