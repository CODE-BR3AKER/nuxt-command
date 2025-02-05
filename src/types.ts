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
  theme?: "light" | "dark" | "system";
  shortcut?: string[];
  fuzzySearch?: boolean;
  showShortcuts?: boolean;
  closeOnSelect?: boolean;
  minimal?: boolean;
  transparency?: number;
  style?: {
    maxWidth?: string;
    minWidth?: string;
    backgroundColor?: string;
    darkBackgroundColor?: string;
    overlayColor?: string;
    darkOverlayColor?: string;
    blur?: string;
  };
}
