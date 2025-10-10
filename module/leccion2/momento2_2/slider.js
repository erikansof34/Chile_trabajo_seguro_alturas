export function init() {
    // Variables de estado compartidas
    let items = {
        drop1: null,
        drop2: null,
        drop3: null
    };

    let verificationImages = {};
    let validationMessages = {
        drop1: { text: "", class: "" },
        drop2: { text: "", class: "" },
        drop3: { text: "", class: "" }
    };

    let isResetDisabled = true;

    // Opciones de la actividad
    const options = [
        {
            id: "option3",
            text: [
                "Uso de arneses con líneas de vida",
                "Implementar áreas de exclusión debajo de la zona de trabajo",
                "Uso de redes de protección para caída de herramientas o materiales"
            ],
            label: "Peligro 3"
        },
        {
            id: "option1",
            text: [
                "Inspección previa y periódica de los equipos de sujeción",
                "Capacitación sobre el uso correcto de arneses y sistemas de sujeción",
                "Uso obligatorio de líneas de vida certificadas",
                "Sistema de doble anclaje"
            ],
            label: "Peligro 1"
        },
        {
            id: "option2",
            text: [
                "Verificación de estabilidad de la plataforma antes de usarla",
                "Certificación del equipo",
                "Uso de líneas de vida adicionales para seguridad"
            ],
            label: "Peligro 2"
        }
    ];

    // Elementos del DOM - Desktop
    const draggableOptions = document.querySelectorAll('.draggable-option1');
    const dropAreas = document.querySelectorAll('.drop-area1');
    const dropZones = document.querySelectorAll('.drop-zone1');
    const resetButton = document.getElementById('reset-button');
    const validationSummary = document.querySelector('.validation-summary1');

    // Elementos del DOM - Mobile
    const mobileSelects = document.querySelectorAll('.mobile-select1');
    const mobileDropZones = document.querySelectorAll('.mobile-drop-zone1');
    const mobileResetButton = document.getElementById('mobile-reset-button');

    // Inicializar ambas versiones
    function initializeActivity() {
        initializeDesktopVersion();
        initializeMobileVersion();
        updateResetButtons();
        updateMobileSelectOptions();
    }

    // ===== VERSIÓN DESKTOP =====
    function initializeDesktopVersion() {
        // Configurar eventos para elementos arrastrables
        draggableOptions.forEach(option => {
            option.setAttribute('draggable', 'true');
            option.addEventListener('dragstart', handleDragStart);
            option.addEventListener('dragend', handleDragEnd);
        });

        // Configurar eventos para áreas de drop
        dropAreas.forEach(area => {
            area.addEventListener('dragover', handleDragOver);
            area.addEventListener('dragenter', handleDragEnter);
            area.addEventListener('dragleave', handleDragLeave);
            area.addEventListener('drop', handleDrop);
        });

        // Configurar botón de reinicio desktop
        if (resetButton) {
            resetButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReset();
            });
        }
    }

    // Manejar inicio de arrastre
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-option-id'));
        e.target.classList.add('dragging');

        // Agregar efecto visual a todas las áreas de drop
        dropAreas.forEach(area => {
            if (!area.textContent) {
                area.classList.add('drop-over1');
            }
        });
    }

    // Manejar fin de arrastre
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        dropAreas.forEach(area => {
            area.classList.remove('drop-over1');
        });
    }

    // Manejar cuando un elemento está sobre un área de drop
    function handleDragOver(e) {
        e.preventDefault();
    }

    // Manejar cuando un elemento entra en un área de drop
    function handleDragEnter(e) {
        e.preventDefault();
        const dropArea = e.target.closest('.drop-area1');
        if (dropArea && !dropArea.textContent) {
            dropArea.classList.add('drop-over1');
        }
    }

    // Manejar cuando un elemento sale de un área de drop
    function handleDragLeave(e) {
        const dropArea = e.target.closest('.drop-area1');
        if (dropArea && !dropArea.textContent) {
            dropArea.classList.remove('drop-over1');
        }
    }

    // Manejar cuando se suelta un elemento en un área de drop
    function handleDrop(e) {
        e.preventDefault();
        const dropArea = e.target.closest('.drop-area1');

        if (!dropArea) return;
        if (dropArea.textContent) return;

        const optionId = e.dataTransfer.getData('text/plain');
        const option = options.find(opt => opt.id === optionId);

        if (!option) return;

        const dropId = dropArea.getAttribute('data-drop-area');
        handleItemSelection(dropId, optionId, 'desktop');
    }

    // ===== VERSIÓN MOBILE =====
    function initializeMobileVersion() {
        // Configurar eventos para selects
        mobileSelects.forEach(select => {
            select.addEventListener('change', handleSelectChange);
        });

        // Configurar botón de reinicio mobile
        if (mobileResetButton) {
            mobileResetButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReset();
            });
        }
    }

    // Manejar cambio en selects
    function handleSelectChange(e) {
        const select = e.target;
        const dropId = select.getAttribute('data-drop-area');
        const optionId = select.value;

        if (optionId) {
            handleItemSelection(dropId, optionId, 'mobile');
        } else {
            // Si se deselecciona, limpiar el estado y actualizar selects
            if (items[dropId]) {
                items[dropId] = null;
                delete verificationImages[dropId];
                validationMessages[dropId] = { text: "", class: "" };

                // Limpiar UI del select actual
                const dropZone = select.closest('.mobile-drop-zone1');
                const verificationImage = dropZone.querySelector('.mobile-verification-image1');
                const validationMessageEl = dropZone.querySelector('.mobile-validation-message1');

                verificationImage.style.display = 'none';
                validationMessageEl.textContent = '';
                validationMessageEl.className = 'mobile-validation-message1';
                dropZone.className = 'mobile-drop-zone1';
                select.disabled = false;

                updateMobileSelectOptions();
                updateResetButtons();
            }
        }
    }

    // ===== LÓGICA COMPARTIDA =====
    function handleItemSelection(dropId, optionId, version) {
        // Actualizar estado
        items[dropId] = optionId;
        const option = options.find(opt => opt.id === optionId);

        // Verificar si la respuesta es correcta
        const isCorrect =
            (dropId === "drop1" && optionId === "option1") ||
            (dropId === "drop2" && optionId === "option2") ||
            (dropId === "drop3" && optionId === "option3");

        // Actualizar imágenes de verificación
        verificationImages[dropId] = isCorrect ? "correct" : "incorrect";

        // Actualizar mensajes de validación
        validationMessages[dropId] = {
            text: isCorrect
                ? "¡Muy bien! estas medidas de control te ayudarán a controlar estos riesgos.​"
                : "¡Piénsalo bien! Estas medidas de control NO son las adecuadas para estos riesgos.",
            class: isCorrect ? "success1" : "error1"
        };

        // Actualizar UI según la versión
        if (version === 'desktop') {
            updateDesktopUI(dropId, option, isCorrect);
        } else {
            updateMobileUI(dropId, optionId, isCorrect);
        }

        // Actualizar botones de reinicio
        updateResetButtons();

        // Verificar si todas las áreas tienen contenido
        if (Object.values(items).every(Boolean)) {
            handleValidation();
        }
    }

    function updateDesktopUI(dropId, option, isCorrect) {
        const dropArea = document.querySelector(`[data-drop-area="${dropId}"]`);
        const dropZone = dropArea.closest('.drop-zone1');
        const verificationImage = dropZone.querySelector('.verification-image1');
        const validationMessageEl = dropZone.querySelector('.validation-message1');

        // Actualizar área de drop
        dropArea.textContent = option.label;
        dropArea.classList.remove('drop-over1');

        // Ocultar opción arrastrable
        const draggedOption = document.querySelector(`[data-option-id="${option.id}"]`);
        if (draggedOption) {
            draggedOption.style.display = 'none';
        }

        // Mostrar imagen de verificación
        const checkPath = "../../assets/img/botones/checkAct.png";
        const uncheckPath = "../../assets/img/botones/xmarkAct.png";

        verificationImage.style.display = 'block';
        verificationImage.style.backgroundImage = `url(${isCorrect ? checkPath : uncheckPath})`;
        verificationImage.style.backgroundSize = 'contain';
        verificationImage.style.backgroundRepeat = 'no-repeat';

        // Mostrar mensaje de validación
        validationMessageEl.textContent = validationMessages[dropId].text;
        validationMessageEl.className = `validation-message1 ${validationMessages[dropId].class}`;

        // Actualizar clases
        if (isCorrect) {
            dropArea.classList.add('drop-correct1');
            dropZone.classList.add('correct1');
        } else {
            dropArea.classList.add('drop-incorrect1');
            dropZone.classList.add('incorrect1');
        }
    }

    function updateMobileUI(dropId, optionId, isCorrect) {
        const dropZone = document.querySelector(`.mobile-drop-zone1[data-drop-id="${dropId}"]`);
        const verificationImage = dropZone.querySelector('.mobile-verification-image1');
        const validationMessageEl = dropZone.querySelector('.mobile-validation-message1');
        const select = dropZone.querySelector('.mobile-select1');

        // Mostrar imagen de verificación
        const checkPath = "../../assets/img/botones/checkAct.png";
        const uncheckPath = "../../assets/img/botones/xmarkAct.png";

        verificationImage.style.display = 'block';
        verificationImage.style.backgroundImage = `url(${isCorrect ? checkPath : uncheckPath})`;
        verificationImage.style.backgroundSize = 'contain';
        verificationImage.style.backgroundRepeat = 'no-repeat';

        // Mostrar mensaje de validación
        validationMessageEl.textContent = validationMessages[dropId].text;
        validationMessageEl.className = `mobile-validation-message1 ${validationMessages[dropId].class}`;

        // Actualizar clases del drop zone
        if (isCorrect) {
            dropZone.classList.add('correct1');
        } else {
            dropZone.classList.add('incorrect1');
        }

        // Deshabilitar el select una vez seleccionado
        select.disabled = true;

        // Actualizar opciones en otros selects
        updateMobileSelectOptions();
    }

    function handleValidation() {
        const totalCorrect = Object.values(verificationImages).filter(
            status => status === "correct"
        ).length;

        const percentage = Math.round((totalCorrect / options.length) * 100);
        const validationMessage = `Tus respuestas correctas son: ${totalCorrect} de 3 (${percentage}%)`;

        // Mostrar resumen de validación en desktop
        if (validationSummary) {
            validationSummary.textContent = validationMessage;
            validationSummary.style.display = 'block';
        }
    }

    function handleReset() {
        // Reiniciar estado
        items = {
            drop1: null,
            drop2: null,
            drop3: null
        };

        verificationImages = {};
        validationMessages = {
            drop1: { text: "", class: "" },
            drop2: { text: "", class: "" },
            drop3: { text: "", class: "" }
        };

        // Reiniciar UI Desktop
        dropAreas.forEach(area => {
            area.textContent = '';
            area.className = 'drop-area1';
        });

        draggableOptions.forEach(option => {
            option.style.display = 'flex';
        });

        document.querySelectorAll('.verification-image1').forEach(img => {
            img.style.display = 'none';
        });

        document.querySelectorAll('.validation-message1').forEach(msg => {
            msg.textContent = '';
            msg.className = 'validation-message1';
        });

        dropZones.forEach(zone => {
            zone.className = 'drop-zone1';
        });

        if (validationSummary) {
            validationSummary.style.display = 'none';
        }

        // Reiniciar UI Mobile
        mobileSelects.forEach(select => {
            select.value = '';
            select.disabled = false;
        });

        document.querySelectorAll('.mobile-verification-image1').forEach(img => {
            img.style.display = 'none';
        });

        document.querySelectorAll('.mobile-validation-message1').forEach(msg => {
            msg.textContent = '';
            msg.className = 'mobile-validation-message1';
        });

        mobileDropZones.forEach(zone => {
            zone.className = 'mobile-drop-zone1';
        });

        // Actualizar botones
        updateResetButtons();

        // Actualizar opciones en selects mobile
        updateMobileSelectOptions();
    }

    // Función para actualizar las opciones disponibles en los selects mobile
    function updateMobileSelectOptions() {
        const selectedValues = Object.values(items).filter(Boolean);

        mobileSelects.forEach(select => {
            const currentValue = select.value;
            const dropId = select.getAttribute('data-drop-area');

            // Limpiar opciones existentes (excepto la primera)
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }

            // Agregar opciones disponibles
            options.forEach(option => {
                // Mostrar la opción si:
                // 1. No está seleccionada en ningún otro select, O
                // 2. Es la opción actualmente seleccionada en este select
                if (!selectedValues.includes(option.id) || option.id === currentValue) {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.id;
                    optionElement.textContent = option.label;
                    select.appendChild(optionElement);
                }
            });

            // Restaurar el valor seleccionado si existe
            if (currentValue && items[dropId] === currentValue) {
                select.value = currentValue;
            }
        });
    }

    function updateResetButtons() {
        const hasSelectedItems = Object.values(items).some(item => item !== null);
        isResetDisabled = !hasSelectedItems;

        if (resetButton) resetButton.disabled = isResetDisabled;
        if (mobileResetButton) mobileResetButton.disabled = isResetDisabled;
    }

    // Inicializar la actividad cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeActivity);
    } else {
        initializeActivity();
    }
}