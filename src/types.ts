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
    backgroundColor?: string;
    darkBackgroundColor?: string;
    overlayColor?: string;
    darkOverlayColor?: string;
    blur?: string;
    opacity?: number;
  };
}
