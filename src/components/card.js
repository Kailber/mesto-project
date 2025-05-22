import { deleteCard, putCardLike, deleteCardLike } from './api';
import { closeModal, openModal } from './modal';

function updateCardLikes(likeButton, likeCounter, likes, userId) {
    likeCounter.textContent = likes.length > 0 ? likes.length : '';
    if (likes.some(user => user._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    } else {
        likeButton.classList.remove('card__like-button_is-active');
    }
}

// Функция создания карточки
export function createCard(card, userId) {
    const { name, link, likes, _id, owner } = card;
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const deleteCardPopup = document.querySelector('.popup_type_delete-card');
    const submitButton = deleteCardPopup.querySelector('.popup__button');

    const imagePopup = document.querySelector('.popup_type_image');
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');

    cardElement.querySelector('.card__title').textContent = name;
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCounter = cardElement.querySelector('.card__like-count');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = link;
    cardImage.alt = name;
    
    updateCardLikes(likeButton, likeCounter, likes, userId);

    cardImage.addEventListener('click', () => {
        popupImage.src = link;
        popupImage.alt = name;
        popupCaption.textContent = name;
        
        openModal(imagePopup);
    });

    likeButton.addEventListener('click', () => {
        const isLiked = likeButton.classList.contains('card__like-button_is-active');
        const toggleLike = isLiked ? deleteCardLike(_id) : putCardLike(_id);

        toggleLike
            .then(updatedCard => updateCardLikes(likeButton, likeCounter, updatedCard.likes, userId))
            .catch(error => console.error(`Ошибка обработки лайка: ${error}`));
    });

    if (owner._id !== userId) {
        deleteButton.remove()
    } else {
        deleteButton.addEventListener('click', () => {
            openModal(deleteCardPopup);

            const confirmHandler = () => {
                submitButton.textContent = "Удаление...";
                submitButton.disabled = true;
                deleteCard(_id)
                    .then(() => {
                        cardElement.remove();
                        closeModal(deleteCardPopup);
                    })
                    .catch((error) => {
                        console.error(`Ошибка удаления карточки: ${error}`);
                    })
                    .finally(() => {
                        submitButton.textContent = "Да";
                        submitButton.disabled = false;
                    });
            }
            submitButton._handler = confirmHandler;
            submitButton.removeEventListener('click', submitButton._handler);
            submitButton.addEventListener('click', confirmHandler, {once: true});
        });
    
        
    }

    return cardElement;
}