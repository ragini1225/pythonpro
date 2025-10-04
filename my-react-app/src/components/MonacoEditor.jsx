import React, { useRef, useEffect } from 'react';

import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

const MonacoEditor = ({
  value,
  onChange,
  language = 'python',
  height = '400px',
  readOnly = false,
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure Python language features
    monaco.languages.setLanguageConfiguration('python', {
      indentationRules: {
        increaseIndentPattern: /^\s*(def|class|if|elif|else|for|while|with|try|except|finally|async def).*:\s*$/,
        decreaseIndentPattern: /^\s*(elif|else|except|finally)\b.*$/,
      },
    });

    // Set editor theme
    monaco.editor.defineTheme('pythonDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'class', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#10b981',
        'editor.selectionBackground': '#10b98130',
        'editor.inactiveSelectionBackground': '#10b98120',
        'editorCursor.foreground': '#10b981',
      },
    });

    monaco.editor.setTheme('pythonDark');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl"
    >
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          contextmenu: true,
          selectOnLineNumbers: true,
          glyphMargin: false,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: 'always',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          renderLineHighlight: 'gutter',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
          },
        }}
      />
    </motion.div>
  );
};
export default MonacoEditor;