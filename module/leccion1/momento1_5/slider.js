// JavaScript
export function init() {
    // Elementos del DOM
    const items = document.querySelectorAll('.image-item');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.querySelector('.explanation-text');
    const resetButton = document.getElementById('reset-button');
    const progressContainer = document.getElementById('progress-container');
    const progressText = document.querySelector('.progress-text');

    // Estado de la actividad
    let selectedImages = [];
    let results = {};

    // Imágenes correctas (las primeras 4)
    const correctImages = [
        'trabajos_montajes_estructura',
        'trabajos_techos',
        'trabajos_paredes_fachadas',
        'trabajos_andamios'
    ];

    // Explicaciones para cada imagen
    const explanationsMap = {
        'trabajos_montajes_estructura': 'Trabajos de montajes de estructuras: Bien! Estos normalmente se hacen a más de 2 mts de altura.',
        'trabajos_techos': 'Trabajos en techos y cubiertas: Bien! Estos siempre se hacen a más de 2 mts de altura',
        'trabajos_paredes_fachadas': 'Trabajos en paredes y fachadas: Bien! Estos normalmente se hacen a más de 2 mts de altura',
        'trabajos_andamios': 'Trabajos en andamios: Bien! Estos normalmente permiten acceder a alturas superiores a 2 mts',
        'instalacion_electrica': 'Instalación eléctrica de piso: Piénsalo bien! Este tipo de tareas normalmente NO se hacen a más de 2 metros de altura.',
        'instalacion_pisos': 'Instalación de pisos: Piénsalo bien! Este tipo de tareas normalmente NO se hacen a más de 2 metros de altura.'
    };

    // Función para manejar la selección de imágenes
    function actSelectImg(image) {
        const isSelected = selectedImages.includes(image);
        let newSelectedImages = [...selectedImages];

        if (isSelected) {
            // Deseleccionar
            newSelectedImages = newSelectedImages.filter(img => img !== image);
            explanationContainer.classList.add('hidden');
        } else if (newSelectedImages.length < 6) {
            // Seleccionar
            newSelectedImages.push(image);

            // Mostrar explicación
            const isCorrect = correctImages.includes(image);
            explanationText.textContent = explanationsMap[image];
            explanationText.className = `explanation-text ${isCorrect ? 'explanation-correct' : 'explanation-incorrect'}`;
            explanationContainer.classList.remove('hidden');
        }

        selectedImages = newSelectedImages;

        // Actualizar resultados
        const isCorrect = correctImages.includes(image);
        results[image] = isSelected ? undefined : isCorrect;

        // Actualizar UI
        updateUI();
        updateValidationMessage();
    }

    // Función para actualizar la interfaz
    function updateUI() {
        items.forEach(item => {
            const image = item.getAttribute('data-image');
            const isSelected = selectedImages.includes(image);

            // Actualizar clase de selección
            if (isSelected) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }

            // Actualizar icono de resultado
            const existingResult = item.querySelector('.result-icon');
            if (existingResult) {
                existingResult.remove();
            }

            if (isSelected && results[image] !== undefined) {
                const resultImg = document.createElement('img');
                resultImg.className = 'result-icon';
                resultImg.src = results[image] === true
                    ? '../../assets/img/botones/checkAct.png'
                    : '../../assets/img/botones/xmarkAct.png';
                resultImg.alt = results[image] === true ? 'Correcto' : 'Incorrecto';
                item.appendChild(resultImg);
            }
        });
    }

    // Función para actualizar el mensaje de validación
    function updateValidationMessage() {
        if (selectedImages.length === 0) {
            progressContainer.classList.add('hidden');
            return;
        }

        const totalCorrect = selectedImages.filter(img => correctImages.includes(img)).length;
        const percentage = Math.round((totalCorrect / 4) * 100);

        // Mostrar contador de progreso
        progressText.textContent = `Tus respuestas correctas son: ${totalCorrect} de 4 (${percentage}%)`;
        progressContainer.classList.remove('hidden');
    }

    // Función para reiniciar la actividad
    function resetActivity() {
        selectedImages = [];
        results = {};
        explanationContainer.classList.add('hidden');
        progressContainer.classList.add('hidden');
        updateUI();
    }

    // Event Listeners
    items.forEach(item => {
        item.addEventListener('click', () => {
            const image = item.getAttribute('data-image');
            actSelectImg(image);
        });
    });

    resetButton.addEventListener('click', resetActivity);
}