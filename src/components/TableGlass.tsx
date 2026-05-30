import { ReactNode } from 'react';

export function TableGlass({ children }: { children: ReactNode }) {
  return (
    <div className="table-responsive table-responsive--glass">
      <table className="table table-sm table-glass">{children}</table>
    </div>
  );
}
