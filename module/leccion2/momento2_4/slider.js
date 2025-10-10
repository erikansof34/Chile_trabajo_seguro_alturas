export function init() {
  function showMessage(message, event) {
    closeMessage();

    let messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.innerHTML = `${message} <button class="close-button">&times;</button>`;

    let buttonRect = event.target.getBoundingClientRect();
    let containerRect = document.querySelector('.image-container1').getBoundingClientRect();

    if (window.innerWidth <= 768) {
      messageBox.style.top = `${containerRect.top}px`;
      messageBox.style.left = `10px`;
    } else {
      messageBox.style.top = `${buttonRect.top - containerRect.top + buttonRect.height / 2}px`;
      messageBox.style.left = `${buttonRect.left - containerRect.left + buttonRect.width / 2}px`;
    }

    document.querySelector('.image-container1').appendChild(messageBox);
    messageBox.querySelector('.close-button').addEventListener('click', closeMessage);

    messageBox.style.display = 'block';
    document.getElementById('imageContainer').classList.add('darkened');

    document.addEventListener('click', outsideClickListener);
  }

  function closeMessage() {
    let messageBox = document.querySelector('.message-box');
    if (messageBox) {
      messageBox.remove();
    }

    document.getElementById('imageContainer').classList.remove('darkened');
    document.removeEventListener('click', outsideClickListener);
  }

  function outsideClickListener(event) {
    let messageBox = document.querySelector('.message-box');
    if (messageBox && !messageBox.contains(event.target) && !event.target.classList.contains('circle-button')) {
      closeMessage();
    }
  }

  function showMessageestado(message, event) {
    closeMessageestado();

    let messageBoxestado = document.createElement('div');
    messageBoxestado.className = 'message-boxestado';
    messageBoxestado.innerHTML = `${message} <button class="close-buttonestado">&times;</button>`;

    let buttonRectestado = event.target.getBoundingClientRect();
    let containerRectestado = document.querySelector('.image-container1estado').getBoundingClientRect();

    if (window.innerWidth <= 768) {
      messageBoxestado.style.top = `${containerRectestado.top}px`;
      messageBoxestado.style.left = `10px`;
    } else {
      messageBoxestado.style.top = `${buttonRectestado.top - containerRectestado.top + buttonRectestado.height / 2}px`;
      messageBoxestado.style.left = `${buttonRectestado.left - containerRectestado.left + buttonRectestado.width / 2}px`;
    }

    document.querySelector('.image-container1estado').appendChild(messageBoxestado);
    messageBoxestado.querySelector('.close-buttonestado').addEventListener('click', closeMessageestado);

    messageBoxestado.style.display = 'block';
    document.getElementById('imageContainerestado').classList.add('darkenedestado');

    document.addEventListener('click', outsideClickListenerestado);
  }

  function closeMessageestado() {
    let messageBoxestado = document.querySelector('.message-boxestado');
    if (messageBoxestado) {
      messageBoxestado.remove();
    }

    document.getElementById('imageContainerestado').classList.remove('darkenedestado');
    document.removeEventListener('click', outsideClickListenerestado);
  }

  function outsideClickListenerestado(event) {
    let messageBoxestado = document.querySelector('.message-boxestado');
    if (messageBoxestado && !messageBoxestado.contains(event.target) && !event.target.classList.contains('circle-buttonestado')) {
      closeMessageestado();
    }
  }

  window.showMessage = showMessage;
  window.showMessageestado = showMessageestado;

  document.querySelectorAll('.circle-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const onclick = button.getAttribute('onclick');
      const message = onclick.match(/'([^']+)'/)[1];
      showMessage(message, event);
    });
  });

  document.querySelectorAll('.circle-buttonestado').forEach(button => {
    button.addEventListener('click', (event) => {
      const onclick = button.getAttribute('onclick');
      const message = onclick.match(/'([^']+)'/)[1];
      showMessageestado(message, event);
    });
  });
}
