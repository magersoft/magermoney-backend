# Magermoney Backend
Серверная часть для проекта [Magermoney Frontend](https://github.com/magersoft/magermoney-frontend).

## 🦾 Системные требования
- Node.js v20
- Docker

## 🛠️ Запуск проекта
1. Скопировать содержимое файла `.env.example` в корне проекта в новый файл `.env`
2Установите зависимости
```bash
$ npm install
```
3. Запустите Docker и выполните команду
```bash
$ docker-compose up
```
4. Запустите проект
```bash
$ npm run start:dev
```

5. Открыть страницу [https://localhost:4001/api/v1/docs](https://localhost:4001/api/v1/docs) в браузере. Вы увидите запущенный Swagger UI.
