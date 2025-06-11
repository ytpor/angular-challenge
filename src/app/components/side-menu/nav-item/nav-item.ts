export interface NavItem {
  level?: number;
  title?: string;
  icon?: string;
  route?: string;
  open?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}
