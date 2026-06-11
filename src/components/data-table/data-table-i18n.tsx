import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableI18n {
  selector: {
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    refineMessage: string;
    applyLabel: string;
  };
}

// ─── Defaults  ───────────────────────────────────────────────────────

export const defaultDataTableI18n: DataTableI18n = {
  selector: {
    placeholder: 'Seleccionar...',
    searchPlaceholder: 'Buscar...',
    emptyMessage: 'Sin resultados.',
    refineMessage: 'más resultados, refina tu búsqueda',
    applyLabel: 'Aplicar',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const DataTableI18nContext = React.createContext<DataTableI18n>(defaultDataTableI18n);

export function DataTableI18nProvider({
  children,
  i18n,
}: {
  children: React.ReactNode;
  i18n: DataTableI18n;
}) {
  return <DataTableI18nContext.Provider value={i18n}>{children}</DataTableI18nContext.Provider>;
}

export function useDataTableI18n() {
  return React.useContext(DataTableI18nContext);
}
