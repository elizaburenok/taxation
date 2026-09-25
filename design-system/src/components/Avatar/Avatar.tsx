import React from 'react';
import './avatar.css';

interface AvatarProps {
  /** Текст внутри аватара (инициалы). Отображается если не передан `imageUrl` и `icon` */
  label?: string;
  /** URL изображения. При наличии имеет наивысший приоритет отображения */
  imageUrl?: string;
  /** Иконка внутри аватара. Отображается если не передан `imageUrl` */
  icon?: React.ReactNode;
  /** Размер аватара
   * @default "m" */
  size?: '2xl' | 'xl' | 'l' | 'm' | 's' | 'xs' | '2xs' | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 120;
  /** Форма аватара
   * @default "superellipse" */
  shape?: 'circle' | 'superellipse' | 'square';
  /** Дополнительный CSS-класс
   * @default "" */
  className?: string;
  /** Инлайн-стили */
  style?: React.CSSProperties;
}

/**
 * Аватар — контейнер с изображением, иконкой или текстом.
 * Обычно показывает логотип компании, фотографию человека, инициалы, обложку проекта или сервиса.
 * Используется в списках, шапках, ячейках и аксессуарах.
 */
export const Avatar: React.FC<AvatarProps> = ({
    label,
    imageUrl,
    icon,
    size = 'm',
    shape = 'superellipse',
    className = '',
    style,
}) => {
    const sizeClass = `avatar--${size}`;

    const classNames = [
        'avatar',
        sizeClass,
        `avatar--${shape}`,
        imageUrl && 'avatar--image',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} style={style}>
            {imageUrl ? (
                <img src={imageUrl} alt={label || 'Avatar'} className="avatar__image" />
            ) : icon ? (
                <span className="ds-icon avatar__icon">{icon}</span>
            ) : (
                <span className="avatar__label">{label}</span>
            )}
        </div>
    );
};
