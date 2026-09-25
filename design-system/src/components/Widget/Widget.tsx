import React from 'react';
import { WidgetTitle, WidgetTitleProps } from '../WidgetTitle/WidgetTitle';
import './widget.css';

export interface WidgetProps extends Omit<WidgetTitleProps, 'className'> {
  /** Произвольный контент в теле виджета */
  children?: React.ReactNode;
  /** Дополнительный CSS-класс для корневого элемента
   * @default "" */
  className?: string;
  /** Дополнительный CSS-класс для контентной зоны
   * @default "" */
  contentClassName?: string;
  /** Минимальная высота контентной зоны
   * @default 146 */
  minContentHeight?: number | string;
}

/**
 * Блок-контейнер с кликабельным заголовком, правым аксессуаром и зоной для произвольного контента.
 * Используется для отображения важной информации с возможностью перехода в полный сервис по клику.
 * Включает встроенный `WidgetTitle` и принимает все его пропсы.
 */
export const Widget: React.FC<WidgetProps> = ({
  children,
  className = '',
  contentClassName = '',
  minContentHeight = 146,
  ...titleProps
}) => {
  const contentStyle = typeof minContentHeight === 'number'
    ? { minHeight: `${minContentHeight}px` }
    : { minHeight: minContentHeight };

  return (
    <section className={`widget ${className}`}>
      <WidgetTitle {...titleProps} />
      <div className={`widget__content ${contentClassName}`} style={contentStyle}>
        {children}
      </div>
    </section>
  );
};
