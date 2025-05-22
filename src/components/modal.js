// Функция открытия модального окна
function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

// Функция закрытия модального окна
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

// Функция закрытия модального окна на Escape
function closeByEsc(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if(openedPopup) {
            closeModal(openedPopup);
        }
    }
}

export { openModal, closeModal, closeByEsc };