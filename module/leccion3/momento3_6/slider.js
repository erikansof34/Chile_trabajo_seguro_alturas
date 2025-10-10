export function init() {
    // Variables globales
    let activeTranscriptionAudio = null;
    const CORRECT_ANSWERS = {
        select1: "velocidad",
        select2: "comunicacion",
        select3: "seguridad"
    };

    // Estado de la actividad
    const state = {
        selections: {
            select1: "",
            select2: "",
            select3: ""
        },
        validationStatus: {},
        showValidateError: false,
        percentage: 0,
        correctCount: 0
    };

    // Inicializar la actividad
    function initializeActivity() {
        setupEventListeners();
        setupTranscriptionToggle();
        setupAudioControls();
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Listeners para los selects
        document.getElementById('select1').addEventListener('change', (e) => handleSelectChange('select1', e.target.value));
        document.getElementById('select2').addEventListener('change', (e) => handleSelectChange('select2', e.target.value));
        document.getElementById('select3').addEventListener('change', (e) => handleSelectChange('select3', e.target.value));

        // Listeners para los botones
        document.getElementById('validate-btn').addEventListener('click', validateAnswers);
        document.getElementById('reset-btn').addEventListener('click', handleReset);
    }

    // Configurar controles de audio
    function setupAudioControls() {
        const audios = document.querySelectorAll('.audio-con-transcripcion');

        audios.forEach(audio => {
            audio.addEventListener('play', () => {
                // Pausar todos los demás audios
                audios.forEach(otherAudio => {
                    if (otherAudio !== audio && !otherAudio.paused) {
                        otherAudio.pause();
                    }
                });

                handleAudioPlay(audio);
            });

            audio.addEventListener('ended', () => setCurrentPlayingAudio(null));
        });
    }

    // Configurar toggle de transcripción
    function setupTranscriptionToggle() {
        const transcriptionToggles = document.querySelectorAll('.transcription-toggle');

        transcriptionToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const audio = this.closest('.audio-wrapper').querySelector('.audio-con-transcripcion');
                toggleTranscription(audio, this);
            });
        });

        // Crear elemento global para transcripción
        if (!document.getElementById('transcripcion-global')) {
            const div = document.createElement('div');
            div.id = 'transcripcion-global';
            div.style.position = 'fixed';
            div.style.bottom = '20px';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            div.style.color = 'white';
            div.style.padding = '10px 15px';
            div.style.borderRadius = '5px';
            div.style.zIndex = '1000';
            div.style.display = 'none';
            div.style.maxWidth = '80%';
            div.style.textAlign = 'center';
            document.body.appendChild(div);
        }
    }

    // Manejar cambio de selección
    function handleSelectChange(selectId, value) {
        // Si se deselecciona una opción, restaurarla en los demás selects
        if (value === "") {
            const previousValue = state.selections[selectId];
            if (previousValue) {
                restoreOptionToOtherSelects(selectId, previousValue);
            }
        } else {
            // Si se selecciona una opción, quitarla de los demás selects
            removeOptionFromOtherSelects(selectId, value);
        }

        // Actualizar estado
        state.selections[selectId] = value;

        // Actualizar disponibilidad de opciones
        updateSelectOptions();

        // Actualizar estado del botón de reinicio
        updateResetButton();

        // Limpiar mensajes de error
        state.showValidateError = false;
        document.getElementById('feedback-message').innerHTML = '';

        // Limpiar cualquier retroalimentación visual previa
        clearFeedbackUI();
    }

    // Limpiar UI de retroalimentación
    function clearFeedbackUI() {
        const selectIds = ['select1', 'select2', 'select3'];

        selectIds.forEach(id => {
            const container = document.getElementById(`${id}-container`);
            const select = document.getElementById(id);
            const correctIcon = container.querySelector('img[src*="checkAct.png"]');
            const incorrectIcon = container.querySelector('img[src*="xmarkAct.png"]');
            const feedbackText = container.querySelector('.feedback-text');

            // Limpiar clases anteriores
            container.classList.remove('correcto-container', 'incorrecto-container');
            select.classList.remove('correct', 'incorrect');

            // Ocultar iconos
            correctIcon.style.display = 'none';
            incorrectIcon.style.display = 'none';

            // Limpiar texto de retroalimentación
            feedbackText.textContent = '';
        });
    }

    // Restaurar opción en otros selects
    function restoreOptionToOtherSelects(exceptSelectId, value) {
        const selectIds = ['select1', 'select2', 'select3'];

        selectIds.forEach(id => {
            if (id !== exceptSelectId) {
                const select = document.getElementById(id);
                const option = Array.from(select.options).find(opt => opt.value === value);

                if (option) {
                    option.disabled = false;
                    option.style.display = 'block';
                }
            }
        });
    }

    // Quitar opción de otros selects
    function removeOptionFromOtherSelects(exceptSelectId, value) {
        const selectIds = ['select1', 'select2', 'select3'];

        selectIds.forEach(id => {
            if (id !== exceptSelectId) {
                const select = document.getElementById(id);
                const option = Array.from(select.options).find(opt => opt.value === value);

                if (option) {
                    option.disabled = true;
                    option.style.display = 'none';

                    // Si esta opción estaba seleccionada, deseleccionarla
                    if (select.value === value) {
                        select.value = "";
                        state.selections[id] = "";
                    }
                }
            }
        });
    }

    // Actualizar opciones disponibles en los selects
    function updateSelectOptions() {
        const selectIds = ['select1', 'select2', 'select3'];

        // Primero, habilitar y mostrar todas las opciones
        selectIds.forEach(id => {
            const select = document.getElementById(id);
            Array.from(select.options).forEach(option => {
                if (option.value !== "") {
                    option.disabled = false;
                    option.style.display = 'block';
                }
            });
        });

        // Luego, deshabilitar y ocultar las opciones seleccionadas en otros selects
        selectIds.forEach(id => {
            const selectedValue = state.selections[id];
            if (selectedValue) {
                removeOptionFromOtherSelects(id, selectedValue);
            }
        });
    }

    // Actualizar estado del botón de reinicio
    function updateResetButton() {
        const hasAnySelection = Object.values(state.selections).some(value => value !== "");
        document.getElementById('reset-btn').disabled = !hasAnySelection;
    }

    // Manejar reproducción de audio
    function handleAudioPlay(audio) {
        // Pausar cualquier audio activo
        if (activeTranscriptionAudio && activeTranscriptionAudio !== audio) {
            activeTranscriptionAudio.pause();

            // Desactivar transcripción del audio anterior
            const previousToggle = activeTranscriptionAudio.closest('.audio-wrapper').querySelector('.transcription-toggle');
            if (previousToggle) {
                previousToggle.style.color = '#666';
            }
        }

        // Establecer nuevo audio activo
        activeTranscriptionAudio = audio;

        // Si la transcripción está activa, actualizarla
        const toggle = audio.closest('.audio-wrapper').querySelector('.transcription-toggle');
        if (toggle && toggle.style.color === '#2a7fba') {
            updateTranscription(audio);
        }
    }

    // Establecer audio actualmente reproduciéndose
    function setCurrentPlayingAudio(audio) {
        activeTranscriptionAudio = audio;
    }

    // Alternar transcripción
    function toggleTranscription(audio, toggleElement) {
        const isActive = toggleElement.style.color === '#2a7fba';

        // Desactivar cualquier transcripción previa
        if (activeTranscriptionAudio && activeTranscriptionAudio !== audio) {
            const previousToggle = activeTranscriptionAudio.closest('.audio-wrapper').querySelector('.transcription-toggle');
            if (previousToggle) {
                previousToggle.style.color = '#666';
            }
        }

        // Activar/desactivar transcripción actual
        if (isActive) {
            toggleElement.style.color = '#666';
            document.getElementById('transcripcion-global').style.display = 'none';
        } else {
            toggleElement.style.color = '#2a7fba';
            if (!audio.paused) {
                updateTranscription(audio);
            }
        }

        // Establecer como audio activo
        activeTranscriptionAudio = audio;
    }

    // Actualizar transcripción
    function updateTranscription(audio) {
        const globalDiv = document.getElementById('transcripcion-global');
        if (!globalDiv) return;

        const transcriptionData = audio.getAttribute('data-transcripcion');
        if (!transcriptionData) return;

        try {
            const transcription = JSON.parse(transcriptionData);
            const currentTime = audio.currentTime;

            const currentText = transcription.find(item =>
                currentTime >= item.start && currentTime <= item.end
            );

            if (currentText) {
                globalDiv.textContent = currentText.text;
                globalDiv.style.display = 'block';
            } else {
                globalDiv.style.display = 'none';
            }
        } catch (e) {
            console.error('Error parsing transcription data:', e);
        }
    }

    // Validar respuestas
    function validateAnswers() {
        // Verificar que todas las opciones estén seleccionadas
        const allSelected = Object.values(state.selections).every(value => value !== "");

        if (!allSelected) {
            state.showValidateError = true;
            document.getElementById('feedback-message').innerHTML =
                '<div class="text-errorPTR" style="color: #8f8f8f; font-weight: bold;">Por favor selecciona todas las opciones antes de validar</div>';
            return;
        }

        // Validar respuestas
        state.validationStatus = {
            select1: state.selections.select1 === CORRECT_ANSWERS.select1,
            select2: state.selections.select2 === CORRECT_ANSWERS.select2,
            select3: state.selections.select3 === CORRECT_ANSWERS.select3
        };

        // Contar respuestas correctas
        state.correctCount = Object.values(state.validationStatus).filter(Boolean).length;
        state.percentage = Math.round((state.correctCount / 3) * 100);

        // Mostrar retroalimentación visual
        updateFeedbackUI();

        // Mostrar mensaje de retroalimentación
        showFeedbackMessage();
    }

    // Actualizar UI de retroalimentación
    function updateFeedbackUI() {
        const selectIds = ['select1', 'select2', 'select3'];

        selectIds.forEach(id => {
            const container = document.getElementById(`${id}-container`);
            const select = document.getElementById(id);
            const correctIcon = container.querySelector('img[src*="checkAct.png"]');
            const incorrectIcon = container.querySelector('img[src*="xmarkAct.png"]');
            const feedbackText = container.querySelector('.feedback-text');

            // Limpiar clases anteriores
            container.classList.remove('correcto-container', 'incorrecto-container');
            select.classList.remove('correct', 'incorrect');

            // Ocultar iconos
            correctIcon.style.display = 'none';
            incorrectIcon.style.display = 'none';

            // Aplicar estilos según validación
            if (state.validationStatus[id]) {
                container.classList.add('correcto-container');
                select.classList.add('correct');
                correctIcon.style.display = 'block';
                feedbackText.innerHTML = '<span style="color: #fff">¡Correcto!</span>';
            } else {
                container.classList.add('incorrecto-container');
                select.classList.add('incorrect');
                incorrectIcon.style.display = 'block';
                feedbackText.innerHTML = '<span style="color: #fff">¡Incorrecto!</span>';
            }
        });
    }

    // Mostrar mensaje de retroalimentación
    function showFeedbackMessage() {
        const feedbackElement = document.getElementById('feedback-message');

        if (state.correctCount === 3) {
            feedbackElement.innerHTML = `
        <p>
          <span style="color: #4caf50; font-weight: bold;">¡Correcto!</span>
          <span style="color: #8f8f8f; font-weight: bold;">
            Todas las respuestas son correctas. (${state.percentage}%)
          </span>
        </p>
      `;
        } else {
            feedbackElement.innerHTML = `
        <p>
          <span style="color: #f44336; font-weight: bold;">¡Incorrecto!</span>
          <span style="color: #8f8f8f; font-weight: bold;">
            Tienes ${state.correctCount} de 3 respuestas correctas. Intenta de nuevo. (${state.percentage}%)
          </span>
        </p>
      `;
        }
    }

    // Reiniciar actividad
    function handleReset() {
        // Reiniciar estado
        state.selections = {
            select1: "",
            select2: "",
            select3: ""
        };
        state.validationStatus = {};
        state.showValidateError = false;
        state.percentage = 0;
        state.correctCount = 0;

        // Reiniciar UI
        const selectIds = ['select1', 'select2', 'select3'];

        selectIds.forEach(id => {
            const select = document.getElementById(id);
            select.value = "";

            const container = document.getElementById(`${id}-container`);
            container.classList.remove('correcto-container', 'incorrecto-container');

            const selectElement = document.getElementById(id);
            selectElement.classList.remove('correct', 'incorrect');

            const correctIcon = container.querySelector('img[src*="checkAct.png"]');
            const incorrectIcon = container.querySelector('img[src*="xmarkAct.png"]');
            const feedbackText = container.querySelector('.feedback-text');

            correctIcon.style.display = 'none';
            incorrectIcon.style.display = 'none';
            feedbackText.textContent = '';
        });

        // Restaurar todas las opciones en los selects
        const allOptions = ["velocidad", "comunicacion", "seguridad"];
        selectIds.forEach(id => {
            const select = document.getElementById(id);
            Array.from(select.options).forEach(option => {
                if (option.value !== "") {
                    option.disabled = false;
                    option.style.display = 'block';
                }
            });
        });

        // Actualizar botón de reinicio
        updateResetButton();

        // Limpiar mensajes de feedback
        document.getElementById('feedback-message').innerHTML = '';

        // Pausar todos los audios
        const audios = document.querySelectorAll('.audio-con-transcripcion');
        audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        // Ocultar transcripción global
        const globalDiv = document.getElementById('transcripcion-global');
        if (globalDiv) {
            globalDiv.style.display = 'none';
        }

        // Reiniciar toggles de transcripción
        const toggles = document.querySelectorAll('.transcription-toggle');
        toggles.forEach(toggle => {
            toggle.style.color = '#666';
        });
    }

    // Inicializar la actividad
    initializeActivity();
}