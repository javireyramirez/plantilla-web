import { ChevronDown, Download, MoreHorizontal, Save, Trash2 } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type ActionItem = {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  danger?: boolean;
};

interface EntityPageProps {
  title: string;
  tabs: TabItem[];
  primaryAction?: ActionItem;
  secondaryActions?: ActionItem[];
}

export function EntityPage({ title, tabs, primaryAction, secondaryActions = [] }: EntityPageProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);

  const currentTab = tabs.find((tab) => tab.value === activeTab) ?? tabs[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <h1 className="truncate text-xl font-semibold">{title}</h1>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-2">
          {secondaryActions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.onClick}
                className={action.danger ? 'border-destructive text-destructive' : ''}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            );
          })}

          {primaryAction && (
            <Button onClick={primaryAction.onClick}>
              {primaryAction.icon && <primaryAction.icon className="mr-2 h-4 w-4" />}
              {primaryAction.label}
            </Button>
          )}
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-2">
          {primaryAction && (
            <Button onClick={primaryAction.onClick}>
              {primaryAction.icon && <primaryAction.icon className="mr-2 h-4 w-4" />}
              {primaryAction.label}
            </Button>
          )}

          {secondaryActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {secondaryActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <DropdownMenuItem
                      key={action.label}
                      onClick={action.onClick}
                      className={action.danger ? 'text-destructive focus:text-destructive' : ''}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* DESKTOP */}
        <TabsList
          variant="line"
          className="hidden md:flex h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0"
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-0">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* MOBILE */}
        <div className="md:hidden border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 px-0 text-base font-medium">
                {currentTab?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              {tabs.map((tab) => (
                <DropdownMenuItem key={tab.value} onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* CONTENT */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="outline-none">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
