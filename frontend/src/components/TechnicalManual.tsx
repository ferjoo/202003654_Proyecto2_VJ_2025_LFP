import React from 'react';

const TechnicalManual: React.FC = () => {
  return (
    <div className="manual-content">
      <h1>Manual Técnico - Transpilador C# a TypeScript</h1>
      
      <section>
        <h2>1. Arquitectura del Sistema</h2>
        <h3>1.1 Estructura General</h3>
        <p>El proyecto implementa un compilador completo con frontend y backend separados:</p>
        <ul>
          <li><strong>Backend:</strong> Node.js + Express + TypeScript</li>
          <li><strong>Frontend:</strong> React 19 + TypeScript</li>
          <li><strong>Comunicación:</strong> API REST con CORS habilitado</li>
        </ul>

        <h3>1.2 Componentes Principales</h3>
        <div className="component-diagram">
          <h4>Backend (src/)</h4>
          <ul>
            <li><code>Analyzer/</code> - Análisis léxico, sintáctico y transpilación</li>
            <li><code>controllers/</code> - Controladores Express</li>
            <li><code>models/</code> - Modelos de datos y AST</li>
            <li><code>routes/</code> - Rutas de la API</li>
          </ul>
          
          <h4>Frontend (frontend/src/)</h4>
          <ul>
            <li><code>components/</code> - Componentes React</li>
            <li><code>hooks/</code> - Hooks personalizados</li>
            <li><code>services/</code> - Servicios de API</li>
            <li><code>types/</code> - Definiciones TypeScript</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>2. Análisis Léxico</h2>
        <h3>2.1 Implementación</h3>
        <p>El analizador léxico utiliza una <strong>máquina de estados finitos</strong> implementada en <code>LexicalAnalyzer.ts</code>:</p>
        
        <h4>Estados Principales:</h4>
        <ul>
          <li><strong>Estado 0:</strong> Estado inicial, identifica el tipo de token</li>
          <li><strong>Estados 1-31:</strong> Estados de aceptación para diferentes tokens</li>
          <li><strong>Estado 28:</strong> Identificadores y palabras reservadas</li>
          <li><strong>Estado 29:</strong> Números enteros y decimales</li>
          <li><strong>Estados 32-33:</strong> Cadenas de caracteres</li>
        </ul>

        <h4>Tipos de Tokens (45+ tipos):</h4>
        <div className="token-types">
          <div className="token-category">
            <h5>Palabras Reservadas:</h5>
            <code>using, System, public, class, static, void, Main, string, int, float, char, bool, false, true, Console, WriteLine, if, else, for</code>
          </div>
          <div className="token-category">
            <h5>Operadores:</h5>
            <code>+, -, *, /, =, ==, !=, &lt;, &gt;, &lt;=, &gt;=, ++, --</code>
          </div>
          <div className="token-category">
            <h5>Delimitadores:</h5>
            <code>{ }, [ ], ( ), ; , .</code>
          </div>
          <div className="token-category">
            <h5>Literales:</h5>
            <code>INTEGER, DECIMAL, STRING, CHAR, IDENTIFIER</code>
          </div>
        </div>
      </section>

      <section>
        <h2>3. Análisis Sintáctico</h2>
        <h3>3.1 Gramática BNF</h3>
        <p>Implementa análisis descendente recursivo basado en la gramática definida en <code>tx/grammar.txt</code>:</p>
        
        <div className="grammar-example">
          <h4>Producciones Principales:</h4>
          <pre>
{`<program> ::= <block_using> <class>
<block_using> ::= 'using' 'System' ';'
<class> ::= 'public' 'class' ID '{' <block_Main> '}'
<block_Main> ::= 'static' 'void' 'Main' '(' 'string' '[' ']' ID ')' '{' <lista_instrucciones> '}'
<instruction> ::= <declaracion> | <asignacion> | <imprimir> | <inst_if> | <inst_for>`}
          </pre>
        </div>

        <h3>3.2 Conjuntos First</h3>
        <p>Utiliza conjuntos First para análisis predictivo:</p>
        <ul>
          <li><code>INSTRUCTION:</code> [R_INT, R_FLOAT, R_BOOL, R_STRING, R_CHAR, IDENTIFIER, R_CONSOLE, R_IF, R_FOR]</li>
          <li><code>ARITHMETIC:</code> [PAR_O, IDENTIFIER, INTEGER, DECIMAL, STRING, CHAR, R_FALSE, R_TRUE]</li>
          <li><code>RELATIONAL:</code> [EQUAL, DIFF, LESS, LESS_EQ, GREATER, GREATER_EQ]</li>
        </ul>

        <h3>3.3 Manejo de Errores</h3>
        <p>El analizador sintáctico implementa:</p>
        <ul>
          <li><strong>Recuperación de errores:</strong> Continúa el análisis después de encontrar errores</li>
          <li><strong>Reporte detallado:</strong> Línea, columna y descripción del error</li>
          <li><strong>Conjuntos First:</strong> Para sugerencias de tokens esperados</li>
        </ul>
      </section>

      <section>
        <h2>4. Transpilación</h2>
        <h3>4.1 Arquitectura AST</h3>
        <p>Utiliza el patrón <strong>Visitor</strong> con una jerarquía de instrucciones:</p>
        
        <div className="ast-structure">
          <h4>Jerarquía de Instrucciones:</h4>
          <pre>
{`Instruction (interface)
├── Declaration
├── Assignation
├── Print
├── If
├── For
└── Expressions
    ├── Arithmetic
    ├── Relational
    ├── Identifier
    └── Primitive`}
          </pre>
        </div>

        <h3>4.2 Mapeo de Tipos</h3>
        <div className="type-mapping">
          <table>
            <thead>
              <tr><th>C#</th><th>TypeScript</th></tr>
            </thead>
            <tbody>
              <tr><td>int, float</td><td>number</td></tr>
              <tr><td>string, char</td><td>string</td></tr>
              <tr><td>bool</td><td>boolean</td></tr>
              <tr><td>Console.WriteLine()</td><td>console.log()</td></tr>
            </tbody>
          </table>
        </div>

        <h3>4.3 Generación de Código</h3>
        <p>Cada instrucción implementa el método <code>transpiler()</code> que genera código TypeScript equivalente:</p>
        <ul>
          <li><strong>Declaraciones:</strong> <code>int x = 10;</code> → <code>let x: number = 10;</code></li>
          <li><strong>Impresión:</strong> <code>Console.WriteLine(x);</code> → <code>console.log(x);</code></li>
          <li><strong>Condicionales:</strong> Mantiene la estructura if-else</li>
          <li><strong>Bucles:</strong> Convierte for de C# a for de TypeScript</li>
        </ul>
      </section>

      <section>
        <h2>5. API REST</h2>
        <h3>5.1 Endpoints</h3>
        <div className="api-endpoints">
          <h4>POST /analyze</h4>
          <p><strong>Propósito:</strong> Analizar código C# y generar tokens, errores y código transpilado</p>
          <p><strong>Content-Type:</strong> text/plain</p>
          <p><strong>Body:</strong> Código C# como texto plano</p>
          
          <h4>Respuesta:</h4>
          <pre>
{`{
  "tokens": Array<{
    type: string,
    lexeme: string,
    row: number,
    column: number
  }>,
  "errors": Array<{
    type: string,
    description: string,
    row: number,
    column: number
  }>,
  "syntacticErrors": Array<Error>,
  "traduction": string,
  "colors": string
}`}
          </pre>
        </div>

        <h3>5.2 Configuración CORS</h3>
        <p>Habilitado para comunicación entre frontend (puerto 3001) y backend (puerto 3000):</p>
        <pre>
{`app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));`}
        </pre>
      </section>

      <section>
        <h2>6. Frontend React</h2>
        <h3>6.1 Arquitectura de Componentes</h3>
        <div className="component-architecture">
          <h4>Jerarquía de Componentes:</h4>
          <pre>
{`App
├── Navbar
├── CodeEditor
├── ResultsDisplay (Modal)
├── ErrorDisplay
├── SymbolTable
├── ConsoleOutput
└── Modal`}
          </pre>
        </div>

        <h3>6.2 Gestión de Estado</h3>
        <p>Utiliza hooks personalizados para manejo de estado:</p>
        <ul>
          <li><code>useAnalysis:</code> Estado del análisis, loading, errores</li>
          <li><code>useState:</code> Estado local de componentes</li>
          <li><code>useRef:</code> Referencias a elementos DOM</li>
        </ul>

        <h3>6.3 Servicios de API</h3>
        <p>Comunicación con backend mediante Axios:</p>
        <ul>
          <li><strong>Base URL:</strong> http://localhost:3000</li>
          <li><strong>Content-Type:</strong> text/plain</li>
          <li><strong>Error Handling:</strong> Try-catch con mensajes descriptivos</li>
        </ul>
      </section>

      <section>
        <h2>7. Configuración y Despliegue</h2>
        <h3>7.1 Scripts de Desarrollo</h3>
        <div className="scripts">
          <h4>Backend:</h4>
          <ul>
            <li><code>npm run dev:</code> nodemon + ts-node</li>
            <li><code>npm run start:backend:</code> ts-node (producción)</li>
          </ul>
          
          <h4>Frontend:</h4>
          <ul>
            <li><code>npm run dev:frontend:</code> react-scripts start</li>
            <li><code>npm run build:frontend:</code> Build de producción</li>
          </ul>
        </div>

        <h3>7.2 Dependencias Principales</h3>
        <div className="dependencies">
          <h4>Backend:</h4>
          <ul>
            <li>express: ^4.18.2</li>
            <li>typescript: ^5.8.3</li>
            <li>cors: ^2.8.5</li>
            <li>nodemon: ^3.1.10</li>
          </ul>
          
          <h4>Frontend:</h4>
          <ul>
            <li>react: ^19.1.0</li>
            <li>typescript: ^4.9.5</li>
            <li>axios: ^1.10.0</li>
            <li>react-scripts: 5.0.1</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>8. Consideraciones Técnicas</h2>
        <h3>8.1 Limitaciones Actuales</h3>
        <ul>
          <li>Soporte limitado a un subconjunto de C#</li>
          <li>No maneja namespaces complejos</li>
          <li>Sin soporte para métodos personalizados</li>
          <li>Limitado a un solo archivo por análisis</li>
        </ul>

        <h3>8.2 Posibles Mejoras</h3>
        <ul>
          <li>Implementar análisis semántico</li>
          <li>Agregar optimizaciones de código</li>
          <li>Soporte para más estructuras de control</li>
          <li>Integración con sistemas de tipos más complejos</li>
          <li>Testing automatizado completo</li>
        </ul>

        <h3>8.3 Rendimiento</h3>
        <p>El sistema está optimizado para archivos pequeños y medianos:</p>
        <ul>
          <li><strong>Análisis léxico:</strong> O(n) donde n es el número de caracteres</li>
          <li><strong>Análisis sintáctico:</strong> O(n) para gramática LL(1)</li>
          <li><strong>Transpilación:</strong> O(n) donde n es el número de tokens</li>
        </ul>
      </section>
    </div>
  );
};

export default TechnicalManual; 