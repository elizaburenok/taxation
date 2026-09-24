# Отчёт-предложение: size-mode токены для DS

**Контекст.** Готовим перенос главной страницы онлайн-бухгалтерии на канонические токены.
Источник — Figma «TUI 1.9 Size Modes» (`node-id=402-4`): страница-спецификация токенов, а не
макет. На ней описаны три семейства с режимами (size modes): **Density**, **Spacings**,
**Roundings**. Планируется вынести токены **в отдельный репозиторий** вместе со страницей главной ОБ.

**Статус в текущем DS** (`design-system/tokens/`): есть только неполная примитивная шкала.
Семантического слоя (Density-отступы, семантические скругления) и самого механизма режимов
(Default/Compact, Default/Brutal) — **нет**. Ниже — что предлагается добавить.

---

## 1. Что понадобилось и почему

| Нужно | Почему | Сейчас в DS |
|---|---|---|
| Семантические spacing-токены страницы (Density) | Главная ОБ строится на `page-*` / `content-*-list-spacing`, а не на «сырых» `8x/12x` | ❌ нет |
| Режимы плотности **Default / Compact** | Часть отступов сжимается в компактном режиме | ❌ нет механизма |
| Семантические rounding-токены (`card-`, `form-`, `cell-`, `popup-`, `height-based-*`…) | Компоненты на главной скругляются по смыслу, а не по числу | ❌ нет |
| Режимы скруглений **Default / Brutal** | В Brutal все скругления = 0px | ❌ нет механизма |
| Недостающие примитивы | Семантика ссылается на примитивы, которых нет | 🟡 частично |

---

## 2. Примитивы (base scale)

Всё на сетке **4px**. Семантика ссылается только на эти значения.

### 2.1 Spacings (примитивы)
Используемые семантикой множители: `3x, 4x, 5x, 6x, 8x, 12x, 16x`.

| Токен | Значение | Есть в DS |
|---|---|---|
| `spacing-1x` | 4px | ✅ |
| `spacing-2x` | 8px | ✅ (`--space-2x`) |
| `spacing-3x` | 12px | ✅ (`--space-3x`) |
| `spacing-4x` | 16px | ✅ (`--space-4x`) |
| `spacing-5x` | 20px | ✅ (`--space-5x`) |
| `spacing-6x` | 24px | ✅ |
| `spacing-8x` | 32px | ✅ |
| `spacing-12x` | 48px | ✅ |
| `spacing-16x` | 64px | ❌ **добавить** |

> ⚠️ В текущем `css-variables.css` есть значения не по сетке 4px:
> `--spacing-xs:10px`, `-s:15px`, `-m:20px`, `-xl:30px`, `-2xl:60px`. К этой спецификации
> они не относятся — в новый репозиторий их не переносим (или помечаем как legacy).

### 2.2 Roundings (примитивы)
Используемые множители: `0.5x, 1x, 1.5x, 2x, 2.5x, 3x, 3.5x, 4x`.

| Токен | Значение | Есть в DS |
|---|---|---|
| `rounding-0-5x` | 2px | ❌ **добавить** |
| `rounding-1x` | 4px | ✅ |
| `rounding-1-5x` | 6px | ✅ |
| `rounding-2x` | 8px | ❌ **добавить** |
| `rounding-2-5x` | 10px | ✅ |
| `rounding-3x` | 12px | ✅ |
| `rounding-3-5x` | 14px | ❌ **добавить** |
| `rounding-4x` | 16px | ✅ |

---

## 3. Density — семантические отступы (режимы Default / Compact)

9 токенов. Значение указано в px и в примитиве, к которому он алиасится.

| Токен | Default | Compact |
|---|---|---|
| `page-top-padding` | 32px = `8x` | 24px = `6x` |
| `page-top-padding-adaptive` | 32px = `8x` | 24px = `6x` |
| `page-bottom-padding` | 32px = `8x` | 24px = `6x` |
| `page-bottom-padding-with-chat` | 64px = `16x` | 64px = `16x` |
| `page-bottom-padding-with-chat-adaptive` | 32px = `8x` | 32px = `8x` |
| `page-horizontal-padding` | 20px = `5x` | 20px = `5x` |
| `content-section-list-spacing` | 48px = `12x` | 32px = `8x` |
| `content-group-list-spacing` | 32px = `8x` | 24px = `6x` |
| `content-element-list-spacing` | 16px = `4x` | 12px = `3x` |

> Frame «Spacings» на странице Figma (Desktop) — это тот же семантический слой, он 1:1
> алиасит в Density. Отдельной сущностью его не заводим.

---

## 4. Roundings — семантические скругления (режимы Default / Brutal)

18 токенов. В режиме **Brutal все = 0px**.

| Токен | Default | Brutal |
|---|---|---|
| `height-based-rounding-3xl` | 16px = `4x` | 0px |
| `height-based-rounding-2xl` | 14px = `3.5x` | 0px |
| `height-based-rounding-xl` | 12px = `3x` | 0px |
| `height-based-rounding-l` | 10px = `2.5x` | 0px |
| `height-based-rounding-m` | 8px = `2x` | 0px |
| `height-based-rounding-s` | 6px = `1.5x` | 0px |
| `height-based-rounding-xs` | 4px = `1x` | 0px |
| `height-based-rounding-2xs` | 4px = `1x` | 0px |
| `cell-rounding-strong` | 12px = `3x` | 0px |
| `cell-rounding-weak` | 8px = `2x` | 0px |
| `card-rounding` | 12px = `3x` | 0px |
| `form-rounding` | 12px = `3x` | 0px |
| `form-rounding-weak` | 8px = `2x` | 0px |
| `popup-rounding-strong` | 12px = `3x` | 0px |
| `popup-rounding-weak` | 8px = `2x` | 0px |
| `slider-rounding` | 2px = `0.5x` | 0px |
| `keyboard-focus-text-rounding` | 2px = `0.5x` | 0px |
| `keyboard-focus-container-rounding` | 6px = `1.5x` | 0px |

---

## 5. Предлагаемый механизм режимов (size modes)

В DS сейчас режимов нет — вводим два независимых измерения через data-атрибуты на контейнере.
Примитивы неизменны; от режима зависит только, на какой примитив ссылается семантика.

- **Плотность:** `data-density="default" | "compact"`
- **Скругления:** `data-rounding="default" | "brutal"`

Значения по умолчанию — на `:root`; переопределение — на любом поддереве (можно сочетать).

```css
/* ── Примитивы (не зависят от режима) ───────────────── */
:root {
  --spacing-16x: 64px;         /* + недостающие 0.5x/2x/3.5x для rounding */
  --rounding-0-5x: 2px;
  --rounding-2x: 8px;
  --rounding-3-5x: 14px;
}

/* ── Density: Default ───────────────────────────────── */
:root, [data-density="default"] {
  --page-top-padding: var(--spacing-8x);              /* 32 */
  --page-bottom-padding: var(--spacing-8x);           /* 32 */
  --page-bottom-padding-with-chat: var(--spacing-16x);/* 64 */
  --page-horizontal-padding: var(--spacing-5x);       /* 20 */
  --content-section-list-spacing: var(--spacing-12x); /* 48 */
  --content-group-list-spacing: var(--spacing-8x);    /* 32 */
  --content-element-list-spacing: var(--spacing-4x);  /* 16 */
  /* …-adaptive аналогично */
}

/* ── Density: Compact (только отличия) ──────────────── */
[data-density="compact"] {
  --page-top-padding: var(--spacing-6x);              /* 24 */
  --page-bottom-padding: var(--spacing-6x);           /* 24 */
  --content-section-list-spacing: var(--spacing-8x);  /* 32 */
  --content-group-list-spacing: var(--spacing-6x);    /* 24 */
  --content-element-list-spacing: var(--spacing-3x);  /* 12 */
}

/* ── Rounding: Default ──────────────────────────────── */
:root, [data-rounding="default"] {
  --card-rounding: var(--rounding-3x);                /* 12 */
  --form-rounding: var(--rounding-3x);
  --cell-rounding-strong: var(--rounding-3x);
  --height-based-rounding-m: var(--rounding-2x);      /* 8 */
  /* …остальные из §4 */
}

/* ── Rounding: Brutal (всё 0) ───────────────────────── */
[data-rounding="brutal"] {
  --card-rounding: 0px; --form-rounding: 0px; --cell-rounding-strong: 0px;
  /* …все семантические скругления = 0 */
}
```

TS-слой — по существующей конвенции (`as const`), с ключом по режиму:

```ts
export const density = {
  default: { pageTopPadding: 'var(--spacing-8x)', /* … */ },
  compact: { pageTopPadding: 'var(--spacing-6x)', /* … */ },
} as const;
```

---

## 6. Где разместить в структуре (новый репозиторий)

```
tokens/
  primitives/
    spacing.ts        # 1x…16x
    rounding.ts       # 0.5x…4x
  semantic/
    density.ts        # page-*, content-*  (modes: default | compact)
    rounding.ts       # card-/form-/cell-/popup-/height-based-*  (modes: default | brutal)
  css/
    primitives.css
    modes.css         # [data-density] / [data-rounding]
  index.ts
```

Существующие `colors.ts` / `typography.ts` переносим как есть; `spacing.ts` / `rounding.ts`
расширяем недостающими примитивами (§2) и разделяем на primitives/semantic.

---

## 7. Что затрагивается

- **Главная ОБ** — целевой экран, ради него всё и делается.
- **Прототип СНО** (`ОБ/СНО`) — подключает DS через `@ds`; после выноса токенов в отдельный
  репозиторий нужно будет переключить источник.
- **Прочие прототипы** с локальными копиями `design-system/` — не затрагиваем, пока не решим
  централизовать источник.

---

## 8. На согласование

1. **Именование CSS-переменных.** Faithful к Figma без префикса (`--card-rounding`,
   `--page-top-padding`) — или с неймспейсом (`--rounding-card`, `--spacing-page-top`)?
   Предлагаю **faithful** (совпадает с именами переменных Figma → проще Code Connect).
2. **Механизм режимов** — data-атрибуты `data-density` / `data-rounding` (предложено выше).
   Ок или предпочитаете классы / отдельные темы?
3. **Off-grid legacy-значения** (`--spacing-xs:10px` и т.п.) — не переносить в новый репозиторий?
4. **Полнота примитивной шкалы** — заводить полную (1x…16x, 0.5x…4x) или только используемые семантикой?

После вашего «ок» по этим пунктам — оформлю токены и структуру в отдельном репозитории.
До подтверждения в прототип ничего не коммичу.
