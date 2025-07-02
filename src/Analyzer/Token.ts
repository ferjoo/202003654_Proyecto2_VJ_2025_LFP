// Enumeración que define todos los tipos de tokens que puede reconocer el analizador léxico
export enum Type {
    UNKNOW,         // Token no reconocido (error léxico)
    
    // Símbolos de agrupación
    KEY_O,          // Llave de apertura {
    KEY_C,          // Llave de cierre }
    BRA_O,          // Corchete de apertura [
    BRA_C,          // Corchete de cierre ]
    PAR_O,          // Paréntesis de apertura (
    PAR_C,          // Paréntesis de cierre )
    
    // Símbolos de puntuación
    SEMICOLON,      // Punto y coma ;
    COMMA,          // Coma ,
    PERIOD,         // Punto .
    
    // Operadores de asignación
    ASSIGN,         // Signo igual =
    
    // Operadores aritméticos
    PLUS,           // Signo más +
    MINUS,          // Signo menos -
    MULT,           // Signo de multiplicación *
    DIV,            // Signo de división /
    
    // Operadores de incremento/decremento
    INC,            // Incremento ++
    DEC,            // Decremento --
    
    // Operadores de comparación
    EQUAL,          // Igualdad ==
    DIFF,           // Diferencia !=
    LESS,           // Menor que <
    GREATER,        // Mayor que >
    LESS_EQ,        // Menor o igual <=
    GREATER_EQ,     // Mayor o igual >=
    
    // Identificadores y literales
    IDENTIFIER,     // Nombre de variable, función, clase, etc.
    INTEGER,        // Número entero (ej: 123)
    DECIMAL,        // Número decimal (ej: 3.14)
    
    // Comentarios
    COMMENT,        // Comentario de una línea //
    MULTICOMMENT,   // Comentario de múltiples líneas /* */
    
    // Cadenas y caracteres
    STRING,         // Cadena de texto entre comillas dobles "texto"
    CHAR,           // Carácter entre comillas simples 'a'
    
    // Palabras reservadas de C#
    R_USING,        // using
    R_SYSTEM,       // System
    R_PUBLIC,       // public
    R_CLASS,        // class
    R_STATIC,       // static
    R_VOID,         // void
    R_MAIN,         // Main
    R_STRING,       // string
    R_INT,          // int
    R_FLOAT,        // float
    R_CHAR,         // char
    R_BOOL,         // bool
    R_FALSE,        // false
    R_TRUE,         // true
    R_CONSOLE,      // Console
    R_WRITELINE,    // WriteLine
    R_IF,           // if
    R_ELSE,         // else
    R_FOR           // for
}

// Clase que representa un token encontrado por el analizador léxico
export class Token {

    private typeTokenString: string;  // Nombre del tipo de token (para mostrar en reportes)
    private typeToken: Type;          // Tipo de token (de la enumeración)
    private lexeme: string;           // Texto exacto que se encontró en el código
    private row: number;              // Fila donde aparece el token
    private column: number;           // Columna donde aparece el token

    constructor(typeToken: Type, lexeme: string, row: number, column: number) {
        this.typeTokenString = Type[typeToken];  // Convertir el tipo a string
        this.typeToken = typeToken;
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
    }

    // Método para obtener el tipo de token
    getType(): Type {
        return this.typeToken;
    }

    // Método para obtener el texto del token
    getLexeme(): string {
        return this.lexeme;
    }

    // Método para obtener la fila donde aparece el token
    getRow(): number {
        return this.row;
    }

    // Método para obtener la columna donde aparece el token
    getColumn(): number {
        return this.column;
    }

    // Método para obtener el nombre del tipo de token
    getTypeTokenString(): string {
        return this.typeTokenString;
    }
}