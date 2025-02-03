// Начальные карточки
import { initialCards } from "./cards.js";

// DOM узлы
const content = document.querySelector('.content');
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

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const popups = document.querySelectorAll('.popup'); 
const closeButtons = document.querySelectorAll('.popup__close');

// Функция создания карточки
function createCard({name, link}) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = link;
    cardImage.alt = name;
    
    cardElement.querySelector('.card__title').textContent = name;
    
    cardImage.addEventListener('click', () => {
        popupImage.src = link;
        popupCaption.textContent = name;
        openModal(imagePopup);
    });

    cardElement.querySelector('.card__like-button').addEventListener('click', (evt) => {
        evt.target.classList.toggle('card__like-button_is-active');
    });

    cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
        cardElement.remove();
    });

    return cardElement;
}


// Функция отображения начальных карточек
function showInitialCards(cards) {
    cards.forEach((cardItem) => {
        const card = createCard(cardItem);
        placesList.append(card);
    });
}


// Функция открытия модального окна
function openModal(popup) {
    popup.classList.add('popup_is-opened');
}


// Функция закрытия модального окна
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

function closeByEsc(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if(openedPopup) {
            closeModal(openedPopup);
        }
    }
}


// Вывод карточек на страницу
showInitialCards(initialCards);


document.addEventListener('keydown', closeByEsc);


// document.addEventListener('click', (evt) => {
//     const wrap = evt.target.classList.contains('popup');
//     if(!wrap) {
//         evt.preventDefault
//     }
// });

// Кнопки закрытия попапов
closeButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
        const popup = evt.target.closest('.popup');
        closeModal(popup);
    });
});


// Добавление анимации для popups
popups.forEach((popup) => {
    popup.classList.add('popup_is-animated');
    popup.addEventListener('click', (evt) => {
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


profileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    profileTitle.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModal(profilePopup);
});


// Кнопка создания карточки
cardAddButton.addEventListener('click', () => {
    openModal(cardPopup);
});


cardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const newCard = {
        name: cardNameInput.value,
        link: cardLinkInput.value
    };

    const newCardElement = createCard(newCard);
    placesList.prepend(newCardElement);

    closeModal(cardPopup);

    cardForm.reset();
});