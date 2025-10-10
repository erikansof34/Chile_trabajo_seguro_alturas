export function init() {
    //SLIDER 4 LECCION 3
    //------------------------------//
    // Seleccionar botones y contenido
    const botones = document.querySelectorAll('.boton_sl19_conocer_epp');
    const contenidos = document.querySelectorAll('.contenido_sl19_conocer_epp');

    // Agregar eventos a los botones
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Ocultar todos los contenidos
            contenidos.forEach(contenido => contenido.style.display = 'none');

            // Mostrar el contenido asociado al botón
            const targetId = boton.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';
        });
    });

}