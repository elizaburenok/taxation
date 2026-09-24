import { useState } from 'react';
import {
  PageLayout,
  NavigationBar,
  Input,
  Dropdown,
  Cell,
  Button,
  ContextualNotification,
} from '@ds';
import { InformationCircle } from '@ds/icons';
import { useStore } from '../store';
import {
  SNO_OPTIONS,
  findSno,
  quarterHint,
  isReducedRate,
  nextId,
  computeCoverage,
  compareDmy,
  formatHuman,
  CURRENT_SYSTEM,
  type SnoId,
  type PastSystem,
} from '../data';
import { StatyaModal } from '../overlays/StatyaModal';

const CODE_OPTIONS = [
  { value: '3462010', hint: 'УСН «Доходы»' },
  { value: '3462020', hint: 'УСН «Доходы минус расходы»' },
  { value: '3462030', hint: 'УСН, минимальный налог' },
];

const DATE_RE = /^\d{2}\.\d{2}\.\d{4}$/;

function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

export function PreviousSystemForm() {
  const { formOrigin, back, addSystem, isDuplicate, showResult, setPastSnoTaskDone, resetTo, calcStart, previousSystems } =
    useStore();

  // Режим закрытия периода: пришли из раздела, есть непокрытый период до
  // действующей системы. Тогда начало периода фиксируем по цепочке.
  const coverage = computeCoverage(calcStart, CURRENT_SYSTEM.start, previousSystems);
  const coverageMode = formOrigin === 'section' && coverage.needsPast && !coverage.covered;

  const [snoId, setSnoId] = useState<SnoId | undefined>(undefined);
  const [rate, setRate] = useState('');
  const [start, setStart] = useState(() => (coverageMode ? coverage.nextStart : ''));
  const [end, setEnd] = useState('');
  const [code, setCode] = useState('');
  const [article, setArticle] = useState('');
  const [point, setPoint] = useState('');
  const [subpoint, setSubpoint] = useState('');

  const [showErrors, setShowErrors] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [isStatyaOpen, setStatyaOpen] = useState(false);

  const sno = findSno(snoId);
  const showJustification = isReducedRate(rate, sno);

  const selectSno = (id: SnoId) => {
    setSnoId(id);
    const opt = findSno(id);
    setRate(opt?.defaultRate === '—' ? '' : opt?.defaultRate ?? '');
    setDuplicate(false);
  };

  // Конец текущего заполняемого разрыва — дальше него нельзя (иначе пересечение
  // со следующим уже известным сегментом).
  const segmentEnd = coverage.gaps[0]?.to ?? coverage.requiredTo;

  // В режиме покрытия конец периода обязателен и не должен выходить за разрыв.
  const endInRange =
    DATE_RE.test(end.trim()) &&
    compareDmy(end.trim(), start.trim()) >= 0 &&
    compareDmy(end.trim(), segmentEnd) <= 0;

  const errSno = showErrors && !snoId;
  const errRate = showErrors && !rate.trim();
  const errStart = showErrors && !DATE_RE.test(start.trim());
  const errEnd = showErrors && coverageMode && !endInRange;
  const endErrMessage =
    DATE_RE.test(end.trim()) && !endInRange
      ? `Не позже ${formatHuman(segmentEnd)} и не раньше начала`
      : 'Укажите дату в формате дд.мм.гггг';

  const handleSave = () => {
    const baseValid = Boolean(snoId) && Boolean(rate.trim()) && DATE_RE.test(start.trim());
    const valid = baseValid && (!coverageMode || endInRange);
    if (!valid) {
      setShowErrors(true);
      return;
    }
    if (formOrigin === 'section' && isDuplicate(snoId!, start.trim())) {
      setDuplicate(true);
      return;
    }

    const added: PastSystem = {
      id: nextId(),
      snoId: snoId!,
      label: sno!.label,
      rate: rate.trim(),
      isReduced: showJustification,
      start: start.trim(),
      end: end.trim(),
      code: showJustification ? code : undefined,
      article: showJustification ? article : undefined,
      point: showJustification ? point : undefined,
      subpoint: showJustification ? subpoint : undefined,
    };
    addSystem(added);

    if (formOrigin === 'onboarding') {
      back();
      return;
    }

    // Сценарий «из раздела». Проверяем, закрыт ли теперь весь период.
    if (coverageMode) {
      const next = computeCoverage(calcStart, CURRENT_SYSTEM.start, [...previousSystems, added]);
      if (next.covered) {
        setPastSnoTaskDone(true);
        resetTo(['home', 'taxation']);
        showResult({
          state: 'success',
          title: 'История систем заполнена',
          text: 'Спасибо! Период расчёта полностью закрыт — подготовим задачи по декларациям за прошлые периоды.',
        });
      } else {
        // Ещё есть непокрытый остаток — возвращаемся к списку продолжить.
        resetTo(['home', 'taxation', 'previous-list']);
      }
      return;
    }

    // Обычное добавление прошлой системы из раздела.
    setPastSnoTaskDone(true);
    resetTo(['home', 'taxation', 'previous-list']);
    showResult({
      state: 'success',
      title: 'Система добавлена',
      text: sno!.noPastTask
        ? 'Данные сохранены. По АУСН, НПД и ОСНО задачи за прошлый период не формируются — за эти периоды отчитывается другой оператор.'
        : 'Данные сохранены. Подготовим задачи по декларации за прошлый период на основании истории СНО.',
    });
  };

  const nav = (
    <NavigationBar
      title="Предыдущая система"
      rootLinkLabel={formOrigin === 'onboarding' ? 'Настройка бухгалтерии' : 'Онлайн-бухгалтерия'}
      hasRootLink
      hasBackButton
      hasActionButton={false}
      onBackClick={back}
      onRootLinkClick={back}
    />
  );

  return (
    <PageLayout size="s" navigationBar={nav} topOffset={74} className="form-page">
      <div className="form-page__body stack stack--4x">
        {duplicate && (
          <ContextualNotification
            size="m"
            title="Такая запись уже есть"
            text="Система с этой же СНО и датой начала уже добавлена. Укажите другой период или систему."
            icon={<InformationCircle />}
            hasCloseIcon
            onClose={() => setDuplicate(false)}
          />
        )}

        {/* Система и ставка */}
        <div className="stack stack--4x">
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

          <Input
            label="Ставка"
            placeholder="Например, 6%"
            value={rate}
            onChange={setRate}
            isError={errRate}
            errorMessage="Укажите ставку"
            description={sno?.canReduce ? `Стандартная ставка — ${sno.defaultRate}` : undefined}
          />
        </div>

        {/* Период применения */}
        <div className="stack stack--4x">
          <Input
            label="Начало применения"
            placeholder="дд.мм.гггг"
            value={start}
            onChange={(v) => setStart(maskDate(v))}
            isDisabled={coverageMode}
            isError={errStart}
            errorMessage="Укажите дату в формате дд.мм.гггг"
            description={
              coverageMode
                ? 'Продолжает период с начала расчёта / предыдущей системы'
                : quarterHint(start, 'start') || undefined
            }
            hasHelpIcon={!coverageMode}
            helpText="Дата, с которой вы начали применять эту систему налогообложения"
          />
          <Input
            label="Окончание применения"
            placeholder={
              coverageMode ? 'дд.мм.гггг' : 'дд.мм.гггг · оставьте пустым, если применяется сейчас'
            }
            value={end}
            onChange={(v) => setEnd(maskDate(v))}
            isError={errEnd}
            errorMessage={endErrMessage}
            description={
              coverageMode
                ? quarterHint(end, 'end') || `Не позже ${formatHuman(segmentEnd)}`
                : quarterHint(end, 'end') || undefined
            }
          />
        </div>

        {/* Обоснование ставки */}
        {showJustification && (
          <div className="stack stack--4x">
            <div>
              <h2 className="ts-600-l section-title">Обоснование ставки</h2>
              <p className="ts-400-s section-subtitle">
                Введите номер, пункт и подпункт статьи закона субъекта РФ, на основании которых применяете
                пониженную ставку. Без этих данных не получится правильно заполнить декларацию по УСН.
              </p>
            </div>

            <Dropdown
              label="Код обоснования"
              placeholder="Выберите код"
              value={code || undefined}
              description={CODE_OPTIONS.find((c) => c.value === code)?.hint}
            >
              {CODE_OPTIONS.map((c) => (
                <Cell key={c.value} title={c.value} subtitle={c.hint} hasLeftAccessory={false} onClick={() => setCode(c.value)} />
              ))}
            </Dropdown>

            <div className="triple">
              <Input label="Статья" placeholder="123" value={article} onChange={setArticle} />
              <Input label="Пункт" placeholder="98" value={point} onChange={setPoint} />
              <Input label="Подпункт" placeholder="0000" value={subpoint} onChange={setSubpoint} />
            </div>

            <button type="button" className="help-link" onClick={() => setStatyaOpen(true)}>
              <span className="ds-icon ds-icon--m" aria-hidden="true">
                <InformationCircle />
              </span>
              <span className="ts-500-m">Где взять данные о статье</span>
            </button>
          </div>
        )}

      </div>

      <div className="form-page__footer">
        <div style={{ width: 360 }}>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>

      <StatyaModal isOpen={isStatyaOpen} onClose={() => setStatyaOpen(false)} />
    </PageLayout>
  );
}
