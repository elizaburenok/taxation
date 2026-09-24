import { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter } from '@ds';
import { DateField } from '../components/DateField';
import { REGISTRATION_DATE, parseDmy, formatHuman } from '../data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Текущее значение начала расчёта (dd.mm.yyyy). */
  value: string;
  /** Применить дату и перейти к редактированию систем. Логику решает родитель. */
  onSave: (date: string) => void;
}

const DATE_RE = /^\d{2}\.\d{2}\.\d{4}$/;

/**
 * Модалка «Начало расчёта» — дата начала работы с бухгалтерией Точки.
 * Нижняя граница — дата регистрации ИП (раньше бизнеса не было).
 * Макет: Figma node 55498-87986.
 */
export function CalcStartModal({ isOpen, onClose, value, onSave }: Props) {
  const [date, setDate] = useState(value);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDate(value);
      setShowError(false);
    }
  }, [isOpen, value]);

  const regDate = parseDmy(REGISTRATION_DATE)!;
  const parsed = parseDmy(date);
  const today = new Date();
  const valid = parsed != null && parsed >= regDate && parsed <= today;

  const errorMessage =
    parsed != null && parsed < regDate
      ? `Не раньше даты регистрации — ${REGISTRATION_DATE}`
      : parsed != null && parsed > today
        ? 'Дата не может быть в будущем'
        : 'Укажите дату в формате дд.мм.гггг';

  const handleSave = () => {
    if (!valid || !DATE_RE.test(date.trim())) {
      setShowError(true);
      return;
    }
    onSave(date.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<ModalHeader title="Начало расчёта" onClose={onClose} />}
      footer={<ModalFooter layout="1-button" primaryAction={{ label: 'Изменить', onClick: handleSave, isSelected: true }} />}
    >
      <div className="stack stack--4x">
        <p className="ts-400-m section-subtitle" style={{ margin: 0 }}>
          Дата начала работы с бухгалтерией Точки
        </p>
        <DateField
          label="Дата"
          placeholder="дд.мм.гггг"
          value={date}
          onChange={setDate}
          min={regDate}
          max={today}
          isError={showError && !valid}
          errorMessage={errorMessage}
          description={`Ваше ИП зарегистрировано ${formatHuman(REGISTRATION_DATE)}`}
          disabled
        />
      </div>
    </Modal>
  );
}
