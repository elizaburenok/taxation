import {
  PageLayout,
  NavigationBar,
  Widget,
  Cell,
  CellRightAccessory,
  PageAction,
  Avatar,
  Button,
  LinearProgress,
} from '@ds';
import {
  BadgeRoundedPercent,
  DocumentListAcsArrowRightOutgoing,
  Checkmark,
  ChevronRight,
  DocumentReport,
  BuildingGovernment,
} from '@ds/icons';
import { useStore } from '../store';
import { CURRENT_SYSTEM } from '../data';

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="ds-icon ds-icon--m page-action-icon" aria-hidden="true">
      {children}
    </span>
  );
}

const warnAvatar = {
  '--avatar-surface': 'var(--bg-error-1)',
  '--avatar-color': 'var(--primitive-error)',
} as React.CSSProperties;

const neutralAvatar = {
  '--avatar-surface': 'var(--bg-neutral-2)',
  '--avatar-color': 'var(--primitive-secondary)',
} as React.CSSProperties;

const ONBOARDING_TASKS = [
  'Уточните данные о компании',
  'Добавьте подпись',
  'Загрузите выписку из банка',
  'Настройте интеграцию с другими банками',
];

export function AccountingHome() {
  const { go, onboardingDone, pastSnoTaskDone } = useStore();

  const nav = (
    <NavigationBar
      title="Онлайн-бухгалтерия"
      description={`${CURRENT_SYSTEM.label} — ${CURRENT_SYSTEM.rate}`}
      hasBackButton
      hasActionButton={false}
      hasRootLink={false}
      onBackClick={() => undefined}
    />
  );

  return (
    <PageLayout size="s" navigationBar={nav} topOffset={74}>
      <div className="stack stack--6x">
        {!onboardingDone && <OnboardingCard done={onboardingDone} onStart={() => go('onboarding-form')} />}

        <div className="row row--3x">
          <Button variant="secondary" onClick={() => undefined}>
            + Добавить операцию
          </Button>
          <Button variant="secondary" onClick={() => undefined}>
            + Добавить документ
          </Button>
        </div>

        {/* Задачи */}
        <Widget title="Задачи" hasChevron={false} rightAccessoryVariant="none" minContentHeight={0}>
          {onboardingDone && !pastSnoTaskDone ? (
            <Cell
              title="Укажите систему налогообложения за прошлый период"
              description="Без неё не сформируем декларацию УСН за прошлый год"
              onClick={() => go('system-form', 'section')}
              leftAccessory={<Avatar size="m" shape="superellipse" icon={<DocumentReport />} style={warnAvatar} />}
              rightAccessory={<CellRightAccessory variant="disclosure" />}
            />
          ) : (
            <p className="ts-400-m muted" style={{ margin: 0 }}>
              Текущих задач нет
            </p>
          )}
        </Widget>

        {/* Общение с госорганами */}
        <Widget title="Общение с госорганами" hasChevron={false} rightAccessoryVariant="none" minContentHeight={0}>
          <div className="stack">
            <Cell
              title="Требования"
              description="Новых требований нет"
              hasRightAccessory={false}
              leftAccessory={<Avatar size="m" shape="superellipse" icon={<DocumentReport />} style={neutralAvatar} />}
            />
            <Cell
              title="Письма"
              description="Новых писем нет"
              hasRightAccessory={false}
              leftAccessory={<Avatar size="m" shape="superellipse" icon={<BuildingGovernment />} style={neutralAvatar} />}
            />
          </div>
        </Widget>

        {/* Точка входа в раздел СНО */}
        <PageAction
          title="Налогообложение и патенты"
          description={`${CURRENT_SYSTEM.label} — ${CURRENT_SYSTEM.rate}`}
          leftAccessory={<Icon><BadgeRoundedPercent /></Icon>}
          onClick={() => go('taxation')}
        />
        <PageAction
          title="Электронная подпись"
          description="Действует до 12.04.2027"
          leftAccessory={<Icon><DocumentListAcsArrowRightOutgoing /></Icon>}
          onClick={() => undefined}
        />
      </div>
    </PageLayout>
  );
}

function OnboardingCard({ done, onStart }: { done: boolean; onStart: () => void }) {
  const completed = done ? 1 : 0;
  return (
    <div className="card" style={{ background: 'var(--bg-brand-1)' }}>
      <div className="row row--3x" style={{ alignItems: 'flex-start', gap: 'var(--spacing-8x)' }}>
        <div style={{ flex: '0 0 260px' }}>
          <h2 className="ts-600-xl section-title">Начните работу с бухгалтерией</h2>
          <p className="ts-400-m section-subtitle">Выполните все задачи из списка</p>
          <div style={{ marginTop: 'var(--spacing-6x)' }}>
            <LinearProgress value={(completed / 4) * 100} ariaLabel="Прогресс онбординга" />
            <p className="ts-400-s muted" style={{ marginTop: 'var(--spacing-2x)' }}>
              {completed} из 4
            </p>
          </div>
        </div>
        <div className="grow stack" style={{ background: 'var(--container-primary)', borderRadius: 'var(--card-rounding)' }}>
          {ONBOARDING_TASKS.map((task, i) => {
            const isFirst = i === 0;
            const isDone = isFirst && done;
            return (
              <Cell
                key={task}
                title={task}
                titleColor={isDone ? 'var(--primitive-secondary)' : 'var(--primitive-primary)'}
                onClick={isFirst && !done ? onStart : undefined}
                leftAccessory={
                  <Avatar
                    size="s"
                    shape="circle"
                    label={isDone ? undefined : String(i + 1)}
                    icon={isDone ? <Checkmark /> : undefined}
                    style={
                      isDone
                        ? ({ '--avatar-surface': 'var(--bg-success-1)', '--avatar-color': 'var(--primitive-success)' } as React.CSSProperties)
                        : ({ '--avatar-surface': 'var(--bg-neutral-2)', '--avatar-color': 'var(--primitive-secondary)' } as React.CSSProperties)
                    }
                  />
                }
                rightAccessory={
                  isDone ? (
                    <span className="ds-icon ds-icon--m" aria-hidden="true" style={{ color: 'var(--primitive-success)' }}>
                      <Checkmark />
                    </span>
                  ) : (
                    <span className="ds-icon ds-icon--m muted" aria-hidden="true">
                      <ChevronRight />
                    </span>
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
