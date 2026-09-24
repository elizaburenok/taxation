import { createPortal } from 'react-dom';
import { Modal, ModalHeader, ModalFooter } from '@ds';

const STEPS = [
  <>Войдите в <a href="https://lkfl2.nalog.ru" target="_blank" rel="noreferrer" style={{ color: 'var(--primitive-brand)' }}>личный кабинет</a> на сайте ФНС</>,
  'Откройте раздел «Сведения о применяемых системах налогообложения»',
  'Найдите нужную систему — рядом будет указана дата, с которой вы её применяете',
  'Если системы нет в списке, посмотрите уведомление о переходе на УСН — год начала указан в нём',
];

/**
 * Подсказка «Как узнать год»: где посмотреть дату начала применения системы
 * налогообложения. Рендерится через портал в document.body, чтобы выходить за
 * пределы стекингового контекста дровера (оба имеют z-index: 1000).
 */
export function StartYearModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return createPortal(
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<ModalHeader title="Как узнать год" onClose={onClose} />}
      footer={<ModalFooter layout="1-button" primaryAction={{ label: 'Понятно', onClick: onClose }} />}
    >
      <ol className="stack stack--3x" style={{ margin: 0, paddingLeft: 'var(--spacing-5x)' }}>
        {STEPS.map((step, i) => (
          <li key={i} className="ts-400-m">
            {step}
          </li>
        ))}
      </ol>
    </Modal>,
    document.body,
  );
}
