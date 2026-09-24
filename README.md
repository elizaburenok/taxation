# Шаблон прототипа

Самодостаточное Vite-приложение. UI-кит подключается из соседней папки `design-system/`.

## Структура папок

```text
projects/
  design-system/     ← клон репозитория UI-кита
  my-prototype/      ← копия этого шаблона
```

## Запуск

```bash
cd my-prototype
npm install
npm run dev
```

Импорт компонентов: `import { Button } from '@ds'` или `from '../design-system/src'`.
