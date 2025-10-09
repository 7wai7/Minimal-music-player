# Minimalistic music player

Музична платформа, створена для прослуховування та завантаження власних треків. Проєкт реалізовано як full-stack застосунок.

---

## Demo

* Live site: [https://minimalistic-music-player.netlify.app/](https://minimalistic-music-player.netlify.app/)
* Swagger (API docs): [https://minimal-music-player.onrender.com/api/docs](https://minimal-music-player.onrender.com/api/docs)

---

## Технології

* Back-end: **Node.js**, **NestJS**, **JWT** аутентифікація, **PostgreSQL**, Google Cloud Storage (зберігання файлів)
* Front-end: **Vite**, **React**, **Zustand**
* Документація: **Swagger**

---

## Основний функціонал

* **Реєстрація / аутентифікація** (JWT)
* **Відтворення аудіо** (streaming / local playback)
* **Завантаження аудіо** з формуванням preview / метаданих
* **Скачування** оригінальних файлів
* **Плейлист** — редагування / відтворення

---

## Запуск

```bash
# Клонувати репозиторій
git clone https://github.com/7wai7/Minimal-music-player.git
cd Minimal-music-player

# Запуск фронтенду
cd client
npm install
npm npm run dev

# Запуск бекенду
cd server
npm install
npm start:dev
```

---

## Налаштування оточення (приклад змінних)

`.env` у папці `server`:

```
PORT=3000
NODE_ENV='development'
POSTGRES_HOST=host
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname
GCS_BUCKET_NAME=your-gcs-bucket

GOOGLE_CLOUD_CREDENTIALS={.json data}

```

`.env.development` у папці `client`:

```
VITE_API_URL=http://localhost:3000
```

---

## Про проект

Цей застосунок створений для:
* практики роботи з бекендом (NestJS, бази даних, зберігання файлів);
* практики створення фронтенду на React;
* демонстрації у портфоліо як повноцінного full-stack проекту.

---

## Хостинг

* Frontend: Netlify
* Backend: Render
* Зберігання файлів: Google Cloud Storage

---

## Ліцензія

Цей проєкт створено для навчальних цілей і є відкритим для перегляду та використання як приклад.
