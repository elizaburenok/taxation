import React from 'react';
import './cell.css';
import { Avatar } from '../Avatar/Avatar';
import { ChevronRight } from '../../assets/Icon/icons';

interface CellProps {
  /** Заголовок ячейки */
  title: React.ReactNode;
  /** Подзаголовок над заголовком */
  subtitle?: React.ReactNode;
  /** Описание под заголовком */
  description?: React.ReactNode;
  /** Элемент слева. По умолчанию — `Avatar` */
  leftAccessory?: React.ReactNode;
  /** Элемент справа. По умолчанию — иконка `ChevronRight` */
  rightAccessory?: React.ReactNode;
  /** Показывает левый аксессуар
   * @default true */
  hasLeftAccessory?: boolean;
  /** Показывает правый аксессуар
   * @default true */
  hasRightAccessory?: boolean;
  /** Верхний и нижний паддинг ячейки
   * @default "none" */
  verticalPadding?: 'none' | '2x' | '3x' | '4x';
  /** CSS-класс заголовка. Принимает классы типографики DS: `ts-500-m`, `ts-400-s` и т.д.
   * @default "ts-500-m" */
  titleClassName?: string;
  /** CSS-класс подзаголовка
   * @default "ts-400-s" */
  subtitleClassName?: string;
  /** CSS-класс описания
   * @default "ts-400-s" */
  descriptionClassName?: string;
  /** Цвет заголовка
   * @default "var(--primitive-primary)" */
  titleColor?: string;
  /** Цвет подзаголовка
   * @default "var(--primitive-secondary)" */
  subtitleColor?: string;
  /** Цвет описания
   * @default "var(--primitive-secondary)" */
  descriptionColor?: string;
  /** Дополнительный CSS-класс корневого элемента
   * @default "" */
  className?: string;
  /** Колбэк по клику. При наличии ячейка становится интерактивной */
  onClick?: () => void;
}

/**
 * Универсальная строка списка с заголовком, опциональным описанием, левым и правым аксессуарами.
 * Используется для отображения данных, настроек, навигации и любых структурированных списков.
 *
 * Для стандартных паттернов рекомендуется использовать `CellLeftAccessory` и `CellRightAccessory`.
 */
export const Cell: React.FC<CellProps> = ({
  title,
  subtitle,
  description,
  leftAccessory,
  rightAccessory,
  hasLeftAccessory = true,
  hasRightAccessory = true,
  verticalPadding = 'none',
  titleClassName = 'ts-500-m',
  subtitleClassName = 'ts-400-s',
  descriptionClassName = 'ts-400-s',
  titleColor = 'var(--primitive-primary)',
  subtitleColor = 'var(--primitive-secondary)',
  descriptionColor = 'var(--primitive-secondary)',
  className = '',
  onClick,
}) => {
  const defaultLeftAccessory = (
    <Avatar
      size="m"
      shape="circle"
      label="AA"
      style={{
        '--avatar-surface': 'var(--bg-neutral-2)',
        '--avatar-color': 'var(--primitive-secondary)',
      } as React.CSSProperties}
    />
  );

  const defaultRightAccessory = (
    <span className="ds-cell__default-icon" aria-hidden="true">
      <ChevronRight />
    </span>
  );

  return (
    <div
      className={['ds-cell', verticalPadding !== 'none' ? `ds-cell--padding-${verticalPadding}` : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {hasLeftAccessory && (
        <div className="ds-cell__left-accessory">
          {leftAccessory || defaultLeftAccessory}
        </div>
      )}

      <div className="ds-cell__content">
        {subtitle && (
          <div className={`ds-cell__subtitle ${subtitleClassName}`} style={{ color: subtitleColor }}>
            {subtitle}
          </div>
        )}
        <div className={`ds-cell__title ${titleClassName}`} style={{ color: titleColor }}>
          {title}
        </div>
        {description && (
          <div className={`ds-cell__description ${descriptionClassName}`} style={{ color: descriptionColor }}>
            {description}
          </div>
        )}
      </div>

      {hasRightAccessory && (
        <div className="ds-cell__right-accessory">
          {rightAccessory || defaultRightAccessory}
        </div>
      )}
    </div>
  );
};
