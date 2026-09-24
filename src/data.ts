// Доменные типы прототипа «Прошлые СНО в Онлайн-бухгалтерии».

/** Идентификатор системы налогообложения. */
export type SnoId =
  | 'usn-income'
  | 'usn-income-expense'
  | 'ausn-income'
  | 'ausn-income-expense'
  | 'npd'
  | 'osno'
  | 'patent';

export interface SnoOption {
  id: SnoId;
  /** Человекочитаемое название для Dropdown и списка. */
  label: string;
  /** Ставка по умолчанию. */
  defaultRate: string;
  /** Допускает пониженную ставку (тогда доступен блок «Обоснование ставки»). */
  canReduce: boolean;
  /** Для этих систем задача за прошлый период не формируется. */
  noPastTask: boolean;
}

export const SNO_OPTIONS: SnoOption[] = [
  { id: 'usn-income', label: 'УСН «Доходы»', defaultRate: '6%', canReduce: true, noPastTask: false },
  { id: 'usn-income-expense', label: 'УСН «Доходы минус расходы»', defaultRate: '15%', canReduce: true, noPastTask: false },
  { id: 'ausn-income', label: 'АУСН «Доходы»', defaultRate: '8%', canReduce: false, noPastTask: true },
  { id: 'ausn-income-expense', label: 'АУСН «Доходы минус расходы»', defaultRate: '20%', canReduce: false, noPastTask: true },
  { id: 'npd', label: 'НПД (самозанятость)', defaultRate: '4%', canReduce: false, noPastTask: true },
  { id: 'osno', label: 'ОСНО', defaultRate: '—', canReduce: false, noPastTask: true },
  { id: 'patent', label: 'Патент', defaultRate: '6%', canReduce: false, noPastTask: false },
];

export function findSno(id: SnoId | undefined): SnoOption | undefined {
  return SNO_OPTIONS.find((o) => o.id === id);
}

/** Числовое значение ставки из строки вида «6%», «5,5 %». null — если не распарсилось. */
export function parseRate(value: string): number | null {
  const m = /(\d+(?:[.,]\d+)?)/.exec(value);
  return m ? Number(m[1].replace(',', '.')) : null;
}

/**
 * Ставка ниже стандартной для системы (значит — пониженная, нужно обоснование).
 * Только для систем, где пониженная ставка возможна (`canReduce`).
 */
export function isReducedRate(rate: string, sno: SnoOption | undefined): boolean {
  if (!sno?.canReduce) return false;
  const entered = parseRate(rate);
  const standard = parseRate(sno.defaultRate);
  return entered != null && standard != null && entered < standard;
}

/**
 * Справочник возможных ставок для системы (для дропдауна выбора ставки).
 * От стандартной ставки вниз до 1% — стандартная плюс пониженные значения субъекта РФ.
 */
export function rateOptions(sno: SnoOption): string[] {
  const std = parseRate(sno.defaultRate);
  if (std == null) return [];
  const list: string[] = [];
  for (let r = std; r >= 1; r -= 1) list.push(`${r}%`);
  return list;
}

export interface PastSystem {
  id: string;
  snoId: SnoId;
  label: string;
  rate: string;
  /** Пониженная ставка применена. */
  isReduced: boolean;
  /** Дата начала применения, dd.mm.yyyy. */
  start: string;
  /** Дата окончания применения, dd.mm.yyyy. Пусто = по настоящее время. */
  end: string;
  // Обоснование ставки
  code?: string;
  article?: string;
  point?: string;
  subpoint?: string;
}

/** Дата регистрации ИП — нижняя граница «начала расчёта» (раньше бизнеса не было). */
export const REGISTRATION_DATE = '27.09.2019';

/** Действующая система клиента (показывается всегда, не редактируется в этом прототипе). */
export const CURRENT_SYSTEM = {
  snoId: 'usn-income' as SnoId,
  label: 'УСН «Доходы»',
  rate: '6%',
  /**
   * С какой даты действует = «момент начала работы с Точкой» по умолчанию (текущий год).
   * Всё от «начала расчёта» до этой даты закрывают прошлые СНО.
   */
  start: '01.01.2026',
};

/**
 * Исходный «год начала работы с Точкой» по умолчанию = старт действующей системы.
 * Задаётся в онбординге; в кабинете служит верхней границей разрыва прошлых СНО.
 */
export const DEFAULT_BOOKKEEPING_START = CURRENT_SYSTEM.start;

/** Начало расчёта по умолчанию = старт действующей системы (изначально прошлые СНО не нужны). */
export const DEFAULT_CALC_START = CURRENT_SYSTEM.start;

/** Действующие патенты клиента (для карточки «Действующая система»). */
export const CURRENT_PATENTS = [
  { id: 'p1', number: '№ 6658250017925', period: 'с 1 января по 31 декабря 2026' },
  { id: 'p2', number: '№ 6658260041156', period: 'с 1 января по 30 июня 2026' },
];

/** Квартальная подсказка для даты dd.mm.yyyy. */
export function quarterHint(date: string, kind: 'start' | 'end'): string {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date.trim());
  if (!m) return '';
  const month = Number(m[2]);
  const year = m[3];
  if (month < 1 || month > 12) return '';
  const q = Math.floor((month - 1) / 3) + 1;
  return kind === 'start' ? `с ${q} квартала ${year}` : `по ${q} квартал ${year}`;
}

const ROMAN = ['I', 'II', 'III', 'IV'];

/** Разбор даты dd.mm.yyyy в квартал (римский) и год. */
function toQuarter(date: string): { q: string; year: string } | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date.trim());
  if (!m) return null;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { q: ROMAN[Math.floor((month - 1) / 3)], year: m[3] };
}

/**
 * Период применения системы в квартальном виде для карточки списка:
 * «I квартал 2023 — II квартал 2025» или «с I квартала 2023», если окончание не указано.
 */
export function periodLabel(start: string, end: string): string {
  const s = toQuarter(start);
  if (!s) return '';
  const e = toQuarter(end);
  return e
    ? `${s.q} квартал ${s.year} — ${e.q} квартал ${e.year}`
    : `с ${s.q} квартала ${s.year}`;
}

let seq = 100;
export function nextId(): string {
  seq += 1;
  return `sys-${seq}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Даты и покрытие периода прошлыми системами.
// ─────────────────────────────────────────────────────────────────────────────

/** dd.mm.yyyy → Date (локальная полночь). null, если строка не парсится. */
export function parseDmy(value: string): Date | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return d.getDate() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 ? d : null;
}

/** Date → dd.mm.yyyy. */
export function formatDmy(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** Прибавить дней к dd.mm.yyyy. '' — если исходная дата не валидна. */
export function addDaysDmy(value: string, days: number): string {
  const d = parseDmy(value);
  if (!d) return '';
  d.setDate(d.getDate() + days);
  return formatDmy(d);
}

const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

/** dd.mm.yyyy → «27 сентября 2019». Пустая строка — если не парсится. */
export function formatHuman(value: string): string {
  const d = parseDmy(value);
  if (!d) return '';
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Сравнение dd.mm.yyyy: <0, 0, >0. Невалидные считаем равными 0. */
export function compareDmy(a: string, b: string): number {
  const da = parseDmy(a);
  const db = parseDmy(b);
  if (!da || !db) return 0;
  return da.getTime() - db.getTime();
}

export interface Gap {
  from: string;
  to: string;
}

export interface Coverage {
  /** Нужны ли прошлые системы вообще (начало расчёта раньше действующей системы). */
  needsPast: boolean;
  /** Требуемый период целиком: [requiredFrom, requiredTo]. */
  requiredFrom: string;
  requiredTo: string;
  /** Непокрытые промежутки внутри требуемого периода. */
  gaps: Gap[];
  /** Пересечения периодов добавленных систем. */
  hasOverlap: boolean;
  /** Период покрыт полностью и без пересечений. */
  covered: boolean;
  /**
   * Начало следующего периода для добавления (курсор цепочки) — конец покрытого
   * префикса + 1 день, либо requiredFrom, если ещё ничего не добавлено.
   */
  nextStart: string;
}

/**
 * Считает покрытие требуемого периода [calcStart, дeйствующая система) прошлыми
 * системами. Требуем непрерывную цепочку без пропусков и пересечений.
 */
export function computeCoverage(
  calcStart: string,
  currentStart: string,
  systems: PastSystem[],
): Coverage {
  const requiredFrom = calcStart;
  const requiredTo = addDaysDmy(currentStart, -1); // день перед стартом действующей

  const empty: Coverage = {
    needsPast: false,
    requiredFrom,
    requiredTo,
    gaps: [],
    hasOverlap: false,
    covered: true,
    nextStart: requiredFrom,
  };

  // Начало расчёта не раньше действующей системы → прошлые не нужны.
  if (compareDmy(calcStart, currentStart) >= 0) return empty;

  const sorted = [...systems]
    .filter((s) => parseDmy(s.start))
    .sort((a, b) => compareDmy(a.start, b.start));

  const gaps: Gap[] = [];
  let hasOverlap = false;
  // Курсор — первый ещё не покрытый день.
  let cursor = requiredFrom;

  for (const s of sorted) {
    const sStart = s.start;
    const sEnd = s.end.trim() ? s.end : requiredTo; // пустой конец = до конца требуемого периода
    const cmp = compareDmy(sStart, cursor);
    if (cmp > 0) {
      // Разрыв между курсором и началом системы.
      gaps.push({ from: cursor, to: addDaysDmy(sStart, -1) });
    } else if (cmp < 0) {
      // Система начинается раньше курсора — пересечение.
      hasOverlap = true;
    }
    // Двигаем курсор за конец системы, если он его продвигает.
    if (compareDmy(addDaysDmy(sEnd, 1), cursor) > 0) {
      cursor = addDaysDmy(sEnd, 1);
    }
  }

  // Остаток после последней системы до конца требуемого периода — тоже разрыв.
  if (compareDmy(cursor, requiredTo) <= 0) {
    gaps.push({ from: cursor, to: requiredTo });
  }

  const covered = gaps.length === 0 && !hasOverlap;

  // Следующий период для заполнения — начало первого разрыва (разрыв может быть
  // и перед уже добавленным сегментом, поэтому берём именно gaps[0], а не курсор).
  const nextStart = gaps.length > 0 ? gaps[0].from : requiredFrom;

  return {
    needsPast: true,
    requiredFrom,
    requiredTo,
    gaps,
    hasOverlap,
    covered,
    nextStart,
  };
}

/** Число дней в периоде [from, to] включительно. */
export function daysInclusive(from: string, to: string): number {
  const a = parseDmy(from);
  const b = parseDmy(to);
  if (!a || !b) return 0;
  return Math.floor((b.getTime() - a.getTime()) / 86400000) + 1;
}

/** Доля покрытия требуемого периода, 0..100. */
export function coveragePercent(cov: Coverage): number {
  if (!cov.needsPast) return 100;
  const total = daysInclusive(cov.requiredFrom, cov.requiredTo);
  if (total <= 0) return 100;
  const gapDays = cov.gaps.reduce((n, g) => n + Math.max(0, daysInclusive(g.from, g.to)), 0);
  return Math.max(0, Math.min(100, Math.round(((total - gapDays) / total) * 100)));
}

/** Как система пересекается с окном [from, to]. */
export type WindowFit = 'inside' | 'outside' | 'partial';

/** Определяет, попадает ли период системы в окно [from, to]. */
export function fitToWindow(s: PastSystem, from: string, to: string): WindowFit {
  const sStart = s.start;
  const sEnd = s.end.trim() ? s.end : to;
  // Полностью вне окна.
  if (compareDmy(sEnd, from) < 0 || compareDmy(sStart, to) > 0) return 'outside';
  // Полностью внутри.
  if (compareDmy(sStart, from) >= 0 && compareDmy(sEnd, to) <= 0) return 'inside';
  return 'partial';
}
