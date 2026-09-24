import { useState } from 'react';
import {
  PageLayout,
  NavigationBar,
  Dropdown,
  Cell,
  Input,
  Button,
  ActionFormCell,
} from '@ds';
import { PlusCircle } from '@ds/icons';
import { useStore } from '../store';
import {
  CURRENT_SYSTEM,
  REGISTRATION_DATE,
  findSno,
  rateOptions,
  isReducedRate,
  periodLabel,
  formatHuman,
  addDaysDmy,
  parseDmy,
  type PastSystem,
} from '../data';
import { PreviousSystemDrawer } from '../overlays/PreviousSystemDrawer';

/** Действующая система клиента — УСН «Доходы», допускает пониженную ставку. */
const CURRENT_SNO = findSno(CURRENT_SYSTEM.snoId)!;
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

/** Год из даты dd.mm.yyyy. */
const yearOf = (dmy: string) => dmy.slice(6);

/**
 * Страница редактирования систем налогообложения за прошлые периоды.
 * По образцу онбординга «Уточните информацию о компании»: инлайн-форма с данными
 * клиента (система, ставка, год начала расчёта — редактируемый). Ниже — прошлые
 * системы за период до действующей (add/edit через боковой Drawer).
 */
export function PastSystemsEditor() {
  const { previousSystems, calcStart, setCalcStart, bookkeepingStart, back, resetTo, showResult } = useStore();

  // Верхняя граница разрыва прошлых СНО = «момент начала работы с Точкой» из онбординга.
  const currentYear = Number(yearOf(bookkeepingStart)); // напр. 2026
  const regYear = Number(yearOf(REGISTRATION_DATE)); // 2019
  const START_YEARS = Array.from({ length: currentYear - regYear + 1 }, (_, i) =>
    String(currentYear - i),
  );

  const selectedYear = yearOf(calcStart);

  // Ставка действующей системы — предзаполнена, редактируется как в онбординге.
  const [rate, setRate] = useState(CURRENT_SYSTEM.rate);
  const [code, setCode] = useState('');
  const [article, setArticle] = useState('');
  const [point, setPoint] = useState('');
  const [subpoint, setSubpoint] = useState('');
  const showJustification = isReducedRate(rate, CURRENT_SNO);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PastSystem | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (system: PastSystem) => {
    setEditing(system);
    setDrawerOpen(true);
  };

  const selectYear = (y: string) => {
    setCalcStart(`01.01.${y}`);
  };

  // Есть ли период до действующей системы (год начала расчёта раньше её старта).
  const hasPast = Number(selectedYear) < currentYear;
  const hasPrevious = previousSystems.length > 0;

  // Границы периода прошлых систем — от начала расчёта до дня перед началом работы с Точкой.
  const requiredTo = addDaysDmy(bookkeepingStart, -1);
  const minDate = parseDmy(`01.01.${selectedYear}`) ?? undefined;
  const maxDate = parseDmy(requiredTo) ?? undefined;
  const rangeHint = `Период применения — ${formatHuman(`01.01.${selectedYear}`)} — ${formatHuman(requiredTo)}`;

  const systems = [...previousSystems].sort((a, b) => {
    const da = parseDmy(a.start)?.getTime() ?? 0;
    const db = parseDmy(b.start)?.getTime() ?? 0;
    return db - da;
  });

  const handleDone = () => {
    resetTo(['home', 'taxation']);
    showResult({
      state: 'success',
      title: 'Данные сохранены',
      text: hasPast
        ? 'Спасибо! На основании истории систем налогообложения подготовим задачи по декларациям за прошлые периоды.'
        : 'Спасибо! Настроим бухгалтерию и будем правильно считать налоги.',
    });
  };

  const nav = (
    <NavigationBar
      title="Системы налогообложения"
      rootLinkLabel="Онлайн-бухгалтерия"
      hasRootLink
      hasBackButton
      hasActionButton={false}
      onBackClick={back}
      onRootLinkClick={back}
    />
  );

  return (
    <PageLayout size="s" navigationBar={nav} topOffset={74} className="form-page">
      <div className="stack form-page__body">
        <div className="stack stack--8x">
          {/* Форма системы налогообложения — предзаполнена данными клиента. */}
          <div className="stack stack--3x">
            <h2 className="ts-600-l section-title">Действующая система</h2>
            <Dropdown
              label="Текущая"
              value={CURRENT_SYSTEM.label}
              hasHelpIcon
              helpText="Действующая система клиента. Изменить её можно отдельно."
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

            {/* Обоснование пониженной ставки — как в онбординге. */}
            {showJustification && (
              <div className="stack stack--3x">
                <div>
                  <h2 className="ts-600-l section-title">Обоснование ставки</h2>
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
              label="Год начала расчёта"
              placeholder="Выберите год"
              value={selectedYear || undefined}
              hasHelpIcon
              helpText="Год, с которого мы ведём вашу бухгалтерию и считаем налоги"
            >
              {START_YEARS.map((y) => (
                <Cell key={y} title={y} hasLeftAccessory={false} onClick={() => selectYear(y)} />
              ))}
            </Dropdown>
          </div>

          {/* Прошлые системы — появляются, если расчёт начинается раньше действующей системы. */}
          {(hasPast || hasPrevious) && (
            <div className="stack stack--3x">
              {hasPrevious && (
                <>
                  <h2 className="ts-600-l section-title">Прошлые системы налогообложения</h2>
                  <div>
                    {systems.map((s, i) => (
                      <ActionFormCell
                        key={s.id}
                        title={s.label}
                        description={`${periodLabel(s.start, s.end)}${s.rate ? ` · ${s.rate}` : ''}`}
                        variant={stackVariant(i, systems.length)}
                        onClick={() => openEdit(s)}
                      />
                    ))}
                  </div>
                </>
              )}

              {hasPast && (
                <ActionFormCell
                  title="Добавить систему налогообложения"
                  description="Система, период и ставка"
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
        withRate
        minDate={minDate}
        maxDate={maxDate}
        rangeHint={rangeHint}
        prefill={{
          snoId: CURRENT_SYSTEM.snoId,
          rate: CURRENT_SYSTEM.rate,
          // Даты не предзаполняем: календарь сам откроется на первом свободном дне,
          // а пользователь осознанно выбирает период (без автоподстановки).
          start: '',
          end: '',
        }}
      />
    </PageLayout>
  );
}
