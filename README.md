# Language-learning-app

[English](#english) | [Русский](#русский)

---

## English

An intuitive mobile application for expanding vocabulary using smart spaced repetition, synced directly with Google Sheets.

### How It Works

- **Spaced Repetition:** Adds 10 new words per lesson while systematically re-integrating older vocabulary based on structured intervals.
- **One-Finger Control:** Designed for single-hand use with intuitive tap zones for hints and progression, featuring an eye-friendly muted palette.
- **Adaptive Hints & Scripts:** Tailors hint reveals (e.g., 3 characters for Latin scripts vs. 1 character for hieroglyphs like Korean or Japanese).
- **Flexible Display Modes:** Customize card views by hiding translations, originals, or using random modes.

### Quick Start & Setup

1. Generate a Google Sheets API key via [Google Sheets API Guide](https://handsondataviz.org).
2. Configure your app settings using these credentials:

```env
API_KEY=YOUR_GOOGLE_API_KEY
SPREADSHEET_ID=YOUR_GOOGLE_SPREADSHEET_ID
SHEET_NAME=English
```

### Download & Build

Built with **Expo Go** for cross-platform performance.

- **Download Link, Preview** [maks-eco.github.io/tl-static/](https://maks-eco.github.io/tl-static/)

---

## Русский

Интуитивное мобильное приложение для расширения словарного запаса с помощью интервального повторения и синхронизации с Google Таблицами.

### Описание работы

- **Тренажер памяти:** Добавление 10 новых слов за урок с автоматическим подмешиванием пройденного материала по заданным интервалам.
- **Управление одним пальцем:** Эргономичный интерфейс для одной руки с пошаговым открытием подсказок и приглушенной цветовой гаммой.
- **Поддержка алфавитов и иероглифов:** Адаптивный показ подсказок (по 3 символа для латиницы и построчно/посимвольно для иероглифов).
- **Гибкие режимы отображения:** Настройка скрытия текста (перевод, оригинал или случайный выбор).

### Быстрый старт и настройка

1. Получите API-ключ по инструкции [Google Sheets API Guide](https://handsondataviz.org).
2. Заполните параметры в настройках приложения:

```env
API_KEY=ВАШ_API_КЛЮЧ_GOOGLE
SPREADSHEET_ID=ID_ВАШЕЙ_GOOGLE_ТАБЛИЦЫ
SHEET_NAME=English
```

### Ссылка на скачивание

Приложение разработано на базе фреймворка **Expo Go**.

- **Превью приложения:** [maks-eco.github.io/tl-static/](https://maks-eco.github.io/tl-static/)
