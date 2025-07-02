import React, { useRef, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import CodeEditor from './components/CodeEditor';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import { useAnalysis } from './hooks/useAnalysis';
import SymbolTable from './components/SymbolTable';
import ConsoleOutput from './components/ConsoleOutput';
import Modal from './components/Modal';
import TechnicalManual from './components/TechnicalManual';
import UserManual from './components/UserManual';

// Componente principal de la aplicación
// Esta es la interfaz web donde el usuario puede escribir código C# y ver los resultados
function App() {
  // Hook personalizado que maneja el análisis del código (envía el código al backend)
  const { analysisResult, isLoading, error, analyze, clearResults } = useAnalysis();
  
  // Estados para controlar qué ventanas modales están abiertas
  const [showTokens, setShowTokens] = useState(false);        // Ventana de tokens
  const [showErrors, setShowErrors] = useState(false);        // Ventana de errores
  const [showTechnicalManual, setShowTechnicalManual] = useState(false); // Manual técnico
  const [showUserManual, setShowUserManual] = useState(false); // Manual de usuario
  
  // Estado para el contenido del editor de código
  const [editorValue, setEditorValue] = useState('');
  const editorRef = useRef(null);

  // Funciones para manejar archivos
  const handleClearEditor = () => setEditorValue(''); // Limpiar el editor
  
  // Función para cargar un archivo desde el computador
  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setEditorValue(evt.target?.result as string);
      reader.readAsText(file);
    }
  };
  
  // Función para guardar el código actual como archivo
  const handleSaveFile = () => {
    const blob = new Blob([editorValue], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'archivo.cs';
    a.click();
  };

  // Función que se ejecuta cuando el usuario presiona "Analizar"
  const handleAnalyze = () => analyze(editorValue);

  // Extraer información útil de los resultados del análisis
  let consoleOutput = '';
  let symbolTable: { variable: string; value: string; row: number; column: number }[] = [];
  
  if (analysisResult) {
    // Buscar todos los Console.WriteLine para mostrar qué se imprimiría
    const tokens = analysisResult.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i].type === 'R_CONSOLE' &&
        tokens[i + 1]?.type === 'PERIOD' &&
        tokens[i + 2]?.type === 'R_WRITELINE' &&
        tokens[i + 3]?.type === 'PAR_O' &&
        tokens[i + 4]?.type === 'STRING'
      ) {
        // Quitar las comillas del texto para mostrarlo
        const str = tokens[i + 4].lexeme.replace(/^"|"$/g, '');
        consoleOutput += str + '\n';
      }
    }
    
    // Construir tabla de símbolos con todos los identificadores encontrados
    symbolTable = tokens
      .filter(t => t.type === 'IDENTIFIER')
      .map(t => ({ variable: t.lexeme, value: '', row: t.row, column: t.column }));
  }

  return (
    <div className="App">
      {/* Barra de navegación con botones para diferentes funciones */}
      <Navbar
        onShowTokens={() => setShowTokens(true)}
        onShowErrors={() => setShowErrors(true)}
        onShowTechnicalManual={() => setShowTechnicalManual(true)}
        onShowUserManual={() => setShowUserManual(true)}
        onClearEditor={handleClearEditor}
        onLoadFile={handleLoadFile}
        onSaveFile={handleSaveFile}
      />
      
      {/* Contenido principal de la aplicación */}
      <main className="App-main">
        {/* Mostrar alerta si hay errores léxicos */}
        {analysisResult && analysisResult.errors && analysisResult.errors.length > 0 && (
          <div className="error-alert">
            Se encontraron {analysisResult.errors.length} errores léxicos en el código.
          </div>
        )}
        
        {/* Grid principal con 4 secciones */}
        <div className="main-2x2-grid">
          {/* Sección 1: Editor de código C# */}
          <section className="editor-section">
            <h2>Editor de Texto C#</h2>
            <CodeEditor
              value={editorValue}
              onChange={setEditorValue}
              isLoading={isLoading}
              onAnalyze={handleAnalyze}
              onFileUpload={setEditorValue}
            />
          </section>
          
          {/* Sección 2: Código traducido a TypeScript */}
          <section className="translated-section">
            <h2>Salida Traducida a TypeScript</h2>
            <textarea
              className="translated-output"
              value={analysisResult?.traduction || ''}
              readOnly
            />
          </section>
          
          {/* Sección 3: Salida de consola (qué se imprimiría) */}
          <section className="console-section">
            <h3>Salida de Consola</h3>
            <ConsoleOutput output={consoleOutput.trim()} />
          </section>
          
          {/* Sección 4: Tabla de símbolos (variables encontradas) */}
          <section className="symbol-table-section">
            <h3>Tabla de Símbolos</h3>
            <SymbolTable symbols={symbolTable} />
          </section>
        </div>
        
        {/* Mostrar errores si los hay */}
        <ErrorDisplay error={error} onClear={clearResults} />
        
        {/* Ventanas modales para mostrar información detallada */}
        <Modal show={showTokens} onClose={() => setShowTokens(false)} title="Token Report">
          <ResultsDisplay result={analysisResult} tab="tokens" />
        </Modal>
        <Modal show={showErrors} onClose={() => setShowErrors(false)} title="Error Report">
          <ResultsDisplay result={analysisResult} tab="errors" />
        </Modal>
        <Modal show={showTechnicalManual} onClose={() => setShowTechnicalManual(false)} title="Manual Técnico">
          <TechnicalManual />
        </Modal>
        <Modal show={showUserManual} onClose={() => setShowUserManual(false)} title="Manual de Usuario">
          <UserManual />
        </Modal>
      </main>
    </div>
  );
}

export default App;
