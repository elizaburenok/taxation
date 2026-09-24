import { PageLayout, NavigationBar, Cell, Avatar, Button, ContextualNotification } from '@ds';
import { BadgeRoundedPercent, Plus, InformationCircle } from '@ds/icons';
import { useStore } from '../store';
import { findSno, computeCoverage, coveragePercent, formatHuman, type SnoId } from '../data';
import emptyTaxation from '../mp/assets/empty-taxation.svg';
import logoUsn from '../mp/assets/logo-usn.svg';

const SNO_LOGO: Partial<Record<SnoId, string>> = {
  'usn-income': logoUsn,
  'usn-income-expense': logoUsn,
};

const brandAvatar = {
  '--avatar-surface': 'var(--bg-brand-1)',
  '--avatar-color': 'var(--primitive-brand)',
} as React.CSSProperties;

export function PreviousSystemsList() {
  const { previousSystems, go, back, calcStart, bookkeepingStart } = useStore();

  const coverage = computeCoverage(calcStart, bookkeepingStart, previousSystems);
  const showGap = coverage.needsPast && !coverage.covered;
  const percent = coveragePercent(coverage);

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

  const addButton = (
    <Button className="btn-auto" variant="primary" onClick={() => go('system-form', 'section')}>
      <span className="row row--2x">
        <span className="ds-icon ds-icon--s" aria-hidden="true">
          <Plus />
        </span>
        Добавить систему
      </span>
    </Button>
  );

  return (
    <PageLayout size="s" navigationBar={nav} topOffset={74}>
      <div className="stack stack--8x">
        {showGap && (
          <ContextualNotification
            size="m"
            title="Заполните период расчёта"
            text={`Нужны системы за ${formatHuman(coverage.requiredFrom)} — ${formatHuman(coverage.requiredTo)}. Следующий период начинается с ${formatHuman(coverage.nextStart)}. Закрыто на ${percent}%.`}
            icon={<InformationCircle />}
            accessory="icon"
          />
        )}

        <div className="row" style={{ justifyContent: 'flex-start' }}>{addButton}</div>

        {previousSystems.length === 0 ? (
          <div className="empty-view">
            <img className="empty-view__art" src={emptyTaxation} alt="" aria-hidden="true" />
            <p className="empty-view__text ts-400-m">
              У вас нет предыдущих систем налогообложения. Если она есть, то можете добавить
              её и мы учтём операции за этот период по этой системе.
            </p>
          </div>
        ) : (
          <div className="stack stack--6x">
            {previousSystems.map((s) => {
              const period = s.end ? `${s.start} — ${s.end}` : `с ${s.start}`;
              const sno = findSno(s.snoId);
              return (
                <Cell
                  key={s.id}
                  title={s.label}
                  titleClassName="ts-500-l"
                  description={`${period}${s.isReduced ? ' · пониженная ставка' : ''}${sno?.noPastTask ? ' · без задач за период' : ''}`}
                  leftAccessory={
                    SNO_LOGO[s.snoId]
                      ? <Avatar size="m" shape="superellipse" imageUrl={SNO_LOGO[s.snoId]} />
                      : <Avatar size="m" shape="superellipse" icon={<BadgeRoundedPercent />} style={brandAvatar} />
                  }
                  rightAccessory={<span className="ts-500-l" style={{ color: 'var(--primitive-primary)' }}>{s.rate}</span>}
                />
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
