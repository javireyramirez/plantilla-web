// src/pages/DataTableExample.tsx
import { TasksTable } from '@/components/data-table/example/tasks-table';

export default function DataTableExample() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Data Table Example</h1>
        <p className="text-muted-foreground">
          A preview of the advanced data table with mock data and local state management.
        </p>
      </div>
      <TasksTable />
    </div>
  );
}
