import React, { useRef } from 'react';
import './Navbar.css';

interface NavbarProps {
  onShowTokens: () => void;
  onShowErrors: () => void;
  onShowTechnicalManual: () => void;
  onShowUserManual: () => void;
  onClearEditor: () => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveFile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onShowTokens,
  onShowErrors,
  onShowTechnicalManual,
  onShowUserManual,
  onClearEditor,
  onLoadFile,
  onSaveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Transpilador USAC</div>
      <div className="navbar-links">
        <button className="nav-btn" onClick={onShowTokens}>Token Report</button>
        <button className="nav-btn" onClick={onShowErrors}>Error Report</button>
        <div className="dropdown">
          <button className="nav-btn dropdown-toggle">Archivo ▼</button>
          <div className="dropdown-menu">
            <button onClick={onClearEditor}>Limpiar Editor</button>
            <button onClick={() => fileInputRef.current?.click()}>Cargar Archivo</button>
            <input
              type="file"
              accept=".cs"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={onLoadFile}
            />
            <button onClick={onSaveFile}>Guardar Archivo</button>
          </div>
        </div>
        <button className="nav-btn" onClick={onShowTechnicalManual}>Manual Técnico</button>
        <button className="nav-btn" onClick={onShowUserManual}>Manual de Usuario</button>
      </div>
    </nav>
  );
};

export default Navbar; 