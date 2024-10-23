window.addEventListener('load', () => {
    // Referenciar elementos de la página
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numeroDocumento = document.getElementById('numeroDocumento');
    const password = document.getElementById('password');
    const btnIngresar = document.getElementById('btnIngresar');
    const msgError = document.getElementById('msgError');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Implementar listener para el botón de ingresar
    btnIngresar.addEventListener('click', () => {
        // Validar campos de entrada
        if (isInputInvalid(tipoDocumento) || isInputInvalid(numeroDocumento) || isInputInvalid(password)) {
            mostrarAlerta("Error: Debe completar completamente sus credenciales");
            return;
        }
        ocultarAlerta();
        mostrarLoading();
        autenticar(tipoDocumento.value, numeroDocumento.value, password.value);
    });
});

function isInputInvalid(input) {
    return input.value === null || input.value.trim() === '';
}


function mostrarAlerta(mensaje) {
    const msgError = document.getElementById('msgError');
    msgError.innerHTML = mensaje;
    msgError.style.display = 'block';
}

/**
 * Oculta el mensaje de alerta.
 */
function ocultarAlerta() {
    const msgError = document.getElementById('msgError');
    msgError.innerHTML = '';
    msgError.style.display = 'none';
}

/**
 * Muestra el GIF de carga.
 */
function mostrarLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
}

/**
 * Oculta el GIF de carga.
 */
function ocultarLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
}


async function autenticar(tipoDocumento, numeroDocumento, password) {
    const url = 'http://localhost:8082/login/autenticar-async';
    const data = { tipoDocumento, numeroDocumento, password };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            mostrarAlerta('Error: Ocurrió un problema en la autenticación');
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor: ', result);

        if (result.codigo === '00') {
            localStorage.setItem('result', JSON.stringify(result));
            localStorage.setItem('tipoDocumento', tipoDocumento);
            localStorage.setItem('numeroDocumento', numeroDocumento);
            window.location.replace('principal.html');
        } else {
            mostrarAlerta(result.mensaje);
        }
    } catch (error) {
        console.error('Error: Ocurrió un problema no identificado', error);
        mostrarAlerta('Error: Ocurrió un problema no identificado');
    } finally {
        ocultarLoading();
    }
}