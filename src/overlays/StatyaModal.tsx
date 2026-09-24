import { Modal, ModalHeader, ModalFooter } from '@ds';

const STEPS = [
  <>Зайдите <a href="https://www.nalog.gov.ru" target="_blank" rel="noreferrer" style={{ color: 'var(--primitive-brand)' }}>на сайт</a> налоговой</>,
  'Вверху страницы выберите регион, в котором вы зарегистрированы',
  'Прокрутите страницу до конца и найдите раздел с региональными законами, в которых указаны условия применения пониженных ставок',
  'Скачайте закон и найдите в нём пункт, на основании которого вы применяете пониженную ставку',
];

export function StatyaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<ModalHeader title="Где взять данные о статье" onClose={onClose} />}
      footer={<ModalFooter layout="1-button" primaryAction={{ label: 'Понятно', onClick: onClose }} />}
    >
      <ol className="stack stack--3x" style={{ margin: 0, paddingLeft: 'var(--spacing-5x)' }}>
        {STEPS.map((step, i) => (
          <li key={i} className="ts-400-m">
            {step}
          </li>
        ))}
      </ol>
    </Modal>
  );
}
