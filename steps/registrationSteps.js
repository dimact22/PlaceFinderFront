const { Given, When, Then } = require('@cucumber/cucumber'); // Импортируем функции для шагов
const axios = require('axios');
const assert = require('assert');

let response;

// Шаг для проверки, что пользователь на странице регистрации (если необходимо)
Given('the user is on the registration page', function () {
  // Для API-тестов мы не выполняем никаких действий здесь
});

// Шаг для регистрации нового пользователя
When('the user attempts to register with the following details:', async function (dataTable) {
    const data = dataTable.raw(); // Преобразуем таблицу в массив
    const userData = {
      firstName: data[1][0],
      lastName: data[1][1],
      email: data[1][2],
      phone: data[1][3],
      password: data[1][4]
    };

    try {
      response = await axios.post('http://localhost:8000/register', userData);
      console.log('Response:', response.data);  // Логируем ответ от API
    } catch (error) {
      response = error.response;
      console.log('Error response:', response.data);  // Логируем ошибку
    }
});
  
// Шаг для проверки статуса регистрации
Then('the system should return status {string}', function (expectedStatus) {
    // Проверяем, что в ответе есть поле status и оно равно ожидаемому значению
    assert.strictEqual(response.data.status, expectedStatus);
});

// Шаг для проверки наличия токена при регистрации
Then('the registration system should return a token', function () {
    // Проверяем, что в ответе есть поле token
    assert.ok(response.data.token, 'Token should be present');
});
