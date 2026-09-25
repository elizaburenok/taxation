import React, { useEffect, useRef, useState } from 'react';
import './modal.css';

interface ModalProps {
  /** Открывает или скрывает окно */
  isOpen: boolean;
  /** Колбэк при закрытии (Escape или клик по оверлею) */
  onClose?: () => void;
  /** Шапка окна, обычно `ModalHeader` */
  header?: React.ReactNode;
  /** Подвал окна, обычно `ModalFooter` */
  footer?: React.ReactNode;
  /** Прокручиваемый контент окна */
  children?: React.ReactNode;
  /** Дополнительный CSS-класс
   * @default "" */
  className?: string;
  /** Разрешает закрытие по клику на оверлей
   * @default true */
  isOverlayCloseEnabled?: boolean;
}

const HIDE_DURATION_MS = 300;

/**
 * Всплывающее окно с затемнённым оверлеем, показывающееся поверх контента страницы.
 * Обычно используется для отображения дополнительной информации или интерактивных элементов.
 * Собирается из `ModalHeader`, зоны контента и `ModalFooter`.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
  className = '',
  isOverlayCloseEnabled = true,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [phase, setPhase] = useState<'hidden' | 'in' | 'out'>(isOpen ? 'in' : 'hidden');

  useEffect(() => {
    if (isOpen) {
      setPhase('in');
    } else if (phase === 'in') {
      setPhase('out');
      const timer = setTimeout(() => setPhase('hidden'), HIDE_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (phase !== 'in') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [phase, onClose]);

  useEffect(() => {
    if (phase !== 'in') {
      setIsHeaderCompact(false);
      return;
    }

    const node = contentRef.current;
    if (!node) return;

    const updateScrollState = () => setIsHeaderCompact(node.scrollTop > 0);
    updateScrollState();
    node.addEventListener('scroll', updateScrollState);
    return () => node.removeEventListener('scroll', updateScrollState);
  }, [phase, children]);

  if (phase === 'hidden') return null;

  const rootClassName = ['modal', className].filter(Boolean).join(' ');
  const headerClassName = [
    'modal__header',
    isHeaderCompact ? 'modal__header--compact' : '',
  ].filter(Boolean).join(' ');
  const panelClassName = [
    'modal__panel',
    phase === 'in' ? 'animate-popup-in' : 'animate-popup-out',
  ].join(' ');

  const overlayClassName = [
    'modal__overlay',
    phase === 'in' ? 'animate-overlay-in' : 'animate-overlay-out',
  ].join(' ');

  return (
    <div className={rootClassName}>
      <button
        type="button"
        className={overlayClassName}
        aria-label="Закрыть модальное окно"
        onClick={() => {
          if (isOverlayCloseEnabled) {
            onClose?.();
          }
        }}
      />
      <aside className={panelClassName} role="dialog" aria-modal="true">
        {header && <div className={headerClassName}>{header}</div>}
        <div ref={contentRef} className="modal__content">
          <div className="modal__content-inner">{children}</div>
        </div>
        {footer && <div className="modal__footer">{footer}</div>}
      </aside>
    </div>
  );
};
