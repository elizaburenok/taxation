import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@ds/icons';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

function parse(value: string): Date | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  return d.getDate() === day && d.getMonth() === month - 1 ? d : null;
}

const sameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

/** Номер месяца в абсолютной шкале (год*12 + месяц) — для сравнения границ. */
const monthIndex = (year: number, month: number) => year * 12 + month;

interface Props {
  /** Текущее значение дд.мм.гггг. */
  value: string;
  /** Выбор дня — возвращает дату в формате дд.мм.гггг. */
  onSelect: (value: string) => void;
  /** Минимальная дата, доступная для выбора (включительно). */
  min?: Date;
  /** Максимальная дата, доступная для выбора (включительно). */
  max?: Date;
  /** Занятые диапазоны (включительно) — дни внутри недоступны для выбора. */
  disabledRanges?: { start: Date; end: Date }[];
}

/** Занят ли день одним из недоступных диапазонов (границы включительно). */
function inRanges(date: Date, ranges: { start: Date; end: Date }[]): boolean {
  return ranges.some((r) => date >= r.start && date <= r.end);
}

/** Первый доступный день ≥ min: не раньше min, не позже max, не в занятом диапазоне. */
function firstEnabled(
  min: Date | undefined,
  max: Date | undefined,
  ranges: { start: Date; end: Date }[],
): Date | null {
  if (!min) return null;
  const d = new Date(min.getFullYear(), min.getMonth(), min.getDate());
  // Ограничиваем скан верхней границей (или +24 мес. от min, если max не задан).
  const cap = max ?? new Date(min.getFullYear() + 2, min.getMonth(), min.getDate());
  while (d <= cap) {
    if (!inRanges(d, ranges)) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return null;
}

/**
 * Компактный календарь на месяц (понедельник первым днём).
 * Поддерживает границы min/max: дни вне диапазона недоступны, а навигация
 * по месяцам не выходит за пределы.
 * Временный компонент прототипа — ждёт добавления DatePicker в дизайн-систему.
 */
export function Calendar({ value, onSelect, min, max, disabledRanges = [] }: Props) {
  const today = new Date();
  const selected = parse(value);
  const [view, setView] = useState(() => {
    // При пустом значении открываем на первом свободном дне (не на серых занятых),
    // затем на нижней границе, затем на сегодня.
    const base = selected ?? firstEnabled(min, max, disabledRanges) ?? min ?? today;
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const firstDay = new Date(view.year, view.month, 1);
  const lead = (firstDay.getDay() + 6) % 7; // Пн = 0
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const viewIdx = monthIndex(view.year, view.month);
  const minIdx = min ? monthIndex(min.getFullYear(), min.getMonth()) : null;
  const maxIdx = max ? monthIndex(max.getFullYear(), max.getMonth()) : null;
  const canPrev = minIdx == null || viewIdx > minIdx;
  const canNext = maxIdx == null || viewIdx < maxIdx;

  const shift = (delta: number) => {
    if (delta < 0 && !canPrev) return;
    if (delta > 0 && !canNext) return;
    const m = view.month + delta;
    setView({ year: view.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 });
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__nav hoverOpacity"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="Предыдущий месяц"
        >
          <span className="ds-icon ds-icon--24" aria-hidden="true"><ChevronLeft /></span>
        </button>
        <span className="calendar__title ts-500-m">{MONTHS[view.month]} {view.year}</span>
        <button
          type="button"
          className="calendar__nav hoverOpacity"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label="Следующий месяц"
        >
          <span className="ds-icon ds-icon--24" aria-hidden="true"><ChevronRight /></span>
        </button>
      </div>

      <div className="calendar__grid calendar__grid--weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="calendar__weekday ts-400-xs">{w}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} className="calendar__cell calendar__cell--empty" />;
          const date = new Date(view.year, view.month, day);
          const isDisabled =
            (min != null && date < min) ||
            (max != null && date > max) ||
            inRanges(date, disabledRanges);
          const isSelected = selected != null && sameDay(date, selected);
          const isToday = sameDay(date, today);
          const cls = [
            'calendar__cell',
            'ts-400-m',
            isDisabled ? 'calendar__cell--disabled' : '',
            isSelected ? 'calendar__cell--selected' : '',
            !isSelected && isToday ? 'calendar__cell--today' : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={day}
              type="button"
              className={cls}
              disabled={isDisabled}
              onClick={() => onSelect(fmt(date))}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
