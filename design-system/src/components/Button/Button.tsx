import React from 'react';
import './button.css';

import { Spinner } from '../Spinner/Spinner';

interface ButtonProps {
  /** Текст или содержимое кнопки */
  children: React.ReactNode;
  /** Визуальный стиль кнопки
   * @default "primary" */
  variant?: 'primary' | 'secondary' | 'transparent' | 'white';
  /** Размер кнопки */
  size?: 'l' | 'm' | 's';
  /** Показывает спиннер и блокирует кнопку
   * @default false */
  isLoading?: boolean;
  /** Блокирует кнопку
   * @default false */
  isDisabled?: boolean;
  /** Колбэк по клику */
  onClick?: () => void;
  /** HTML-тип кнопки
   * @default "button" */
  type?: 'button' | 'submit' | 'reset';
  /** Дополнительный CSS-класс
   * @default "" */
  className?: string;
}

/**
 * Кнопка — основной интерактивный элемент для запуска действий.
 * Используется во всех сценариях, где пользователю нужно совершить действие:
 * отправить форму, подтвердить операцию, перейти к следующему шагу.
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    isDisabled = false,
    onClick,
    type = 'button',
    className = '',
}) => {
    const classNames = [
        'button',
        `button--${variant}`,
        isLoading ? 'is-loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            aria-label={isLoading ? 'Загрузка' : undefined}
        >
            <span className="button__label ts-500-l">{children}</span>
            {isLoading && <Spinner />}
        </button>
    );
};
