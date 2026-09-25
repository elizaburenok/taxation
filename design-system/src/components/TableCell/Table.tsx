import React from 'react';
import './table.css';

export interface TableProps {
  children: React.ReactNode;
  /** Число колонок @default 1 */
  columns?: number;
  /** CSS grid-template-columns (переопределяет columns) */
  gridTemplateColumns?: string;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  columns = 1,
  gridTemplateColumns,
  className = '',
}) => {
  const style: React.CSSProperties = {
    gridTemplateColumns: gridTemplateColumns ?? `repeat(${columns}, 1fr)`,
  };

  return (
    <div
      className={['table', className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </div>
  );
};
