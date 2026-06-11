import * as React from 'react';

export interface DataTableI18n {
  selector: {
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    refineMessage: string;
    applyLabel: string;
  };
  dateFilter: {
    selectDate: string;
    selectDateRange: string;
    clearSingle: string;
    clearRange: string;
    clearFilterAria: string;
    selectDateLabel: string;
    selectDateRangeLabel: string;
    apply: string;
  };
  toolbar: {
    resetFilters: string;
  };
  viewOptions: {
    toggleColumns: string;
    title: string;
    searchPlaceholder: string;
    emptyMessage: string;
  };
  facetedFilter: {
    clearFilterAria: string;
    selectedCount: (selected: number) => string;
    clearFilters: string;
    searchPlaceholder: string;
    emptyMessage: string;
  };
  pagination: {
    selectedRows: (selected: number, total: number) => string;
    rowsPerPage: string;
    page: (page: number, total: number) => string;
    firstPage: string;
    previousPage: string;
    nextPage: string;
    lastPage: string;
  };
  table: {
    selectAll: string;
    selectRow: string;
    noResults: string;
  };
  mobile: {
    noResults: string;
  };
}

export const defaultDataTableI18n: DataTableI18n = {
  selector: {
    placeholder: 'Seleccionar...',
    searchPlaceholder: 'Buscar...',
    emptyMessage: 'Sin resultados.',
    refineMessage: 'más resultados, refina tu búsqueda',
    applyLabel: 'Aplicar',
  },
  dateFilter: {
    selectDate: 'Seleccionar fecha',
    selectDateRange: 'Seleccionar rango de fechas',
    clearSingle: 'Limpiar fecha',
    clearRange: 'Limpiar rango',
    clearFilterAria: 'Limpiar filtro de fecha',
    selectDateLabel: 'Seleccionar fecha',
    selectDateRangeLabel: 'Seleccionar rango de fechas',
    apply: 'Aplicar',
  },
  toolbar: {
    resetFilters: 'Reiniciar filtros',
  },
  viewOptions: {
    toggleColumns: 'Toggle columns',
    title: 'View',
    searchPlaceholder: 'Search columns...',
    emptyMessage: 'No columns found.',
  },
  facetedFilter: {
    clearFilterAria: 'Clear filter',
    selectedCount: (selected) => `${selected} selected`,
    clearFilters: 'Clear filters',
    searchPlaceholder: 'Search...',
    emptyMessage: 'No results found.',
  },
  pagination: {
    selectedRows: (selected, total) => `${selected} of ${total} row(s) selected.`,
    rowsPerPage: 'Rows per page',
    page: (page, total) => `Page ${page} of ${total}`,
    firstPage: 'Go to first page',
    previousPage: 'Go to previous page',
    nextPage: 'Go to next page',
    lastPage: 'Go to last page',
  },
  table: {
    selectAll: 'Select all',
    selectRow: 'Select row',
    noResults: 'No results.',
  },
  mobile: {
    noResults: 'No results.',
  },
};

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
