import { useState } from 'react';
import {
  PageLayout,
  NavigationBar,
  Widget,
  Cell,
  CellLeftAccessory,
  PageAction,
  Avatar,
  ContextualNotification,
  LinearProgress,
} from '@ds';
import {
  Calendar,
  DocumentPatent,
  DocumentReport,
  Plus,
  WatchArrowRotationLeft,
  InformationCircle,
} from '@ds/icons';
import { useStore } from '../store';
import {
  CURRENT_SYSTEM,
  CURRENT_PATENTS,
  computeCoverage,
  coveragePercent,
  formatHuman,
} from '../data';
import { CalcStartModal } from '../overlays/CalcStartModal';
import icTaxUsn from '../mp/assets/ic-tax-usn.png';

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="ds-icon ds-icon--m page-action-icon" aria-hidden="true">
      {children}
    </span>
  );
}

/** Иконка-документ на «изумрудной» подложке — как для патентов в макете. */
const emeraldAvatar = {
  '--avatar-surface': 'var(--category-emerald)',
  '--avatar-color': 'var(--primitive-default)',
} as React.CSSProperties;

export function TaxationSection() {
  const { go, back, calcStart, setCalcStart, previousSystems, bookkeepingStart } = useStore();

  const [isCalcOpen, setCalcOpen] = useState(false);

  const activeSystem = CURRENT_SYSTEM;

  // Покрытие требуемого периода прошлыми системами. Верхняя граница разрыва —
  // сохранённый из онбординга «момент начала работы с Точкой».
  const coverage = computeCoverage(calcStart, bookkeepingStart, previousSystems);
  const percent = coveragePercent(coverage);
  const showPrompt = coverage.needsPast && !coverage.covered;
  const periodText = `${formatHuman(coverage.requiredFrom)} — ${formatHuman(coverage.requiredTo)}`;

  // Изменение даты в модалке: применяем и ведём на страницу редактирования СНО.
  const handleCalcChange = (date: string) => {
    setCalcOpen(false);
    setCalcStart(date);
    go('sno-editor');
  };

  const nav = (
    <NavigationBar
      title="Система налогообложения"
      rootLinkLabel="Онлайн-бухгалтерия"
      hasRootLink
      hasBackButton
      hasActionButton={false}
      onBackClick={back}
      onRootLinkClick={back}
    />
  );

  return (
    <PageLayout size="s" navigationBar={nav} topOffset={74} className="tax-page">
      <div className="stack stack--6x">
        {/* Пока период не закрыт — показываем, чего не хватает, и ведём в редактор. */}
        {showPrompt && (
          <div className="stack stack--3x">
            <ContextualNotification
              size="m"
              title="Не хватает данных о системах налогообложения"
              text={`С ${formatHuman(coverage.requiredFrom)} мы ведём ваш расчёт, но не знаем, на каких системах вы были. Укажите системы за период ${periodText}.`}
              icon={<InformationCircle />}
              accessory="icon"
              hasAction
              actionLabel="Указать системы"
              onActionClick={() => go('sno-editor')}
            />
            <div className="card" style={{ background: 'var(--container-primary)' }}>
              <LinearProgress value={percent} ariaLabel="Покрытие периода" />
              <p className="ts-400-s muted" style={{ marginTop: 'var(--spacing-2x)' }}>
                Период закрыт на {percent}%
              </p>
            </div>
          </div>
        )}

        {/* Единый раздел системы налогообложения. */}
        <Widget title="Действующая система" minContentHeight={0} rightAccessoryVariant="none">
          <div className="stack stack--6x">
            {activeSystem ? (
              <Cell
                title={activeSystem.label}
                description={`с ${formatHuman(bookkeepingStart)}`}
                leftAccessory={<img src={icTaxUsn} alt="" width={40} height={40} />}
                rightAccessory={<span className="ts-500-m">{activeSystem.rate}</span>}
              />
            ) : (
              <Cell
                title="Добавить систему налогообложения"
                titleColor="var(--primitive-brand)"
                hasRightAccessory={false}
                leftAccessory={
                  <CellLeftAccessory
                    variant="add-button"
                    icon={<Plus />}
                    onClick={() => go('system-form', 'section')}
                  />
                }
                onClick={() => go('system-form', 'section')}
              />
            )}
          </div>
        </Widget>

        {/* Патенты */}
        <Widget title="Патенты" minContentHeight={0} rightAccessoryVariant="none">
          <div className="stack stack--6x">
            <Cell
              title="Получить или добавить"
              titleColor="var(--primitive-brand)"
              hasRightAccessory={false}
              leftAccessory={<CellLeftAccessory variant="add-button" icon={<Plus />} />}
            />
            {CURRENT_PATENTS.map((p) => (
              <Cell
                key={p.id}
                title={`Патент ${p.number}`}
                description={p.period}
                leftAccessory={<Avatar size="m" shape="superellipse" icon={<DocumentPatent />} style={emeraldAvatar} />}
                hasRightAccessory={false}
              />
            ))}
          </div>
        </Widget>

        {/* Действия по разделу — нейтральный (чёрный) акцент вместо брендового.
            Порядок и состав — по макету «Налогообложение · Tax System Actions». */}
        <div className="stack stack--6x" style={{ marginTop: '8px' }}>
          <PageAction
            title="Предыдущие системы"
            description={showPrompt ? `Заполнено на ${percent}%` : undefined}
            className="page-action--neutral"
            leftAccessory={<Icon><WatchArrowRotationLeft /></Icon>}
            onClick={() => go('previous-list')}
          />
          <PageAction
            title="Начало расчёта в Точка Банке"
            description={formatHuman(calcStart)}
            className="page-action--neutral"
            leftAccessory={<Icon><Calendar /></Icon>}
            onClick={() => setCalcOpen(true)}
          />
          <PageAction
            title="Уменьшить патент"
            description="Заявление на уменьшение патента"
            className="page-action--neutral"
            leftAccessory={<Icon><DocumentReport /></Icon>}
            onClick={() => undefined}
          />
          <PageAction
            title="Заявление на УСН"
            className="page-action--neutral"
            leftAccessory={<Icon><DocumentReport /></Icon>}
            onClick={() => go('previous-list')}
          />
        </div>
      </div>

      <CalcStartModal
        isOpen={isCalcOpen}
        onClose={() => setCalcOpen(false)}
        value={calcStart}
        onSave={handleCalcChange}
      />
    </PageLayout>
  );
}
