import React, { useEffect, useState } from 'react';
import './tooltip.css';

export interface TooltipProps {
  /** Элемент-триггер, при наведении или фокусе на который появляется подсказка */
  trigger: React.ReactNode;
  /** Содержимое подсказки */
  children: React.ReactNode;
  /** Положение подсказки относительно триггера
   * @default "right" */
  placement?: 'right' | 'left';
  /** Контролируемое состояние видимости. Если передан — компонент переходит в controlled mode */
  isOpen?: boolean;
  /** Начальное состояние для неконтролируемого режима
   * @default false */
  defaultOpen?: boolean;
  /** Колбэк при изменении видимости */
  onOpenChange?: (isOpen: boolean) => void;
  /** Дополнительный CSS-класс для обёртки
   * @default "" */
  className?: string;
}

/**
 * Всплывающая подсказка, появляющаяся при наведении или фокусе на элемент-триггер.
 * Применяется для отображения дополнительной информации.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  children,
  placement = 'right',
  isOpen,
  defaultOpen = false,
  onOpenChange,
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = isOpen !== undefined;
  const isTooltipOpen = isControlled ? isOpen : internalOpen;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    setInternalOpen(defaultOpen);
  }, [defaultOpen, isControlled]);

  const setOpen = (nextValue: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextValue);
    }

    onOpenChange?.(nextValue);
  };

  const rootClassName = ['tooltip-anchor', className].filter(Boolean).join(' ');
  const panelClassName = ['tooltip', `tooltip--${placement}`].join(' ');

  return (
    <div
      className={rootClassName}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <div className="tooltip-anchor__trigger hoverOpacity">{trigger}</div>
      {isTooltipOpen && (
        <div className={panelClassName} role="tooltip">
          <div className="tooltip__arrow" aria-hidden="true" />
          <div className="tooltip__content">
            {typeof children === 'string' ? (
              <p className="tooltip__paragraph">{children}</p>
            ) : (
              children
            )}
          </div>
        </div>
      )}
    </div>
  );
};
