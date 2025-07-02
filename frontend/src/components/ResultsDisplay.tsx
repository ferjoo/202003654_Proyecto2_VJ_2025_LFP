import React, { useState } from 'react';
import type { AnalysisResponse, Token, Error as AnalysisError } from '../types';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  result: AnalysisResponse | null;
  tab?: 'tokens' | 'errors';
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, tab }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'errors' | 'syntactic' | 'transpiled'>('tokens');

  if (!result) {
    return null;
  }

  // If a tab prop is provided, only show that table
  if (tab === 'tokens') {
    return (
      <div>
        <h3>Tokens</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Lexema</th>
              <th>Fila</th>
              <th>Columna</th>
            </tr>
          </thead>
          <tbody>
            {result.tokens.map((token, idx) => (
              <tr key={idx}>
                <td>{token.type}</td>
                <td>{token.lexeme}</td>
                <td>{token.row}</td>
                <td>{token.column}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (tab === 'errors') {
    return (
      <div>
        <h3>Errores Léxicos</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Fila</th>
              <th>Columna</th>
            </tr>
          </thead>
          <tbody>
            {result.errors.map((err, idx) => (
              <tr key={idx}>
                <td>{err.type}</td>
                <td>{err.description}</td>
                <td>{err.row}</td>
                <td>{err.column}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default: show all tabs
  return (
    <div className="results-tabs">
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('tokens')} className={activeTab === 'tokens' ? 'active' : ''}>Tokens</button>
        <button onClick={() => setActiveTab('errors')} className={activeTab === 'errors' ? 'active' : ''}>Errores Léxicos</button>
        <button onClick={() => setActiveTab('syntactic')} className={activeTab === 'syntactic' ? 'active' : ''}>Errores Sintácticos</button>
        <button onClick={() => setActiveTab('transpiled')} className={activeTab === 'transpiled' ? 'active' : ''}>Transpiled Code</button>
      </div>
      <div className="tab-content">
        {activeTab === 'tokens' && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Lexema</th>
                <th>Fila</th>
                <th>Columna</th>
              </tr>
            </thead>
            <tbody>
              {result.tokens.map((token, idx) => (
                <tr key={idx}>
                  <td>{token.type}</td>
                  <td>{token.lexeme}</td>
                  <td>{token.row}</td>
                  <td>{token.column}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'errors' && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fila</th>
                <th>Columna</th>
              </tr>
            </thead>
            <tbody>
              {result.errors.map((err, idx) => (
                <tr key={idx}>
                  <td>{err.type}</td>
                  <td>{err.description}</td>
                  <td>{err.row}</td>
                  <td>{err.column}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'syntactic' && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fila</th>
                <th>Columna</th>
              </tr>
            </thead>
            <tbody>
              {result.syntacticErrors.map((err, idx) => (
                <tr key={idx}>
                  <td>{err.type}</td>
                  <td>{err.description}</td>
                  <td>{err.row}</td>
                  <td>{err.column}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'transpiled' && (
          <div className="transpiled-section">
            <h4>Transpiled Code</h4>
            {result.traduction ? (
              <pre className="transpiled-code">{result.traduction}</pre>
            ) : (
              <div className="no-transpiled">No transpiled code available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay; 