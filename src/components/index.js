// Подключение модулей
import '../pages/index.css';
import { createCard } from './card.js';
import { openModal, closeModal, closeByEsc } from './modal.js';
import { enableValidation } from './validate.js';
import { getUser, patchUser, patchAvatar, getInitialCards, postCard } from './api.js';


// DOM узлы
const content = document.querySelector('.content');
const avatarEdditButton = content.querySelector('.profile__avatar-button');
const profileImage = content.querySelector('.profile__image')
const profileTitle = content.querySelector('.profile__title');
const profileEditButton = content.querySelector('.profile__edit-button');
const profileDescription = content.querySelector('.profile__description');
const cardAddButton = content.querySelector('.profile__add-button');
const placesList = content.querySelector('.places__list');

const profilePopup = document.querySelector('.popup_type_edit');
const profileForm = profilePopup.querySelector('.popup__form[name="edit-profile"]');
const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileDescriptionInput = profilePopup.querySelector('.popup__input_type_description');

const cardPopup = document.querySelector('.popup_type_new-card');
const cardForm = cardPopup.querySelector('.popup__form[name="new-place"]');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarPopup.querySelector('.popup__input_type_url');

const popups = document.querySelectorAll('.popup');
const closeButtons = document.querySelectorAll('.popup__close');

let userId;

// Объект с настройками валидации
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};


// Функция рендера пользователя
function renderUser({ name, about, avatar }) {
    profileTitle.textContent = name;
    profileDescription.textContent = about;
    profileImage.src = avatar;
    profileImage.alt = name;
}

// Функция отображения начальных карточек
function renderInitialCards(initialCards, userId) {
    initialCards.forEach(cardItem => {
        const card = createCard(cardItem, userId);
        placesList.append(card);
    });
}

// Начальная загрузка данных
Promise.all([getUser(), getInitialCards()])
    .then(([userData, initialCards]) => {
        renderUser(userData);
        userId = userData._id;
        renderInitialCards(initialCards, userId);
    })
    .catch(error => console.error(`Ошибка загрузки данных: ${error}`));

// Функция для обработки состояния кнопки
function setButtonLoadingState(button, isLoading) {
    if (isLoading) {
        button.textContent = "Сохранение...";
        button.disabled = true;
    } else {
        button.textContent = "Сохранить";
        button.disabled = false;
    }
}

// Включение валидации
enableValidation(validationSettings);

// Закрытие попапа на Escape
document.addEventListener('keydown', closeByEsc);

// Кнопки закрытия попапов
closeButtons.forEach(button => {
    button.addEventListener('click', evt => {
        const popup = evt.target.closest('.popup');
        closeModal(popup);
    });
});

// Добавление анимации для popups
popups.forEach(popup => {
    popup.classList.add('popup_is-animated');
    popup.addEventListener('click', evt => {
        if (evt.target === popup) {
            closeModal(popup);
        }
    });
});

// Кнопка изменения данных профиля
profileEditButton.addEventListener('click', () => {
    openModal(profilePopup);

    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
});

// Кнопка создания карточки
cardAddButton.addEventListener('click', () => openModal(cardPopup));

// Кнопка редактирования аватара
avatarEdditButton.addEventListener('click', () => openModal(avatarPopup));

// Подтверждение информации о профиле
profileForm.addEventListener('submit', (evt) => {
    const username = profileNameInput.value;
    const description = profileDescriptionInput.value;
    const submitButton = evt.target.querySelector('button');

    setButtonLoadingState(submitButton, true);
    
    patchUser(username, description)
        .then(data => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            closeModal(profilePopup);
        })
        .catch(error => console.error(`Ошибка обновления профиля ${error}`))
        .finally(() => setButtonLoadingState(submitButton, false));
});

// Подтверждение создания новой карточки
cardForm.addEventListener('submit', (evt) => {
    const name = cardNameInput.value;
    const link = cardLinkInput.value;
    const submitButton = evt.target.querySelector('button');
    
    setButtonLoadingState(submitButton, true);

    postCard(name, link)
        .then(card => {
            const cardElement = createCard(card, userId);
            placesList.prepend(cardElement);
            cardForm.reset();
            closeModal(cardPopup);
        })
        .catch(error => console.error(`Ошибка создания карточки ${error}`))
        .finally(() => setButtonLoadingState(submitButton, false));
});

// Подтверждение изменения аватара
avatarForm.addEventListener('submit', (evt) => {
    const avatar = avatarInput.value;
    const submitButton = evt.target.querySelector('button');

    setButtonLoadingState(submitButton, true);
    
    patchAvatar(avatar)
        .then(avatar => {
            profileImage.src = avatar.avatar;
            cardForm.reset();
            closeModal(avatarPopup);
        })
        .catch(error => console.error(`Ошибка изменения аватара ${error}`))
        .finally(() => setButtonLoadingState(submitButton, false));
});