# Proyecto 2 - Analizador Léxico y Sintáctico para C#

## ¿Qué hace este proyecto?

Este proyecto es un **compilador** que convierte código C# a TypeScript. Es como un traductor que toma código escrito en C# y lo convierte a TypeScript para que pueda ejecutarse en un navegador web.

## ¿Cómo funciona?

### 1. **Frontend (Interfaz Web)**
- Es una página web donde puedes escribir código C#
- Tiene un editor de texto con colores para resaltar el código
- Muestra los resultados del análisis en tiempo real

### 2. **Backend (Servidor)**
- Recibe el código C# del frontend
- Lo analiza paso a paso
- Devuelve el código traducido a TypeScript

## Componentes principales

### 🔍 **Analizador Léxico (LexicalAnalyzer)**
- **¿Qué hace?** Lee el código carácter por carácter y lo convierte en "tokens" (palabras, números, símbolos)
- **Cómo funciona:** Usa un autómata finito determinístico (AFD) con 37 estados diferentes
- **Ejemplo:** `int x = 5;` se convierte en: `[int] [x] [=] [5] [;]`

### 📝 **Analizador Sintáctico (SyntacticAnalyzer)**
- **¿Qué hace?** Verifica que la estructura del código sea correcta
- **Cómo funciona:** Usa análisis predictivo con conjuntos First
- **Ejemplo:** Verifica que después de `if` venga `(` y luego una condición

### 🔄 **Transpilador (Transpiler)**
- **¿Qué hace?** Convierte el código C# a TypeScript
- **Cómo funciona:** Recorre los tokens y crea instrucciones equivalentes en TypeScript
- **Ejemplo:** `Console.WriteLine("Hola")` → `console.log("Hola")`

## Estructura del proyecto

```
proyecto/
├── frontend/                 # Interfaz web (React + TypeScript)
│   ├── src/
│   │   ├── components/       # Componentes de la interfaz
│   │   ├── hooks/           # Lógica personalizada
│   │   └── services/        # Comunicación con el backend
├── src/                     # Backend (Node.js + TypeScript)
│   ├── Analyzer/            # Analizadores léxico, sintáctico y transpilador
│   ├── controllers/         # Controladores del servidor
│   ├── models/              # Modelos de datos
│   └── routes/              # Rutas del servidor
└── test/                    # Archivos de prueba
```

## Características del lenguaje C# soportado

### ✅ **Tipos de datos**
- `int` → `number`
- `float` → `number`
- `string` → `string`
- `char` → `string`
- `bool` → `boolean`

### ✅ **Estructuras de control**
- `if` / `else`
- `for` (con inicialización, condición e incremento)

### ✅ **Operadores**
- Aritméticos: `+`, `-`, `*`, `/`
- Comparación: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Incremento/decremento: `++`, `--`

### ✅ **Entrada/Salida**
- `Console.WriteLine()` → `console.log()`

### ✅ **Comentarios**
- `//` comentarios de una línea
- `/* */` comentarios de múltiples líneas

## Cómo usar el proyecto

### 1. **Instalar dependencias**
```bash
npm run install:all
```

### 2. **Ejecutar el proyecto**
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### 3. **Usar la aplicación**
1. Abre http://localhost:3001 en tu navegador
2. Escribe código C# en el editor
3. Presiona "Analizar"
4. Ve los resultados en las diferentes secciones

## Ejemplo de uso

### Código C# de entrada:
```csharp
using System;

public class Program
{
    public static void Main(string[] args)
    {
        int x = 5;
        string mensaje = "Hola mundo";
        Console.WriteLine(mensaje);
        
        if (x > 3)
        {
            Console.WriteLine("x es mayor que 3");
        }
    }
}
```

### Código TypeScript de salida:
```typescript
let x: number = 5;
let mensaje: string = "Hola mundo";
console.log(mensaje);

if (x > 3) {
    console.log("x es mayor que 3");
}
```

## Funcionalidades de la interfaz

### 📊 **Secciones principales:**
1. **Editor de código C#** - Donde escribes tu código
2. **Código traducido** - Muestra el TypeScript generado
3. **Salida de consola** - Muestra qué se imprimiría
4. **Tabla de símbolos** - Lista todas las variables encontradas

### 🔍 **Reportes disponibles:**
- **Tokens** - Lista detallada de todos los elementos encontrados
- **Errores** - Errores léxicos y sintácticos encontrados
- **Manual técnico** - Documentación técnica del proyecto
- **Manual de usuario** - Guía de uso

### 💾 **Manejo de archivos:**
- Cargar archivos `.cs` desde tu computador
- Guardar el código actual como archivo
- Limpiar el editor

## Tecnologías utilizadas

### Backend:
- **Node.js** - Servidor web
- **Express** - Framework para APIs
- **TypeScript** - Lenguaje de programación
- **EJS** - Motor de plantillas

### Frontend:
- **React** - Biblioteca para interfaces
- **TypeScript** - Lenguaje de programación
- **CSS** - Estilos de la interfaz

## Autores

Este proyecto fue desarrollado como parte del curso de Lenguajes Formales y Programación.

## Licencia

Este proyecto es de uso educativo. 