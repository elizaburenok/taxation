import React from 'react';
import { QuestionCircle } from '../../assets/Icon/icons';
import { Tooltip } from '../Tooltip/Tooltip';
import './input.css';

interface InputProps {
  /** Подпись над полем */
  label?: string;
  /** Вспомогательный текст под полем */
  description?: string;
  /** Текст ошибки (заменяет `description` при `isError=true`) */
  errorMessage?: string;
  /** Текст-заглушка при пустом поле */
  placeholder?: string;
  /** Управляемое значение. Если передан — компонент переходит в controlled mode */
  value?: string;
  /** Колбэк при изменении значения */
  onChange?: (value: string) => void;
  /** Блокирует поле
   * @default false */
  isDisabled?: boolean;
  /** Переводит поле в состояние ошибки
   * @default false */
  isError?: boolean;
  /** Произвольный элемент слева от поля ввода */
  left?: React.ReactNode;
  /** Произвольный элемент справа от поля ввода */
  right?: React.ReactNode;
  /** Показывает иконку-подсказку рядом с подписью
   * @default false */
  hasHelpIcon?: boolean;
  /** Текст тултипа при наведении на иконку-подсказку */
  helpText?: React.ReactNode;
}

/**
 * Текстовое поле ввода с поддержкой подписи, подсказки, сообщения об ошибке и боковых аксессуаров.
 */
export const Input: React.FC<InputProps> = ({
    label,
    description,
    errorMessage,
    placeholder,
    value,
    onChange,
    isDisabled = false,
    isError = false,
    left,
    right,
    hasHelpIcon = false,
    helpText,
}) => {
    const metaText = isError ? errorMessage ?? description : description;

    const classNames = [
        'input',
        isDisabled ? 'input--disabled' : '',
        isError ? 'input--error' : '',
    ].filter(Boolean).join(' ');

    return (
        <label className={classNames}>
            <div className="input__content">
                {left && <div className="input__accessory">{left}</div>}
                <div className="input__main">
                    {label && (
                        <div className="input__header">
                            <p className="input__title">{label}</p>
                            {hasHelpIcon && (helpText
                                ? <Tooltip trigger={
                                    <span className="input__help ds-icon" aria-hidden="true">
                                        <QuestionCircle />
                                    </span>
                                  }>{helpText}</Tooltip>
                                : <span className="input__help ds-icon hoverOpacity" aria-hidden="true">
                                    <QuestionCircle />
                                  </span>
                            )}
                        </div>
                    )}
                    <input
                        className="input__field"
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={isDisabled}
                    />
                </div>
                {right && <div className="input__accessory">{right}</div>}
            </div>
            {metaText && (
                <div className="input__meta">
                    <div className="input__divider"></div>
                    <p className="input__description">{metaText}</p>
                </div>
            )}
        </label>
    );
};
