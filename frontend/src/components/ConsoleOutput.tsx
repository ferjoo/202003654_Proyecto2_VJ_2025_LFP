import React from 'react';

interface ConsoleOutputProps {
  output: string;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ output }) => (
  <pre className="console-output">{output}</pre>
);

export default ConsoleOutput; 