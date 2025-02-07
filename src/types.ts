export interface CommandMenuGroup {
  label?: string;
  items: CommandMenuItem[];
}

export interface CommandMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string[];
  handler?: () => void;
}

export interface CommandMenuOptions {
  placeholder?: string;
  shortcut?: string[];
  fuzzySearch?: boolean;
  showShortcuts?: boolean;
  closeOnSelect?: boolean;
  minimal?: boolean;
  style?: {
    maxWidth?: string;
    minWidth?: string;
    opacity?: number;
    colors?: {
      light?: {
        background?: string;
        text?: string;
        border?: string;
        overlay?: string;
        secondary?: string;
        hover?: string;
        active?: string;
        inactive?: string; // or ghost to be seen
      };
      dark?: {
        background?: string;
        text?: string;
        border?: string;
        overlay?: string;
        secondary?: string;
        hover?: string;
      };
    };
  };
}
