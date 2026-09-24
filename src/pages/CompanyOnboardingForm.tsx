import { useState } from 'react';
import {
  PageLayout,
  NavigationBar,
  Input,
  Dropdown,
  Cell,
  FormCell,
  Switch,
  Button,
  ActionFormCell,
} from '@ds';
import { PlusCircle } from '@ds/icons';
import { useStore } from '../store';
import {
  periodLabel,
  findSno,
  isReducedRate,
  rateOptions,
  computeCoverage,
  formatDmy,
  addDaysDmy,
  type PastSystem,
} from '../data';
import { PreviousSystemDrawer } from '../overlays/PreviousSystemDrawer';

const START_YEARS = ['2026', '2025', '2024', '2023'];

/** Действующая система клиента в онбординге — УСН «Доходы», допускает пониженную ставку. */
const CURRENT_SNO = findSno('usn-income')!;

/** Возможные ставки действующей системы для дропдауна выбора. */
const RATE_OPTIONS = rateOptions(CURRENT_SNO);

const CODE_OPTIONS = [
  { value: '3462010', hint: 'УСН «Доходы»' },
  { value: '3462020', hint: 'УСН «Доходы минус расходы»' },
  { value: '3462030', hint: 'УСН, минимальный налог' },
];

/** Позиция ячейки в сгруппированном стеке ActionFormCell. */
function stackVariant(index: number, total: number) {
  if (total === 1) return 'single' as const;
  if (index === 0) return 'stack-top' as const;
  if (index === total - 1) return 'stack-bottom' as const;
  return 'stack-middle' as const;
}

export function CompanyOnboardingForm() {
  const { previousSystems, back, setOnboardingDone, setBookkeepingStart, resetTo, showResult } = useStore();

  const [hasPatent, setHasPatent] = useState(false);
  const [hasMarketplaces, setHasMarketplaces] = useState(false);
  const [rate, setRate] = useState('6%');
  const [startYear, setStartYear] = useState('');

  // Обоснование пониженной ставки — поля появляются, когда ставка ниже стандартной.
  const [code, setCode] = useState('');
  const [article, setArticle] = useState('');
  const [point, setPoint] = useState('');
  const [subpoint, setSubpoint] = useState('');
  const showJustification = isReducedRate(rate, CURRENT_SNO);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PastSystem | null>(null);

  // Год начала ведения бухгалтерии = «момент начала работы с Точкой». Сохраняем в стор,
  // чтобы кабинет знал исходную верхнюю границу разрыва прошлых СНО.
  const selectStartYear = (y: string) => {
    setStartYear(y);
    setBookkeepingStart(`01.01.${y}`);
  };

  const openAdd = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (system: PastSystem) => {
    setEditing(system);
    setDrawerOpen(true);
  };

  const handleDone = () => {
    setOnboardingDone(true);
    resetTo(['home']);
    showResult({
      state: 'success',
      title: 'Данные о компании сохранены',
      text: previousSystems.length
        ? 'Спасибо! На основании истории СНО подготовим задачи по отчётности за прошлые периоды.'
        : 'Спасибо! Настроим бухгалтерию под ваш бизнес и будем правильно считать налоги.',
    });
  };

  const nav = (
    <NavigationBar
      title="Настройка бухгалтерии"
      rootLinkLabel="Онлайн-бухгалтерия"
      hasRootLink
      hasBackButton
      hasActionButton={false}
      onBackClick={back}
      onRootLinkClick={back}
    />
  );

  const hasPrevious = previousSystems.length > 0;
  // Кнопку добавления прошлых систем показываем для любого года кроме 2026.
  // Скрываем только когда весь требуемый период — от начала ведения бухгалтерии
  // до сегодняшнего дня — уже закрыт добавленными системами без пробелов.
  const canAddPrevious = startYear !== '' && startYear !== '2026';
  const calcStartDmy = startYear ? `01.01.${startYear}` : '';
  // Верхняя граница требуемого окна — сегодня (совпадает с maxDate в дровере).
  // computeCoverage считает requiredTo = currentStart - 1 день, поэтому передаём
  // «сегодня + 1 день», чтобы requiredTo стал ровно сегодня.
  const coverageEnd = addDaysDmy(formatDmy(new Date()), 1);
  const coverage = calcStartDmy && canAddPrevious
    ? computeCoverage(calcStartDmy, coverageEnd, previousSystems)
    : null;
  const periodCovered = coverage?.needsPast === true && coverage.covered === true;
  const showAddButton = canAddPrevious && !periodCovered;

  return (
    <PageLayout size="s" navigationBar={nav} topOffset={74} className="form-page">
      <div className="stack form-page__body">
        <div className="stack stack--8x">
          <div>
            <h1 className="ts-600-4xl section-title">Уточните информацию о компании</h1>
            <p className="ts-400-m section-subtitle">
              Настроим бухгалтерию под потребности бизнеса и будем правильно считать налоги
            </p>
          </div>

          {/* Свитчеры */}
          <div className="stack stack--2x">
            <FormCell
              title="Патент"
              description="Есть сейчас или применялся в этом году"
              right={<Switch isSelected={hasPatent} onChange={setHasPatent} label="Патент" />}
            />
            <FormCell
              title="Работа с маркетплейсами"
              right={<Switch isSelected={hasMarketplaces} onChange={setHasMarketplaces} label="Работа с маркетплейсами" />}
            />
          </div>

          {/* Форма системы налогообложения */}
          <div className="stack stack--3x">
            <h2 className="ts-500-xl section-title">Система налогообложения</h2>
            <Dropdown
              label="Текущая"
              value="УСН «Доходы»"
              hasHelpIcon
              helpText="Систему можно изменить в разделе «Налогообложение» после онбординга"
              isDisabled
            />
            <Dropdown
              label="Ставка"
              placeholder="Выберите ставку"
              value={rate || undefined}
              description={`Стандартная ставка — ${CURRENT_SNO.defaultRate}`}
            >
              {RATE_OPTIONS.map((r) => (
                <Cell
                  key={r}
                  title={r}
                  subtitle={r === CURRENT_SNO.defaultRate ? 'Стандартная ставка' : 'Пониженная ставка'}
                  hasLeftAccessory={false}
                  onClick={() => setRate(r)}
                />
              ))}
            </Dropdown>

            {/* Обоснование ставки — появляется, когда ставка ниже стандартной */}
            {showJustification && (
              <div className="stack stack--3x">
                <div>
                  <h2 className="ts-500-xl section-title">Обоснование ставки</h2>
                  <p className="ts-400-s section-subtitle">
                    Введите номер, пункт и подпункт статьи закона субъекта РФ, на основании которых
                    применяете пониженную ставку. Без этих данных не получится правильно заполнить
                    декларацию по УСН.
                  </p>
                </div>

                <Dropdown
                  label="Код обоснования"
                  placeholder="Выберите код"
                  value={code || undefined}
                  description={CODE_OPTIONS.find((c) => c.value === code)?.hint}
                >
                  {CODE_OPTIONS.map((c) => (
                    <Cell
                      key={c.value}
                      title={c.value}
                      subtitle={c.hint}
                      hasLeftAccessory={false}
                      onClick={() => setCode(c.value)}
                    />
                  ))}
                </Dropdown>

                <Input label="Статья" placeholder="Например, 361" value={article} onChange={setArticle} />
                <Input label="Пункт" placeholder="Например, 1234" value={point} onChange={setPoint} />
                <Input label="Подпункт" placeholder="Например, 64" value={subpoint} onChange={setSubpoint} />
              </div>
            )}

            <Dropdown
              label="Начало ведения бухгалтерии"
              placeholder="Выберите год"
              value={startYear || undefined}
              hasHelpIcon
              helpText="Год, с которого мы ведём вашу бухгалтерию и считаем налоги"
            >
              {START_YEARS.map((y) => (
                <Cell key={y} title={y} hasLeftAccessory={false} onClick={() => selectStartYear(y)} />
              ))}
            </Dropdown>
          </div>

          {/* Прошлые системы — появляются, только если расчёт начинается не с 2026
              года. 32px под формой СНО (общий gap стека stack--8x). */}
          {(showAddButton || hasPrevious) && (
            <div className="stack stack--3x">
              {hasPrevious && (
                <>
                  <h2 className="ts-500-xl section-title">Прошлые системы налогообложения</h2>
                  <div>
                    {[...previousSystems].sort((a, b) => {
                      const da = parseDmy(a.start)?.getTime() ?? 0;
                      const db = parseDmy(b.start)?.getTime() ?? 0;
                      return db - da;
                    }).map((s, i) => (
                      <ActionFormCell
                        key={s.id}
                        title={s.label}
                        description={periodLabel(s.start, s.end)}
                        variant={stackVariant(i, previousSystems.length)}
                        onClick={() => openEdit(s)}
                      />
                    ))}
                  </div>
                </>
              )}

              {showAddButton && (
                <ActionFormCell
                  title="Добавить систему налогообложения"
                  description="Если обсуждались ранее в другом банке"
                  left={
                    <span className="ds-icon ds-icon--24" aria-hidden="true">
                      <PlusCircle />
                    </span>
                  }
                  onClick={openAdd}
                />
              )}
            </div>
          )}
        </div>

        <div className="form-page__footer">
          <div style={{ width: 360 }}>
            <Button variant="primary" onClick={handleDone}>
              Готово
            </Button>
          </div>
        </div>
      </div>

      <PreviousSystemDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editing={editing}
        startYear={startYear}
      />
    </PageLayout>
  );
}
