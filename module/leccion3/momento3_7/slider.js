export function init() {
    // ---------------------------------------------- //
    // SLIDER 7 LECCION 3 - VERSIÓN CON TRANSCRIPCIÓN
    // ---------------------------------------------- //

    function showAudioWithTranscription_sld22emergencia(button, message, event) {
        closeMessage_sld22emergencia();
        event.stopPropagation();

        // 1. Crear el contenedor del mensaje
        let messageBox = document.createElement('div');
        messageBox.className = 'message-box_sld22emergencia';

        // 2. Crear el reproductor de audio completo
        let audioContainer = document.createElement('div');
        audioContainer.className = 'audio-container-slider';

        let audioElement = document.createElement('audio');
        audioElement.className = 'audio-con-transcripcion slider-audio audio-reducido-modal';
        audioElement.controls = true;
        audioElement.setAttribute('data-transcripcion', button.getAttribute('data-transcripcion'));
        audioElement.innerHTML = `<source src="${button.getAttribute('data-audio')}" type="audio/mp3">`;

        let toggleButton = document.createElement('i');
        toggleButton.className = 'transcription-toggle-slider fas fa-closed-captioning';
        toggleButton.setAttribute('title', 'Activar subtítulos');

        audioContainer.appendChild(audioElement);
        audioContainer.appendChild(toggleButton);

        // 3. Construir el contenido del messageBox
        messageBox.innerHTML = `
        ${message}
        <button class="close-button_sld22emergencia" onclick="closeMessage_sld22emergencia()">&times;</button>
    `;
        messageBox.appendChild(audioContainer);

        // 4. Ajustar solo para mobile
        if (window.innerWidth <= 768) {
            messageBox.style.position = 'fixed';
            messageBox.style.top = '10px';
            messageBox.style.left = '10px';
            messageBox.style.width = 'calc(100% - 80px)';
            messageBox.style.zIndex = '1000';
            messageBox.style.transform = 'none';
        }

        document.querySelector('.image-sld22emergencia').appendChild(messageBox);
        messageBox.style.display = 'block';
        document.getElementById('imageContainer_sld22emergencia').classList.add('darkened_sld22emergencia');

        // 5. Inicializar eventos y autoplay
        initSliderAudioTranscription_sld22emergencia(audioElement, toggleButton);

        // Autoplay con manejo de errores
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevenido, mostrando controles");
                audioElement.controls = true;
            });
        }

        document.addEventListener('click', outsideClickListener_sld22emergencia);
    }

    function initSliderAudioTranscription_sld22emergencia(audioElement, toggleButton) {
        const transcripcionGlobal = document.getElementById('transcripcion-global');
        let textos = [];

        try {
            textos = JSON.parse(audioElement.getAttribute('data-transcripcion'));
        } catch (e) {
            console.error('Error al parsear data-transcripcion:', e);
            return;
        }

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

        Object.entries(audioEvents).forEach(([event, handler]) => {
            audioElement.addEventListener(event, handler);
        });

        audioElement._transcriptionEvents = audioEvents;
    }

    function closeMessage_sld22emergencia() {
        let messageBox = document.querySelector('.message-box_sld22emergencia');
        if (messageBox) {
            const audioElement = messageBox.querySelector('.slider-audio');
            if (audioElement) {
                audioElement.pause();
                Object.entries(audioElement._transcriptionEvents || {}).forEach(([event, handler]) => {
                    audioElement.removeEventListener(event, handler);
                });
            }

            messageBox.remove();
        }

        const transcripcionGlobal = document.getElementById('transcripcion-global');
        if (transcripcionGlobal) {
            transcripcionGlobal.style.display = 'none';
            transcripcionGlobal.textContent = '';
        }

        document.getElementById('imageContainer_sld22emergencia').classList.remove('darkened_sld22emergencia');
        document.removeEventListener('click', outsideClickListener_sld22emergencia);
    }

    function outsideClickListener_sld22emergencia(event) {
        let messageBox = document.querySelector('.message-box_sld22emergencia');
        if (messageBox &&
            !messageBox.contains(event.target) &&
            !event.target.classList.contains('circle-button_sld22emergencia')) {
            closeMessage_sld22emergencia();
        }
    }

    // Exponer funciones globalmente
    window.showAudioWithTranscription_sld22emergencia = showAudioWithTranscription_sld22emergencia;
    window.closeMessage_sld22emergencia = closeMessage_sld22emergencia;
}

