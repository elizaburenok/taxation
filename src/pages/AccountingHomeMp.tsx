import type { ComponentType, ReactNode } from 'react';
import {
  ArrowLeft,
  PlusCircle,
  DocumentListAcsPlus,
  ChevronRight,
  NumberOneCircle,
  NumberTwoCircle,
  NumberThreeCircle,
  NumberFourCircle,
  WatchArrowRotationLeft,
  EmblemPercent,
  Moneybox,
  DocumentBookList,
  PersonAcsMagnifier,
  DocumentListAcsArrowRotationRight,
  EmblemT,
  Pen,
  ShoppingBasket,
  Integration,
  RequisitesT,
} from '@ds/icons';
import type { DsIconSvgProps } from '@ds/icons';
import { useStore } from '../store';
import { CURRENT_SYSTEM } from '../data';
import { IconBookkeeping } from '../mp/CustomIcons';
import icTrebovaniya from '../mp/assets/ic-trebovaniya.svg';
import icPisma from '../mp/assets/ic-pisma.svg';
import icSverki from '../mp/assets/ic-sverki.svg';
import icTaxUsn from '../mp/assets/ic-tax-usn.png';
import icEnp from '../mp/assets/ic-enp.png';
import '../mp/mp-tokens.css';
import '../mp/accounting.css';

/** Иконка раздела/действия из ДС — размер 30px, цвет наследуется от контейнера. */
function SectionIcon({ Icon }: { Icon: ComponentType<DsIconSvgProps> }) {
  return (
    <span className="ds-icon ds-icon--30" aria-hidden="true">
      <Icon />
    </span>
  );
}

/** Круглый чек в шкале прогресса онбординга (белый круг + фиолетовая галочка). */
function IconProgressCheck({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="var(--container-default, #ffffff)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.7071 8.29289C16.3166 7.90237 15.8905 7.90237 15.5 8.29289L10 13.5858L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L9.29289 15.7071C9.68342 16.0976 10.3166 16.0976 10.7071 15.7071L16.7071 9.70711C17.0976 9.31658 17.0976 8.68342 16.7071 8.29289Z"
        fill="var(--primitive-brand, #835de1)"
      />
    </svg>
  );
}

function IconClock({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const QUICK_LINKS = [
  'Документооборот',
  'Бухгалтерия с сотрудниками',
  'Заплатить по реквизитам',
  'Выставить счёт',
  'Перевести по номеру телефона',
];

const SECTION_CARDS: { id: string; icon: ReactNode; title: string; description?: string }[] = [
  { id: 'operations', icon: <SectionIcon Icon={WatchArrowRotationLeft} />, title: 'Операции' },
  { id: 'ens', icon: <SectionIcon Icon={EmblemPercent} />, title: 'ЕНС', description: 'Заявка принята' },
  { id: 'moneybox', icon: <SectionIcon Icon={Moneybox} />, title: 'Копилка на налоги', description: '0 ₽' },
  { id: 'kudir', icon: <SectionIcon Icon={DocumentBookList} />, title: 'КУДиР' },
  { id: 'employees', icon: <SectionIcon Icon={PersonAcsMagnifier} />, title: 'Сотрудники' },
  { id: 'doc-updates', icon: <SectionIcon Icon={DocumentListAcsArrowRotationRight} />, title: 'Обновления в документах' },
];

const ONBOARDING_TASKS_TOTAL = 4;

/** Строка задачи/госоргана внутри карточки-навигатора. */
function NavRow({
  icon,
  title,
  desc,
  descDanger,
  right,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  desc?: string;
  descDanger?: boolean;
  right?: ReactNode;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp className="nav-row" onClick={onClick} {...(onClick ? { type: 'button' as const } : {})}>
      <span className="nav-row__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="nav-row__text">
        <span className="nav-row__title ts-500-m">{title}</span>
        {desc && <span className={`nav-row__desc ts-400-s ${descDanger ? 'nav-row__desc--danger' : ''}`}>{desc}</span>}
      </span>
      {right && <span className="nav-row__right">{right}</span>}
    </Comp>
  );
}

export function AccountingHomeMp() {
  const { go, back, onboardingDone } = useStore();
  // Единый поток: до завершения онбординга — «онбординг»-дом, после — активный кабинет.
  const isCabinet = onboardingDone;
  const completedTasks = onboardingDone ? 1 : 0;
  const onboardingFill = `${(completedTasks / ONBOARDING_TASKS_TOTAL) * 100}%`;

  // Шаги онбординга. Первый шаг ведёт в форму, где среди прочего добавляется СНО.
  const onboardingSteps: { icon: ReactNode; title: string; onClick?: () => void }[] = [
    { icon: <NumberOneCircle width={30} height={30} />, title: 'Уточните данные о компании', onClick: () => go('onboarding-form') },
    { icon: <NumberTwoCircle width={30} height={30} />, title: 'Добавьте подпись' },
    { icon: <NumberThreeCircle width={30} height={30} />, title: 'Загрузите выписку из банка' },
    { icon: <NumberFourCircle width={30} height={30} />, title: 'Настройте интеграции с другими банками' },
  ];

  const pageActions: { id: string; icon: ReactNode; title: string; description: string; onClick?: () => void }[] = [
    {
      id: 'tax',
      icon: <SectionIcon Icon={EmblemT} />,
      title: 'Налогообложение и патенты',
      description: `${CURRENT_SYSTEM.label} — ${CURRENT_SYSTEM.rate}`,
      onClick: () => go('taxation'),
    },
    { id: 'signature', icon: <SectionIcon Icon={Pen} />, title: 'Электронная подпись', description: 'Действует до 01.08.2028' },
    { id: 'marketplaces', icon: <SectionIcon Icon={ShoppingBasket} />, title: 'Маркетплейсы', description: 'Wildberries, Ozon, Яндекс Маркет' },
    { id: 'integrations', icon: <SectionIcon Icon={Integration} />, title: 'Интеграции', description: 'Т-Банк, Сбербанк' },
    { id: 'tariff', icon: <SectionIcon Icon={RequisitesT} />, title: 'Тариф', description: 'Всё включено' },
  ];

  const govItems = isCabinet
    ? [
        { id: 'req', img: icTrebovaniya, title: 'Требования', desc: 'Ознакомьтесь с требованием', right: <span className="nav-badge ts-600-xs">1</span> },
        { id: 'let', img: icPisma, title: 'Письма', desc: 'Есть новые письма', right: <span className="nav-badge ts-600-xs">3</span> },
        { id: 'rec', img: icSverki, title: 'Сверки', desc: '4 сверки готовятся', right: <span className="nav-clock"><IconClock /></span> },
      ]
    : [
        { id: 'req', img: icTrebovaniya, title: 'Требования', desc: 'Новых требований нет', right: null },
        { id: 'let', img: icPisma, title: 'Письма', desc: 'Новых писем нет', right: null },
        { id: 'rec', img: icSverki, title: 'Сверки', desc: 'Здесь можно запросить сверку', right: null },
      ];

  return (
    <div className="accounting-page">
      {/* Sidebar */}
      <aside className="accounting-sidebar">
        <button className="accounting-sidebar__back-btn" onClick={back} aria-label="Назад">
          <span className="ds-icon ds-icon--s" aria-hidden="true"><ArrowLeft /></span>
        </button>
        <div className="accounting-sidebar__heading">
          <h1 className="accounting-sidebar__title ts-600-2xl">Онлайн-бухгалтерия</h1>
          <span className="accounting-sidebar__subtitle ts-400-s">{`${CURRENT_SYSTEM.label} — ${CURRENT_SYSTEM.rate}`}</span>
        </div>
        <nav className="accounting-sidebar__nav">
          {QUICK_LINKS.map((label) => (
            <button key={label} type="button" className="accounting-sidebar__nav-link ts-500-s">
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="accounting-page__content">
        <div className="accounting-page__column">
          {/* Онбординг-виджет «Начните работу с бухгалтерией» */}
          {!onboardingDone && (
            <section className="ob-card" aria-label="Начните работу с бухгалтерией">
              <div className="ob-card__header">
                <div className="ob-card__text">
                  <p className="ob-card__title ts-600-xl">Начните работу с бухгалтерией</p>
                  <p className="ob-card__subtitle ts-400-s">Выполните все задачи из списка</p>
                </div>
                <div className="ob-card__progress">
                  <span className="ob-card__progress-check" aria-hidden="true">
                    <IconProgressCheck />
                  </span>
                  <div className="ob-card__progress-bar">
                    <div className="ob-card__progress-track" />
                    <div className="ob-card__progress-fill" style={{ width: onboardingFill }} />
                  </div>
                  <span className="ob-card__progress-count ts-500-s">{`${completedTasks} из ${ONBOARDING_TASKS_TOTAL}`}</span>
                </div>
              </div>
              <div className="ob-card__tasks">
                {onboardingSteps.map((step) => {
                  const Comp = step.onClick ? 'button' : 'div';
                  return (
                    <Comp
                      key={step.title}
                      className="ob-card__task"
                      onClick={step.onClick}
                      {...(step.onClick ? { type: 'button' as const } : {})}
                    >
                      <span className="ob-card__task-num" aria-hidden="true">{step.icon}</span>
                      <span className="ob-card__task-title ts-500-m">{step.title}</span>
                      <span className="ob-card__task-chevron ds-icon" aria-hidden="true"><ChevronRight /></span>
                    </Comp>
                  );
                })}
              </div>
            </section>
          )}

          {/* Header buttons */}
          <div className="accounting-page__header-buttons">
            <button className="accounting-page__action-btn ts-500-s">
              <span className="ds-icon ds-icon--s" aria-hidden="true"><PlusCircle /></span>
              Добавить операцию
            </button>
            <button className="accounting-page__action-btn ts-500-s">
              <span className="ds-icon ds-icon--s" aria-hidden="true"><DocumentListAcsPlus /></span>
              Добавить документ
            </button>
          </div>

          {/* Navigators */}
          <div className="accounting-page__navigators">
            {/* Задачи */}
            {!onboardingDone ? (
              <div className="navigator">
                <div className="tasks-navigator">
                  <div className="tasks-navigator__content">
                    <p className="navigator__title ts-600-xl">Задачи</p>
                    <p className="navigator__description ts-400-s">Текущих задач нет</p>
                  </div>
                  <span className="tasks-navigator__icon" aria-hidden="true">
                    <IconBookkeeping size={24} />
                  </span>
                </div>
              </div>
            ) : (
            <div className="nav-card">
              <div className="nav-card__header">
                <p className="navigator__title ts-600-xl">Задачи</p>
                <span className="nav-card__chevron ds-icon ds-icon--18" aria-hidden="true"><ChevronRight /></span>
              </div>

              {isCabinet ? (
                <>
                  <div className="nav-card__rows">
                    <NavRow
                      icon={<img src={icTaxUsn} alt="" width={40} height={40} />}
                      title="Налог по УСН за IV кв. 2024"
                      desc="до 25 марта"
                      descDanger
                      right={<span className="nav-row__amount ts-500-m">28 712 ₽</span>}
                    />
                    <NavRow
                      icon={<img src={icEnp} alt="" width={40} height={40} />}
                      title="Уведомление по ЕНП I кв."
                      desc="до 25 апреля"
                    />
                  </div>
                  <button type="button" className="nav-card__show-all ts-500-s">
                    Показать все
                  </button>
                </>
              ) : (
                <p className="ts-400-m muted" style={{ margin: 0 }}>
                  Текущих задач нет
                </p>
              )}
            </div>
            )}

            {/* Общение с госорганами */}
            <div className="nav-card">
              <div className="nav-card__header">
                <p className="navigator__title ts-600-xl">Общение с госорганами</p>
              </div>
              <div className="nav-card__rows">
                {govItems.map((item) => (
                  <NavRow
                    key={item.id}
                    icon={<img src={item.img} alt="" width={40} height={40} />}
                    title={item.title}
                    desc={item.desc}
                    right={item.right}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section cards */}
          <div className="accounting-page__cards-grid">
            {SECTION_CARDS.map((card) => (
              <button key={card.id} type="button" className="section-card">
                <div className="section-card__icon-row">
                  <div className="section-card__icon">{card.icon}</div>
                </div>
                <div className="section-card__text">
                  <span className="section-card__title ts-600-s">{card.title}</span>
                  {card.description && <span className="section-card__description ts-500-s">{card.description}</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Page actions */}
          <div className="accounting-page__actions-list">
            {pageActions.map((action) => (
              <button key={action.id} type="button" className="mp-page-action" onClick={action.onClick}>
                <div className="mp-page-action__icon">{action.icon}</div>
                <div className="mp-page-action__content">
                  <span className="mp-page-action__title ts-400-l">{action.title}</span>
                  <span className="mp-page-action__description ts-400-s">{action.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
