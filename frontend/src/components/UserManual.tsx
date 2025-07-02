import React from 'react';

const UserManual: React.FC = () => {
  return (
    <div className="manual-content">
      <h1>Manual de Usuario - Transpilador C# a TypeScript</h1>
      
      <section>
        <h2>1. Introducción</h2>
        <p>El <strong>Transpilador C# a TypeScript</strong> es una herramienta web que permite convertir código C# a TypeScript de forma automática. Esta aplicación es ideal para desarrolladores que necesitan migrar proyectos de C# a TypeScript o aprender las diferencias entre ambos lenguajes.</p>
        
        <div className="features-overview">
          <h3>Características Principales:</h3>
          <ul>
            <li>✅ <strong>Análisis Léxico:</strong> Identifica tokens y palabras reservadas</li>
            <li>✅ <strong>Análisis Sintáctico:</strong> Valida la estructura del código</li>
            <li>✅ <strong>Transpilación Automática:</strong> Convierte C# a TypeScript</li>
            <li>✅ <strong>Reporte de Errores:</strong> Muestra errores con ubicación exacta</li>
            <li>✅ <strong>Interfaz Moderna:</strong> Diseño responsive y fácil de usar</li>
            <li>✅ <strong>Tabla de Símbolos:</strong> Visualiza variables y sus propiedades</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>2. Primeros Pasos</h2>
        <h3>2.1 Acceso a la Aplicación</h3>
        <ol>
          <li>Abre tu navegador web</li>
          <li>Ve a <code>http://localhost:3001</code></li>
          <li>Verás la interfaz principal del transpilador</li>
        </ol>

        <h3>2.2 Interfaz Principal</h3>
        <div className="interface-overview">
          <h4>Elementos de la Interfaz:</h4>
          <ul>
            <li><strong>Barra de Navegación:</strong> Contiene botones para reportes y opciones de archivo</li>
            <li><strong>Editor de Código:</strong> Área principal para escribir código C#</li>
            <li><strong>Salida Traducida:</strong> Muestra el código TypeScript generado</li>
            <li><strong>Salida de Consola:</strong> Muestra los mensajes de Console.WriteLine()</li>
            <li><strong>Tabla de Símbolos:</strong> Lista todas las variables encontradas</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>3. Uso del Editor</h2>
        <h3>3.1 Escribir Código</h3>
        <p>El editor acepta código C# con la siguiente estructura básica:</p>
        
        <div className="code-example">
          <h4>Ejemplo de Código C# Válido:</h4>
          <pre>
{`using System;

public class Program
{
    static void Main(string[] args)
    {
        int x = 10;
        string mensaje = "Hola Mundo";
        Console.WriteLine(mensaje);
        
        if (x > 5)
        {
            Console.WriteLine("x es mayor que 5");
        }
    }
}`}
          </pre>
        </div>

        <h3>3.2 Elementos Soportados</h3>
        <div className="supported-elements">
          <h4>Palabras Reservadas:</h4>
          <ul>
            <li><code>using, System, public, class, static, void, Main</code></li>
            <li><code>string, int, float, char, bool</code></li>
            <li><code>false, true, Console, WriteLine</code></li>
            <li><code>if, else, for</code></li>
          </ul>

          <h4>Operadores:</h4>
          <ul>
            <li><strong>Aritméticos:</strong> <code>+, -, *, /</code></li>
            <li><strong>Asignación:</strong> <code>=</code></li>
            <li><strong>Relacionales:</strong> <code>==, !=, &lt;, &gt;, &lt;=, &gt;=</code></li>
            <li><strong>Incremento/Decremento:</strong> <code>++, --</code></li>
          </ul>

          <h4>Delimitadores:</h4>
          <ul>
            <li><code>{ }, [ ], ( ), ; , .</code></li>
          </ul>
        </div>
      </section>

      <section>
        <h2>4. Análisis de Código</h2>
        <h3>4.1 Proceso de Análisis</h3>
        <ol>
          <li><strong>Escribe tu código C#</strong> en el editor</li>
          <li><strong>Haz clic en "Analizar"</strong> para procesar el código</li>
          <li><strong>Revisa los resultados</strong> en las diferentes secciones</li>
        </ol>

        <h3>4.2 Interpretación de Resultados</h3>
        <div className="results-interpretation">
          <h4>Salida Traducida:</h4>
          <p>Muestra el código TypeScript equivalente generado automáticamente.</p>
          
          <h4>Salida de Consola:</h4>
          <p>Extrae y muestra todos los mensajes de <code>Console.WriteLine()</code> encontrados en el código.</p>
          
          <h4>Tabla de Símbolos:</h4>
          <p>Lista todas las variables declaradas con su tipo y ubicación en el código.</p>
        </div>

        <h3>4.3 Manejo de Errores</h3>
        <div className="error-handling">
          <h4>Tipos de Errores:</h4>
          <ul>
            <li><strong>Errores Léxicos:</strong> Caracteres no reconocidos o tokens inválidos</li>
            <li><strong>Errores Sintácticos:</strong> Estructura gramatical incorrecta</li>
          </ul>

          <h4>Información de Errores:</h4>
          <ul>
            <li><strong>Línea y Columna:</strong> Ubicación exacta del error</li>
            <li><strong>Descripción:</strong> Explicación del problema encontrado</li>
            <li><strong>Tipo:</strong> Clasificación del error</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>5. Funciones Avanzadas</h2>
        <h3>5.1 Reportes Detallados</h3>
        <div className="detailed-reports">
          <h4>Token Report:</h4>
          <p>Muestra todos los tokens encontrados en el análisis léxico, incluyendo:</p>
          <ul>
            <li>Tipo de token</li>
            <li>Lexema (texto del token)</li>
            <li>Línea y columna de ubicación</li>
          </ul>

          <h4>Error Report:</h4>
          <p>Lista detallada de todos los errores encontrados durante el análisis.</p>
        </div>

        <h3>5.2 Gestión de Archivos</h3>
        <div className="file-management">
          <h4>Opciones de Archivo:</h4>
          <ul>
            <li><strong>Limpiar Editor:</strong> Borra todo el contenido del editor</li>
            <li><strong>Cargar Archivo:</strong> Importa un archivo .cs desde tu computadora</li>
            <li><strong>Guardar Archivo:</strong> Descarga el código actual como archivo .cs</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>6. Ejemplos Prácticos</h2>
        <h3>6.1 Ejemplo 1: Variables y Operaciones</h3>
        <div className="example-section">
          <h4>Código C#:</h4>
          <pre>
{`using System;

public class Program
{
    static void Main(string[] args)
    {
        int a = 10;
        int b = 20;
        int resultado = a + b;
        Console.WriteLine("El resultado es: " + resultado);
    }
}`}
          </pre>
          
          <h4>Código TypeScript Generado:</h4>
          <pre>
{`let a: number = 10;
let b: number = 20;
let resultado: number = a + b;
console.log("El resultado es: " + resultado);`}
          </pre>
        </div>

        <h3>6.2 Ejemplo 2: Estructuras de Control</h3>
        <div className="example-section">
          <h4>Código C#:</h4>
          <pre>
{`using System;

public class Program
{
    static void Main(string[] args)
    {
        int edad = 18;
        
        if (edad >= 18)
        {
            Console.WriteLine("Eres mayor de edad");
        }
        else
        {
            Console.WriteLine("Eres menor de edad");
        }
        
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine("Iteración: " + i);
        }
    }
}`}
          </pre>
          
          <h4>Código TypeScript Generado:</h4>
          <pre>
{`let edad: number = 18;

if (edad >= 18) {
    console.log("Eres mayor de edad");
} else {
    console.log("Eres menor de edad");
}

for (let i: number = 0; i < 5; i++) {
    console.log("Iteración: " + i);
}`}
          </pre>
        </div>
      </section>

      <section>
        <h2>7. Solución de Problemas</h2>
        <h3>7.1 Errores Comunes</h3>
        <div className="common-errors">
          <h4>Error: "Token no reconocido"</h4>
          <p><strong>Causa:</strong> Carácter no válido en el código</p>
          <p><strong>Solución:</strong> Revisa que solo uses caracteres válidos de C#</p>

          <h4>Error: "Estructura sintáctica incorrecta"</h4>
          <p><strong>Causa:</strong> Falta de punto y coma, llaves o paréntesis</p>
          <p><strong>Solución:</strong> Verifica la sintaxis del código C#</p>

          <h4>Error: "Palabra reservada no reconocida"</h4>
          <p><strong>Causa:</strong> Uso de palabras no soportadas por el transpilador</p>
          <p><strong>Solución:</strong> Consulta la lista de palabras reservadas soportadas</p>
        </div>

        <h3>7.2 Limitaciones del Sistema</h3>
        <div className="system-limitations">
          <h4>Funcionalidades No Soportadas:</h4>
          <ul>
            <li>Métodos personalizados (solo Main)</li>
            <li>Clases múltiples en un archivo</li>
            <li>Namespaces complejos</li>
            <li>Herencia y polimorfismo</li>
            <li>Interfaces y enums</li>
            <li>Manejo de excepciones</li>
          </ul>

          <h4>Recomendaciones:</h4>
          <ul>
            <li>Mantén el código simple y directo</li>
            <li>Usa solo las estructuras básicas de C#</li>
            <li>Verifica la sintaxis antes de analizar</li>
            <li>Revisa los errores reportados para corregir problemas</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>8. Consejos de Uso</h2>
        <h3>8.1 Mejores Prácticas</h3>
        <div className="best-practices">
          <ul>
            <li><strong>Estructura Básica:</strong> Siempre incluye <code>using System;</code> y la estructura de clase</li>
            <li><strong>Nombres de Variables:</strong> Usa nombres descriptivos y sigue las convenciones de C#</li>
            <li><strong>Comentarios:</strong> Aunque no se transpilan, ayudan a entender el código</li>
            <li><strong>Formato:</strong> Mantén un formato consistente para mejor legibilidad</li>
          </ul>
        </div>

        <h3>8.2 Optimización del Flujo de Trabajo</h3>
        <div className="workflow-optimization">
          <ol>
            <li><strong>Escribe el código C#</strong> en el editor</li>
            <li><strong>Analiza inmediatamente</strong> para detectar errores temprano</li>
            <li><strong>Corrige errores</strong> basándote en los reportes</li>
            <li><strong>Revisa la transpilación</strong> para verificar la conversión</li>
            <li><strong>Guarda el archivo</strong> si estás satisfecho con el resultado</li>
          </ol>
        </div>

        <h3>8.3 Casos de Uso Recomendados</h3>
        <div className="use-cases">
          <h4>Ideal para:</h4>
          <ul>
            <li>Migración de código simple de C# a TypeScript</li>
            <li>Aprendizaje de diferencias entre C# y TypeScript</li>
            <li>Prototipado rápido de conversiones</li>
            <li>Verificación de sintaxis de código C# básico</li>
          </ul>

          <h4>No recomendado para:</h4>
          <ul>
            <li>Proyectos complejos con múltiples clases</li>
            <li>Código que usa características avanzadas de C#</li>
            <li>Migraciones de producción sin revisión manual</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>9. Soporte y Recursos</h2>
        <h3>9.1 Información Técnica</h3>
        <p>Para información técnica detallada sobre la implementación del transpilador, consulta el <strong>Manual Técnico</strong> disponible en la barra de navegación.</p>

        <h3>9.2 Recursos Adicionales</h3>
        <div className="additional-resources">
          <h4>Documentación de Referencia:</h4>
          <ul>
            <li><a href="https://docs.microsoft.com/es-es/dotnet/csharp/" target="_blank" rel="noopener noreferrer">Documentación oficial de C#</a></li>
            <li><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">Documentación oficial de TypeScript</a></li>
            <li><a href="https://developer.mozilla.org/es/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">Referencia de JavaScript</a></li>
          </ul>

          <h4>Herramientas Relacionadas:</h4>
          <ul>
            <li>Visual Studio Code para edición de código</li>
            <li>Compiladores online de C# y TypeScript</li>
            <li>Herramientas de migración de código</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default UserManual; 