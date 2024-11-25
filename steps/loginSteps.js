const { When, Then } = require('@cucumber/cucumber'); // Импортируем функции для шагов
const axios = require('axios');
const assert = require('assert');
let response;

// Шаг для логина пользователя
When('the user attempts to log in with the email {string} and password {string}', async function (email, password) {
  const loginData = {
    email: email,
    password: password,
  };

  try {
    // Отправляем запрос на логин
    response = await axios.post('http://localhost:8000/login', loginData);
    console.log('Login Response:', response.data); // Логируем ответ для отладки
  } catch (error) {
    response = error.response;
    console.log('Error response:', response.data); // Логируем ошибку для отладки
  }
});

// Шаг для проверки наличия токена при логине
Then('the login system should return a token', function () {
  assert.ok(response.data.token, 'Token should be present in the response');
});
