import { useEffect, useState } from 'react';
import { InformationCircle } from '@ds/icons';
import {
  Drawer,
  DrawerHeader,
  DrawerFooter,
  Dropdown,
  Cell,
} from '@ds';
import { useStore } from '../store';
import { DateField } from '../components/DateField';
import { StartYearModal } from './StartYearModal';
import {
  SNO_OPTIONS,
  findSno,
  rateOptions,
  quarterHint,
  isReducedRate,
  compareDmy,
  formatDmy,
  nextId,
  type PastSystem,
  type SnoId,
} from '../data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Редактируемая система. null — режим добавления. */
  editing: PastSystem | null;
  /**
   * Год начала ведения бухгалтерии из онбординга. Задаёт нижнюю границу выбора
   * периода — не раньше 1 января этого года. Верх — сегодняшний день (прошлая
   * система не может действовать в будущем). Пусто — без ограничений.
   */
  startYear?: string;
  /** Собирать ставку (в разделе «Система налогообложения» ставка обязательна). */
  withRate?: boolean;
  /** Явная нижняя граница периода — перекрывает вычисленную из startYear. */
  minDate?: Date;
  /** Явная верхняя граница периода — перекрывает вычисленную из startYear. */
  maxDate?: Date;
  /** Явная подсказка по периоду — перекрывает вычисленную из startYear. */
  rangeHint?: string;
  /**
   * Предзаполнение полей в режиме добавления (editing=null): подставляем известные
   * данные клиента (система, ставка, начало), чтобы не вводить заново.
   */
  prefill?: Partial<Pick<PastSystem, 'snoId' | 'rate' | 'start' | 'end'>>;
}

const toDate = (v: string): Date | null => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(v.trim());
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return d.getDate() === Number(m[1]) ? d : null;
};

/**
 * Боковая панель добавления/редактирования прошлой системы налогообложения.
 * Собирает систему и период применения (ставку в прошлой СНО не фиксируем).
 */
export function PreviousSystemDrawer({
  isOpen,
  onClose,
  editing,
  startYear,
  withRate = false,
  minDate: minDateProp,
  maxDate: maxDateProp,
  rangeHint: rangeHintProp,
  prefill,
}: Props) {
  const { previousSystems, addSystem, updateSystem, removeSystem } = useStore();

  // Границы выбора периода: явные пропы перекрывают вычисленные из startYear
  // (с 1 января года начала расчёта и до сегодняшнего дня).
  const yearNum = startYear && /^\d{4}$/.test(startYear) ? Number(startYear) : null;
  const minDate = minDateProp ?? (yearNum != null ? new Date(yearNum, 0, 1) : undefined);
  const maxDate = maxDateProp ?? (yearNum != null ? new Date() : undefined);
  const inRange = (d: Date | null) =>
    d != null && (minDate == null || d >= minDate) && (maxDate == null || d <= maxDate);
  const rangeHint =
    rangeHintProp ??
    (yearNum != null ? `Период применения — с ${yearNum} года по настоящее время` : undefined);

  const [snoId, setSnoId] = useState<SnoId | undefined>(undefined);
  const [rate, setRate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const [showErrors, setShowErrors] = useState(false);
  const [yearHelpOpen, setYearHelpOpen] = useState(false);

  // Инициализируем поля при каждом открытии: из редактируемой записи, либо из
  // предзаполнения (режим добавления), либо пустыми. prefill не в deps намеренно —
  // применяется только в момент открытия, чтобы не сбрасывать ввод пользователя.
  useEffect(() => {
    if (!isOpen) return;
    const src = editing ?? prefill;
    setSnoId(src?.snoId);
    setRate(src?.rate ?? '');
    setStart(src?.start ?? '');
    setEnd(src?.end ?? '');
    setShowErrors(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editing]);

  const sno = findSno(snoId);
  const showJustification = withRate && isReducedRate(rate, sno);

  const rateOpts = sno
    ? sno.canReduce
      ? rateOptions(sno)
      : sno.defaultRate !== '—'
        ? [sno.defaultRate]
        : []
    : [];

  const selectSno = (id: SnoId) => {
    setSnoId(id);
    if (withRate) {
      const opt = findSno(id);
      setRate(opt?.defaultRate === '—' ? '' : opt?.defaultRate ?? '');
    }
  };

  const startDate = toDate(start);
  const endDate = toDate(end);
  const startValid = startDate != null && inRange(startDate);
  const endValid = !end.trim() || (endDate != null && inRange(endDate));
  const rateValid = !withRate || Boolean(rate.trim());

  // Пересечение периодов: нельзя добавить систему на период, который уже занят
  // другой добавленной системой. Пустой конец = «по настоящее время» (верхняя
  // граница периода, либо сегодня).
  const capEnd = maxDate ? formatDmy(maxDate) : formatDmy(new Date());
  const others = previousSystems.filter((s) => s.id !== editing?.id);

  // Занятые периоды других систем — гасим их дни в календаре, чтобы нельзя было выбрать
  // уже покрытый период (пустой конец = до верхней границы периода).
  const occupiedRanges = others
    .map((s) => {
      const st = toDate(s.start);
      const en = s.end.trim() ? toDate(s.end) : maxDate ?? new Date();
      return st && en ? { start: st, end: en } : null;
    })
    .filter((r): r is { start: Date; end: Date } => r !== null);

  const candStart = start.trim();
  const candEnd = end.trim() ? end.trim() : capEnd;
  const hasOverlap =
    startValid &&
    endValid &&
    others.some((s) => {
      const oEnd = s.end.trim() ? s.end.trim() : capEnd;
      // Периоды [candStart, candEnd] и [s.start, oEnd] пересекаются.
      return compareDmy(candStart, oEnd) <= 0 && compareDmy(s.start, candEnd) <= 0;
    });

  const errSno = showErrors && !snoId;
  const errRate = showErrors && !rateValid;
  const errStart = showErrors && (!startValid || hasOverlap);
  const errEnd = showErrors && !endValid;
  const startErrMessage = !startValid
    ? startDate != null && rangeHint
      ? rangeHint
      : 'Укажите дату в формате дд.мм.гггг'
    : hasOverlap
      ? 'Этот период пересекается с уже добавленной системой'
      : startDate != null && rangeHint
        ? rangeHint
        : 'Укажите дату в формате дд.мм.гггг';
  const endErrMessage =
    endDate != null && rangeHint ? rangeHint : 'Укажите дату в формате дд.мм.гггг';

  const handleSave = () => {
    const valid = Boolean(snoId) && rateValid && startValid && endValid && !hasOverlap;
    if (!valid) {
      setShowErrors(true);
      return;
    }

    const payload: Omit<PastSystem, 'id'> = {
      snoId: snoId!,
      label: sno!.label,
      rate: withRate ? rate.trim() : '',
      isReduced: showJustification,
      start: start.trim(),
      end: end.trim(),
    };

    if (editing) {
      updateSystem(editing.id, payload);
    } else {
      addSystem({ id: nextId(), ...payload });
    }
    onClose();
  };

  const handleRemove = () => {
    if (editing) removeSystem(editing.id);
    onClose();
  };

  const header = (
    <DrawerHeader
      title={editing ? 'Система налогообложения' : 'Добавить систему налогообложения'}
      onClose={onClose}
    />
  );

  const footer = editing ? (
    <DrawerFooter
      layout="2-buttons"
      secondaryAction={{ label: 'Удалить систему', onClick: handleRemove }}
      primaryAction={{ label: 'Сохранить', onClick: handleSave, isSelected: true }}
    />
  ) : (
    <DrawerFooter
      layout="1-button"
      primaryAction={{ label: 'Добавить', onClick: handleSave, isSelected: true }}
    />
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} header={header} footer={footer}>
      <div
        className="stack stack--4x"
        style={{ padding: 'var(--spacing-8x) var(--spacing-5x)' }}
      >
        <Dropdown
          label="Система налогообложения"
          placeholder="Выберите систему"
          value={sno?.label}
          isError={errSno}
          errorMessage="Выберите систему налогообложения"
        >
          {SNO_OPTIONS.map((o) => (
            <Cell key={o.id} title={o.label} hasLeftAccessory={false} onClick={() => selectSno(o.id)} />
          ))}
        </Dropdown>

        {withRate && (
          <Dropdown
            label="Ставка"
            placeholder={!sno ? 'Сначала выберите систему' : 'Выберите ставку'}
            value={rate || undefined}
            isError={errRate}
            errorMessage="Укажите ставку"
            description={sno?.canReduce ? `Стандартная ставка — ${sno.defaultRate}` : undefined}
            isDisabled={!sno || rateOpts.length === 0}
          >
            {rateOpts.map((r) => (
              <Cell
                key={r}
                title={r}
                subtitle={r === sno?.defaultRate ? 'Стандартная ставка' : 'Пониженная ставка'}
                hasLeftAccessory={false}
                onClick={() => setRate(r)}
              />
            ))}
          </Dropdown>
        )}

        <DateField
          label="Начало применения"
          placeholder="дд.мм.гггг"
          value={start}
          onChange={setStart}
          min={minDate}
          max={maxDate}
          disabledRanges={occupiedRanges}
          isError={errStart}
          errorMessage={startErrMessage}
          description={quarterHint(start, 'start') || rangeHint || undefined}
          hasHelpIcon
          helpText="Дата, с которой вы начали применять эту систему налогообложения"
        />
        <DateField
          label="Окончание применения"
          placeholder="дд.мм.гггг · оставьте пустым, если применяется сейчас"
          value={end}
          onChange={setEnd}
          min={minDate}
          max={maxDate}
          disabledRanges={occupiedRanges}
          isError={errEnd}
          errorMessage={endErrMessage}
          description={quarterHint(end, 'end') || undefined}
        />

        {/* Памятка: от точности дат зависят расчёты налогов. */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-3x)',
            padding: 'var(--spacing-4x)',
            border: '1px solid var(--translucent-primitives-neutral-2)',
            borderRadius: 'var(--rounding-3x)',
          }}
        >
          <span
            className="ds-icon ds-icon--18"
            aria-hidden="true"
            style={{ color: 'var(--primitive-brand)', flexShrink: 0, marginTop: '1px' }}
          >
            <InformationCircle />
          </span>
          <div
            className="stack stack--2x"
            style={{ flex: '1 1 0', minWidth: 0 }}
          >
            <p className="ts-500-m" style={{ margin: 0, color: 'var(--primitive-primary)' }}>
              Проверьте даты перед сохранением
            </p>
            <p className="ts-400-s" style={{ margin: 0, color: 'var(--primitive-primary)' }}>
              По этим датам мы считаем ваши налоги и сдаём отчётность. Ошибка в периоде хотя бы
              на один день — и расчёты уйдут неверными: это грозит доначислениями, штрафами и
              пенями от ФНС. Вводите данные строго по личному кабинету налоговой, а не по памяти.
            </p>
            <button
              type="button"
              className="ts-500-s"
              onClick={() => setYearHelpOpen(true)}
              style={{
                alignSelf: 'flex-start',
                margin: 0,
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: 'var(--primitive-brand)',
                cursor: 'pointer',
              }}
            >
              Как узнать год
            </button>
          </div>
        </div>
      </div>

      <StartYearModal isOpen={yearHelpOpen} onClose={() => setYearHelpOpen(false)} />
    </Drawer>
  );
}
