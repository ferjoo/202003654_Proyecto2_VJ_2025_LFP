import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  isLoading: boolean;
  onAnalyze: () => void;
  onFileUpload?: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, isLoading, onAnalyze }) => {
  return (
    <div className="code-editor">
      <textarea
        className="editor-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Escribe tu código C# aquí..."
        style={{
          width: '100%',
          height: '300px',
          border: '1.5px solid #888',
          borderRadius: '4px',
          resize: 'none',
          fontFamily: 'Fira Mono, monospace',
          fontSize: '1rem',
          padding: '0.7rem',
          boxSizing: 'border-box',
          background: '#f9f9f9',
        }}
        spellCheck={false}
      />
      <div className="editor-footer">
        <button
          type="button"
          className="analyze-btn"
          disabled={isLoading || !value.trim()}
          onClick={onAnalyze}
        >
          {isLoading ? 'Analizando...' : 'Analizar'}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor; 