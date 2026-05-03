// src/components/data-table/data-table-floating-bar.tsx
import { Download, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';

export interface DataTableFloatingBarProps<TData> {
  table: Table<TData>;
}

export function DataTableFloatingBar<TData>({ table }: DataTableFloatingBarProps<TData>) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onClearSelection = React.useCallback(() => {
    table.toggleAllRowsSelected(false);
  }, [table]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClearSelection]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg">
        <div className="flex items-center gap-2 px-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
            {rows.length}
          </span>
          <span className="text-muted-foreground text-sm">Selected</span>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => toast.error(`${rows.length} tareas eliminadas`)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => toast.success(`Descargando ${rows.length} tareas...`)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-2 px-1">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onClearSelection}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Kbd className="text-[10px] uppercase">Esc</Kbd>
        </div>
      </div>
    </div>
  );
}
