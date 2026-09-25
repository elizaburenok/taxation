import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Checkmark, Magnifier } from '../../assets/Icon/24/Stroked';
import { Spinner } from '../Spinner/Spinner';
import './dropdown-popup.css';

interface DropdownPopupProps {
  /** Управляет видимостью попапа */
  isOpen: boolean;
  /** Колбэк при закрытии (клик вне или Escape) */
  onClose: () => void;
  /** Ref на триггер — используется для позиционирования в десктопном режиме */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Заголовок, отображаемый в мобильном шите */
  label?: string;
  /** Текущее выбранное значение — отмечается галочкой */
  value?: string;
  /** Включает поле поиска
   * @default false */
  hasSearch?: boolean;
  /** Плейсхолдер поля поиска
   * @default "Поиск" */
  searchPlaceholder?: string;
  /** Колбэк при изменении поискового запроса */
  onSearchChange?: (q: string) => void;
  /** Показывает спиннер вместо списка
   * @default false */
  isLoading?: boolean;
  /** Показывает пустое состояние вместо списка
   * @default false */
  isEmpty?: boolean;
  /** Текст пустого состояния
   * @default "Ничего не найдено" */
  emptyText?: string;
  /** Список вариантов */
  children?: React.ReactNode;
}

type DesktopPosition = { top?: number; bottom?: number; left: number; width: number };

const ADAPTIVE_BREAKPOINT = 600;
const DESKTOP_MAX_HEIGHT = 280;
const DESKTOP_MIN_WIDTH = 320;

/**
 * Внутренний попап для `Dropdown` и `Chip` с вариантом `dropdown`.
 * На мобильных устройствах отображается как шит снизу, на десктопе — как позиционированная панель.
 * Рендерится через портал в `document.body`.
 */
export const DropdownPopup: React.FC<DropdownPopupProps> = ({
    isOpen,
    onClose,
    triggerRef,
    label,
    value,
    hasSearch = false,
    searchPlaceholder = 'Поиск',
    onSearchChange,
    isLoading = false,
    isEmpty = false,
    emptyText = 'Ничего не найдено',
    children,
}) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isAdaptive, setIsAdaptive] = useState(() => window.innerWidth < ADAPTIVE_BREAKPOINT);
    const [position, setPosition] = useState<DesktopPosition>({ left: 0, width: DESKTOP_MIN_WIDTH });

    useEffect(() => {
        const handleResize = () => setIsAdaptive(window.innerWidth < ADAPTIVE_BREAKPOINT);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (!isAdaptive && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const width = Math.max(rect.width, DESKTOP_MIN_WIDTH);
                const spaceBelow = window.innerHeight - rect.bottom;
                if (spaceBelow >= DESKTOP_MAX_HEIGHT) {
                    setPosition({ top: rect.bottom + 4, left: rect.left, width });
                } else {
                    setPosition({ bottom: window.innerHeight - rect.top + 4, left: rect.left, width });
                }
            }
            setIsExiting(false);
            setShouldRender(true);
        } else if (shouldRender) {
            setIsExiting(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsExiting(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isAdaptive]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!shouldRender) return null;

    const rootClass = [
        'dropdown-popup',
        isAdaptive ? 'dropdown-popup--adaptive' : '',
        isExiting ? 'dropdown-popup--exiting' : '',
    ].filter(Boolean).join(' ');

    const searchBar = hasSearch && (
        <div className="dropdown-popup__search-wrap">
            <div className="dropdown-popup__search">
                <span className="dropdown-popup__search-icon" aria-hidden="true">
                    <Magnifier />
                </span>
                <input
                    className="dropdown-popup__search-input"
                    type="text"
                    placeholder={searchPlaceholder}
                    onChange={e => onSearchChange?.(e.target.value)}
                />
            </div>
        </div>
    );

    const checkmarkIcon = (
        <span className="dropdown-popup__checkmark" aria-hidden="true">
            <Checkmark />
        </span>
    );

    const emptySlot = <span className="dropdown-popup__checkmark" aria-hidden="true" />;

    const enhancedChildren = React.Children.map(children, (child) => {
        if (!React.isValidElement<{ title?: React.ReactNode; hasRightAccessory?: boolean; rightAccessory?: React.ReactNode; verticalPadding?: string; titleClassName?: string; onClick?: () => void }>(child)) {
            return child;
        }
        const isSelected = value !== undefined && typeof child.props.title === 'string' && child.props.title === value;
        const originalOnClick = child.props.onClick;
        return React.cloneElement(child, {
            verticalPadding: 'none',
            titleClassName: 'ts-400-m',
            hasRightAccessory: true,
            rightAccessory: isSelected ? checkmarkIcon : emptySlot,
            onClick: originalOnClick ? () => { originalOnClick(); onClose(); } : onClose,
        });
    });

    const content = (
        <div className="dropdown-popup__content">
            {isLoading && (
                <div className="dropdown-popup__state">
                    <Spinner />
                </div>
            )}
            {!isLoading && isEmpty && (
                <div className="dropdown-popup__state">
                    <p className="dropdown-popup__empty-text">{emptyText}</p>
                </div>
            )}
            {!isLoading && !isEmpty && enhancedChildren}
        </div>
    );

    if (isAdaptive) {
        return ReactDOM.createPortal(
            <div className={rootClass}>
                <div className="dropdown-popup__overlay" onClick={onClose} />
                <div className="dropdown-popup__sheet">
                    <div className="dropdown-popup__grip-wrap">
                        <div className="dropdown-popup__grip" />
                    </div>
                    {label && (
                        <div className="dropdown-popup__sheet-title">
                            <p>{label}</p>
                        </div>
                    )}
                    {searchBar}
                    {content}
                </div>
            </div>,
            document.body
        );
    }

    return ReactDOM.createPortal(
        <div className={rootClass}>
            <div className="dropdown-popup__overlay" onClick={onClose} />
            <div
                className="dropdown-popup__panel"
                style={{
                    position: 'fixed',
                    width: position.width,
                    top: position.top,
                    bottom: position.bottom,
                    left: position.left,
                } as React.CSSProperties}
            >
                {searchBar}
                {content}
            </div>
        </div>,
        document.body
    );
};
