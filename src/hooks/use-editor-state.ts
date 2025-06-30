import { useReducer, useCallback } from 'react';

export interface EditorState {
  content: string;
  stats: {
    words: number;
    characters: number;
    readingTime: number;
  };
  ui: {
    fontSize: number;
    focusMode: boolean;
    showPreview: boolean;
  };
  selection: {
    start: number;
    end: number;
  };
}

type EditorAction = 
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'UPDATE_STATS'; payload: EditorState['stats'] }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'TOGGLE_FOCUS_MODE' }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_SELECTION'; payload: { start: number; end: number } }
  | { type: 'RESET_UI' };

const initialState: EditorState = {
  content: '',
  stats: { words: 0, characters: 0, readingTime: 0 },
  ui: { fontSize: 18, focusMode: false, showPreview: false },
  selection: { start: 0, end: 0 }
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
      
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };
      
    case 'SET_FONT_SIZE':
      return {
        ...state,
        ui: { ...state.ui, fontSize: Math.max(14, Math.min(24, action.payload)) }
      };
      
    case 'TOGGLE_FOCUS_MODE':
      return {
        ...state,
        ui: { ...state.ui, focusMode: !state.ui.focusMode }
      };
      
    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        ui: { ...state.ui, showPreview: !state.ui.showPreview }
      };
      
    case 'SET_SELECTION':
      return { ...state, selection: action.payload };
      
    case 'RESET_UI':
      return { ...state, ui: initialState.ui };
      
    default:
      return state;
  }
}

export interface EditorStateHook {
  state: EditorState;
  actions: {
    setContent: (content: string) => void;
    updateStats: (stats: EditorState['stats']) => void;
    setFontSize: (size: number) => void;
    toggleFocusMode: () => void;
    togglePreview: () => void;
    setSelection: (selection: { start: number; end: number }) => void;
    resetUI: () => void;
  };
}

export function useEditorState(initialContent = ''): EditorStateHook {
  const [state, dispatch] = useReducer(editorReducer, {
    ...initialState,
    content: initialContent
  });
  
  const actions = {
    setContent: useCallback((content: string) => 
      dispatch({ type: 'SET_CONTENT', payload: content }), []),
    
    updateStats: useCallback((stats: EditorState['stats']) =>
      dispatch({ type: 'UPDATE_STATS', payload: stats }), []),
    
    setFontSize: useCallback((size: number) =>
      dispatch({ type: 'SET_FONT_SIZE', payload: size }), []),
    
    toggleFocusMode: useCallback(() =>
      dispatch({ type: 'TOGGLE_FOCUS_MODE' }), []),
    
    togglePreview: useCallback(() =>
      dispatch({ type: 'TOGGLE_PREVIEW' }), []),
    
    setSelection: useCallback((selection: { start: number; end: number }) =>
      dispatch({ type: 'SET_SELECTION', payload: selection }), []),
    
    resetUI: useCallback(() =>
      dispatch({ type: 'RESET_UI' }), [])
  };
  
  return { state, actions };
}