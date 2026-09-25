import React from 'react';
import './drawer-header-title.css';

interface DrawerHeaderTitleProps {
  /** Текст заголовка */
  children: React.ReactNode;
  /** Размер текста
   * @default "text-m" */
  variant?: 'text-m' | 'text-l';
  /** Дополнительный CSS-класс
   * @default "" */
  className?: string;
}

/**
 * Компонент заголовка для шапки `Drawer`.
 * Поддерживает два визуальных размера.
 */
export const DrawerHeaderTitle: React.FC<DrawerHeaderTitleProps> = ({
  children,
  variant = 'text-m',
  className = '',
}) => {
  const classNames = [
    'drawer-header-title',
    `drawer-header-title--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={classNames}>{children}</div>;
};
