export interface NavItem {
  level?: number;
  titleKey: string;
  icon?: string;
  route?: string;
  open?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}
