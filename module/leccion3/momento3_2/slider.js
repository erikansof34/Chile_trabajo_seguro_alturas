export function init() {
    // Función para cerrar el mensaje
    function closeMessage_epp() {
        let messageBox_epp = document.querySelector('.message-box_epp');
        if (messageBox_epp) {
            const audioElement = messageBox_epp.querySelector('.audio-con-transcripcion');
            if (audioElement) {
                audioElement.pause();
                Object.entries(audioElement._transcriptionEvents || {}).forEach(([event, handler]) => {
                    audioElement.removeEventListener(event, handler);
                });
            }
            messageBox_epp.remove();
        }

        const transcripcionGlobal = document.getElementById('transcripcion-global');
        if (transcripcionGlobal) {
            transcripcionGlobal.style.display = 'none';
            transcripcionGlobal.textContent = '';
        }

        document.getElementById('imageContainer_epp').classList.remove('darkened_epp');
        document.removeEventListener('click', outsideClickListener_epp);
    }

    // Listener para clics fuera del mensaje
    function outsideClickListener_epp(event) {
        let messageBox_epp = document.querySelector('.message-box_epp');
        if (messageBox_epp &&
            !messageBox_epp.contains(event.target) &&
            !event.target.classList.contains('circle-button_epp')) {
            closeMessage_epp();
        }
    }

    // Función principal para mostrar el reproductor con transcripción
    function showAudioWithTranscription_epp(button, message, event) {
        closeMessage_epp();
        event.stopPropagation();

        // 1. Crear el contenedor del mensaje
        let messageBox_epp = document.createElement('div');
        messageBox_epp.className = 'message-box_epp';

        // 2. Crear el reproductor de audio con estructura normal
        let audioContainer = document.createElement('div');
        audioContainer.className = 'audio-center';

        let audioElement = document.createElement('audio');
        audioElement.className = 'audio-con-transcripcion';
        audioElement.controls = true;
        audioElement.setAttribute('data-transcripcion', button.getAttribute('data-transcripcion'));
        audioElement.innerHTML = `<source src="${button.getAttribute('data-audio')}" type="audio/mp3">`;

        let toggleButton = document.createElement('i');
        toggleButton.className = 'transcription-toggle fas fa-closed-captioning audio-estilos';

        audioContainer.appendChild(audioElement);
        audioContainer.appendChild(toggleButton);

        // 3. Construir el contenido del messageBox
        messageBox_epp.innerHTML = `
        ${message}
        <button class="close-button_epp" onclick="closeMessage_epp()">&times;</button>
    `;
        messageBox_epp.appendChild(audioContainer);

        // 4. Posicionamiento
        let buttonRect_epp = button.getBoundingClientRect();
        let containerRect_epp = document.querySelector('.image-epp').getBoundingClientRect();

        if (window.innerWidth <= 768) {
            messageBox_epp.style.top = `${containerRect_epp.top}px`;
            messageBox_epp.style.left = `10px`;
        } else {
            messageBox_epp.style.top = `${buttonRect_epp.top - containerRect_epp.top + buttonRect_epp.height / 2}px`;
            messageBox_epp.style.left = `${buttonRect_epp.left - containerRect_epp.left + buttonRect_epp.width / 2}px`;
        }

        document.querySelector('.image-epp').appendChild(messageBox_epp);
        messageBox_epp.style.display = 'block';
        document.getElementById('imageContainer_epp').classList.add('darkened_epp');

        // 5. Inicializar eventos y autoplay
        initSliderAudioTranscription(audioElement, toggleButton);

        // Autoplay con manejo de errores
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevenido, mostrando controles");
                audioElement.controls = true;
            });
        }

        document.addEventListener('click', outsideClickListener_epp);
    }

    // Función para inicializar la transcripción
    function initSliderAudioTranscription(audioElement, toggleButton) {
        const transcripcionGlobal = document.getElementById('transcripcion-global');
        let textos = [];

        try {
            textos = JSON.parse(audioElement.getAttribute('data-transcripcion'));
        } catch (e) {
            console.error('Error al parsear data-transcripcion:', e);
            return;
        }

        // Función de actualización
        function updateTranscripcion() {
            if (!audioElement || audioElement.readyState === 0) return;

            const tiempoActual = audioElement.currentTime;
            const textoActual = textos.find(item => tiempoActual >= item.start && tiempoActual <= item.end);

            if (toggleButton.classList.contains('active')) {
                transcripcionGlobal.textContent = textoActual?.text || '';
                transcripcionGlobal.style.display = textoActual ? 'block' : 'none';
            }

            if (!audioElement.paused && !audioElement.ended) {
                requestAnimationFrame(updateTranscripcion);
            }
        }

        // Eventos del botón de transcripción
        toggleButton.addEventListener('click', function () {
            this.classList.toggle('active');
            this.style.color = this.classList.contains('active') ? '#2a7fba' : '#666';

            if (this.classList.contains('active')) {
                updateTranscripcion();
            } else {
                transcripcionGlobal.style.display = 'none';
            }
        });

        // Eventos del audio
        const audioEvents = {
            play: () => {
                if (toggleButton.classList.contains('active')) {
                    updateTranscripcion();
                }
            },
            pause: () => {
                transcripcionGlobal.style.display = 'none';
            },
            ended: () => {
                transcripcionGlobal.style.display = 'none';
                toggleButton.classList.remove('active');
                toggleButton.style.color = '#666';
            },
            timeupdate: () => {
                if (toggleButton.classList.contains('active') && !audioElement.paused) {
                    updateTranscripcion();
                }
            }
        };

        // Registrar eventos
        Object.entries(audioEvents).forEach(([event, handler]) => {
            audioElement.addEventListener(event, handler);
        });

        // Guardar referencia para limpieza
        audioElement._transcriptionEvents = audioEvents;
    }

    // Exponer funciones globalmente
    window.showAudioWithTranscription_epp = showAudioWithTranscription_epp;
    window.closeMessage_epp = closeMessage_epp;
}