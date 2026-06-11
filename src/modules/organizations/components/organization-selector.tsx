import { Selector } from '@/components/selector/selector';

import { organizationsQueries } from '../model/organizations.query';

interface OrganizationOption {
  id: string;
  name: string;
}

interface BaseProps {
  disabled?: boolean;
  placeholder?: string;
  debounceMs?: number;
  excludeIds?: string[];
  className?: string;
  selectedOptions?: OrganizationOption[];
}

interface SingleProps extends BaseProps {
  multiple?: false;
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MultipleProps extends BaseProps {
  multiple: true;
  value?: string[];
  onChange: (value: string[]) => void;
}

type OrganizationSelectorProps = SingleProps | MultipleProps;

// ─── Component ────────────────────────────────────────────────────────────────

export function OrganizationSelector(props: OrganizationSelectorProps) {
  return <Selector {...props} useGetList={organizationsQueries.useGetList} />;
}
