const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
        authorization: 'f64d9da7-cc56-42a0-a8c9-322302263ec9',
        'Content-Type': 'application/json'
    }
}

function checkRes(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

const getUser = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
        .then((res) => checkRes(res));
}

const patchUser = (nickName, description) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: nickName,
            about: description
        })
    })
        .then((res) => checkRes(res));
}

const patchAvatar = (profilePicture) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: profilePicture
        })
    })
        .then((res) => checkRes(res));
}

const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
        .then((res) => checkRes(res));
}

const postCard = (cardName, cardLink) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: cardName,
            link: cardLink
        })
    })
        .then((res) => checkRes(res));
}

const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
        .then((res) => checkRes(res));
}

const putCardLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: config.headers
    })
        .then((res) => checkRes(res));
}

const deleteCardLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: config.headers
    })
        .then((res) => checkRes(res));
}

export { getUser, patchUser, patchAvatar, getInitialCards, postCard, deleteCard, putCardLike, deleteCardLike };