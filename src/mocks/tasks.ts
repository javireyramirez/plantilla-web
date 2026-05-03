// src/mocks/tasks.ts

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'canceled';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskLabel = 'bug' | 'feature' | 'documentation';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  label: TaskLabel;
  priority: TaskPriority;
  createdAt: string;
}

export const tasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Implement authentication with Fastify',
    status: 'done',
    label: 'feature',
    priority: 'high',
    createdAt: '2024-04-20T10:00:00Z',
  },
  {
    id: 'TASK-002',
    title: 'Design the data table component',
    status: 'in-progress',
    label: 'feature',
    priority: 'medium',
    createdAt: '2024-04-21T12:30:00Z',
  },
  {
    id: 'TASK-003',
    title: 'Fix sidebar responsive issue',
    status: 'todo',
    label: 'bug',
    priority: 'low',
    createdAt: '2024-04-22T09:15:00Z',
  },
  {
    id: 'TASK-004',
    title: 'Write usage manual for the table',
    status: 'todo',
    label: 'documentation',
    priority: 'medium',
    createdAt: '2024-04-23T14:00:00Z',
  },
  {
    id: 'TASK-005',
    title: 'Add sorting to columns',
    status: 'done',
    label: 'feature',
    priority: 'high',
    createdAt: '2024-04-24T16:45:00Z',
  },
  {
    id: 'TASK-006',
    title: 'Implement faceted filters',
    status: 'in-progress',
    label: 'bug',
    priority: 'high',
    createdAt: '2024-04-25T11:20:00Z',
  },
  {
    id: 'TASK-007',
    title: 'Add pagination controls',
    status: 'todo',
    label: 'feature',
    priority: 'medium',
    createdAt: '2024-04-26T08:00:00Z',
  },
  {
    id: 'TASK-008',
    title: 'Setup deployment pipeline',
    status: 'canceled',
    label: 'feature',
    priority: 'low',
    createdAt: '2024-04-27T17:30:00Z',
  },
  {
    id: 'TASK-009',
    title: 'Optimize table rendering',
    status: 'todo',
    label: 'feature',
    priority: 'medium',
    createdAt: '2024-04-28T13:10:00Z',
  },
  {
    id: 'TASK-010',
    title: 'Review PR for data table',
    status: 'done',
    label: 'documentation',
    priority: 'low',
    createdAt: '2024-04-29T10:50:00Z',
  },
  {
    id: 'TASK-011',
    title: 'Review PR for data table',
    status: 'done',
    label: 'documentation',
    priority: 'low',
    createdAt: '2024-04-29T10:50:00Z',
  },
];
