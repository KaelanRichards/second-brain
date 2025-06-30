// Platform detection utilities

export const isMac = () => {
  if (typeof window === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
};

export const isWindows = () => {
  if (typeof window === 'undefined') return false;
  return /Win/.test(navigator.platform);
};

export const isLinux = () => {
  if (typeof window === 'undefined') return false;
  return /Linux/.test(navigator.platform);
};

// Get the appropriate modifier key symbol
export const getModKey = () => (isMac() ? '⌘' : 'Ctrl');

// Get the appropriate alt/option key symbol
export const getAltKey = () => (isMac() ? '⌥' : 'Alt');

// Format keyboard shortcuts for the current platform
export const formatShortcut = (shortcut: string) => {
  if (isMac()) {
    return shortcut.replace(/Ctrl/gi, '⌘').replace(/Alt/gi, '⌥').replace(/Shift/gi, '⇧');
  }
  return shortcut;
};
