export function init() {
    //SLIDER 3 LECCION 3
    // Cambiar de contenido botones
    function showContentEquiposEpp(opcion) {
        // Elimina la clase "active_equipos_epp" de todos los botones y contenidos
        document.querySelectorAll('.buttons_equipos_epp button').forEach(btn => btn.classList.remove('active_equipos_epp'));
        document.querySelectorAll('.content_equipos_epp').forEach(content => content.classList.remove('active_equipos_epp'));

        // Activa el botón y el contenido correspondiente
        document.getElementById(`boton${opcion}_equipos_epp`).classList.add('active_equipos_epp');
        document.getElementById(`contenido${opcion}_equipos_epp`).classList.add('active_equipos_epp');
    }

    // Cambiar entre "Uso Correcto" y "Contraindicaciones"
    function changeContent(opcion, tipo) {
        // Eliminar la clase activa de los botones de cambio de contenido
        document.querySelectorAll(`#contenido${opcion}_equipos_epp .buttons-switch button`).forEach(btn => btn.classList.remove('active-switch'));

        // Activar el botón que se ha clickeado
        document.querySelector(`#contenido${opcion}_equipos_epp .buttons-switch button[onclick="changeContent(${opcion}, '${tipo}')"]`).classList.add('active-switch');

        // Cambiar la imagen y el texto dependiendo de la opción seleccionada
        const img = document.getElementById(`img${opcion}`);
        const texto = document.getElementById(`texto${opcion}`);

        if (tipo === 'correcto') {
            img.src = `./momento3_3/img/${getImageSource(opcion)}_correcto.webp`;  // Cambia la ruta según lo que necesites
            texto.innerHTML = getTextCorrecto(opcion);
        } else if (tipo === 'contraindicaciones') {
            img.src = `./momento3_3/img/${getImageSource(opcion)}_contraindicaciones.webp`;  // Cambia la ruta según lo que necesites
            texto.innerHTML = getTextContraindicaciones(opcion);
        }
    }

    // Funciones para obtener la imagen y texto correcto dependiendo de la opción
    function getImageSource(opcion) {
        switch (opcion) {
            case 1: return 'arnes';
            case 2: return 'linea_vida';
            case 3: return 'casco';
            case 4: return 'bandola';
            case 5: return 'barbuquejo';
            default: return '';
        }
    }

    function getTextCorrecto(opcion) {
        switch (opcion) {
            case 1: return 'El arnés de cuerpo completo debe ajustarse correctamente a la complexión del trabajador, asegurando que las correas de hombros, piernas y cintura estén ceñidas, pero no al punto de incomodar. La anilla dorsal, donde se conecta la línea de vida, debe estar ubicada entre los omóplatos para distribuir la fuerza en caso de una caída. Antes de cada uso, se debe inspeccionar el arnés para identificar posibles desgastes o daños.';
            case 2: return 'La línea de vida debe estar bien asegurada a un anclaje certificado que soporte el peso y la fuerza de una caída. Debe tener la longitud adecuada para permitir movimiento, sin interferir con el trabajo, y estar conectada al anillo dorsal del arnés. La línea de vida puede ser fija o retráctil, según la tarea y el entorno.';
            case 3: return 'El casco debe ajustarse correctamente a la cabeza y debe incluir una suspensión interna que absorba impactos. Se debe usar siempre con barbuquejo para evitar que se caiga mientras se trabaja en altura. Además, el casco debe revisarse antes de cada uso para asegurarse de que no tenga fisuras o daños.';
            case 4: return ':La bandola o mosquetón debe estar correctamente conectada tanto al arnés como a la línea de vida o anclaje. Se debe cerrar completamente y verificar que el cierre esté funcionando antes de usarla. Idealmente, los mosquetones deben ser de bloqueo automático para mayor seguridad.';
            case 5: return 'El barbuquejo, una correa que se ajusta alrededor del mentón, debe mantenerse firmemente colocado para evitar que el casco se desprenda. Es esencial en trabajos en altura para que el casco permanezca en su lugar, independientemente de los movimientos o el viento.';
            default: return '';
        }
    }

    function getTextContraindicaciones(opcion) {
        switch (opcion) {
            case 1: return 'Nunca usar un arnés que presente daños en sus correas, costuras o anillas, ya que podría fallar ante una caída. También es inadecuado utilizar un arnés que no esté ajustado correctamente o que esté hecho para una talla distinta, pues no brindará la protección adecuada.';
            case 2: return 'Evitar utilizar líneas de vida con evidentes desgastes, cortes o conexiones defectuosas, ya que pueden fallar en situaciones críticas. También es incorrecto usarla en anclajes no certificados, o en estructuras que no soporten el peso requerido.';
            case 3: return 'Nunca usar un casco que haya sufrido un impacto fuerte, ya que podría tener daños internos no visibles. Además, es incorrecto usarlo sin barbuquejo, ya que esto lo hace ineficaz en caso de caídas o movimientos bruscos.';
            case 4: return 'No utilizar bandolas que presenten desgaste o corrosión en su estructura, ni aquellas cuyo mecanismo de cierre no funcione correctamente. Usar bandolas no certificadas o de materiales no adecuados para trabajo en alturas también representa un riesgo importante.';
            case 5: return 'Contraindicaciones: No usar el barbuquejo si está roto o si no está bien ajustado.';
            default: return 'No usar barbuquejos flojos o dañados, ya que perderían efectividad en sujetar el casco. Además, evitar el uso de barbuquejos que no sean compatibles con el casco, ya que pueden no garantizar la misma protección.';
        }
    }

    // Exponer funciones globalmente
    window.showContentEquiposEpp = showContentEquiposEpp;
    window.changeContent = changeContent;

}