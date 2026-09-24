import { useEffect, useRef, useState } from 'react';
import { Input } from '@ds';
import { Calendar as CalendarIcon } from '@ds/icons';
import { Calendar } from './Calendar';

interface Props {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  isError?: boolean;
  errorMessage?: string;
  hasHelpIcon?: boolean;
  helpText?: React.ReactNode;
  /** Нижняя граница выбора в календаре (включительно). */
  min?: Date;
  /** Верхняя граница выбора в календаре (включительно). */
  max?: Date;
  /** Занятые диапазоны — дни внутри недоступны для выбора в календаре. */
  disabledRanges?: { start: Date; end: Date }[];
  disabled?: boolean;
}

/**
 * Поле даты: DS Input с маской дд.мм.гггг + всплывающий календарь по клику.
 * Временная обёртка прототипа — ждёт добавления DatePicker в дизайн-систему.
 */
export function DateField({
  label,
  placeholder,
  value,
  onChange,
  description,
  isError,
  errorMessage,
  hasHelpIcon,
  helpText,
  min,
  max,
  disabledRanges,
  disabled,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!anchorRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <div className="date-field" ref={anchorRef}>
      <div className="date-field__control" onClick={() => !disabled && setOpen(true)}>
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          description={description}
          isError={isError}
          errorMessage={errorMessage}
          hasHelpIcon={hasHelpIcon}
          helpText={helpText}
          isDisabled={disabled}
          right={
            <span className="date-field__icon ds-icon ds-icon--24" aria-hidden="true">
              <CalendarIcon />
            </span>
          }
        />
      </div>

      {isOpen && (
        <div className="date-field__popover">
          <Calendar
            value={value}
            min={min}
            max={max}
            disabledRanges={disabledRanges}
            onSelect={(v) => {
              onChange(v);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
