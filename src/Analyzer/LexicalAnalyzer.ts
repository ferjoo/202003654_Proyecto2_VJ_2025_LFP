import { Token, Type } from "./Token";

// Tipo para definir las palabras reservadas del lenguaje C#
type ReserverWords = {
    lexeme: string;    // La palabra tal como aparece en el código
    token: Type;       // El tipo de token que representa
}

export class LexicalAnalyzer {

    // Variables del autómata finito determinístico (AFD)
    private state: number;           // Estado actual del autómata (0, 1, 2, etc.)
    private auxChar: string;         // Caracteres que se van acumulando para formar un token
    private row: number;             // Fila actual en el código (para reportar errores)
    private column: number;          // Columna actual en el código (para reportar errores)
    private tokenList: Token[];      // Lista de tokens encontrados
    private errorList: Token[];      // Lista de errores léxicos encontrados
    private colors: string;          // Código con etiquetas HTML para colorear en el editor
    private reservedWords: ReserverWords[];  // Palabras reservadas de C#

    constructor() {
        // Inicializar el autómata en el estado 0 (estado inicial)
        this.state = 0;
        this.column = 1;
        this.row = 1;
        this.auxChar = '';
        this.tokenList = [];
        this.errorList = [];
        
        // Definir todas las palabras reservadas de C# que reconoce el analizador
        this.reservedWords = [
            { lexeme: 'using',      token: Type.R_USING       },  // Para importar librerías
            { lexeme: 'System',     token: Type.R_SYSTEM      },  // Librería principal de C#
            { lexeme: 'public',     token: Type.R_PUBLIC      },  // Modificador de acceso
            { lexeme: 'class',      token: Type.R_CLASS       },  // Para definir clases
            { lexeme: 'static',     token: Type.R_STATIC      },  // Para métodos estáticos
            { lexeme: 'void',       token: Type.R_VOID        },  // Tipo de retorno vacío
            { lexeme: 'Main',       token: Type.R_MAIN        },  // Método principal
            { lexeme: 'string',     token: Type.R_STRING      },  // Tipo de dato texto
            { lexeme: 'int',        token: Type.R_INT         },  // Tipo de dato entero
            { lexeme: 'float',      token: Type.R_FLOAT       },  // Tipo de dato decimal
            { lexeme: 'char',       token: Type.R_CHAR        },  // Tipo de dato carácter
            { lexeme: 'bool',       token: Type.R_BOOL        },  // Tipo de dato booleano
            { lexeme: 'false',      token: Type.R_FALSE       },  // Valor booleano falso
            { lexeme: 'true',       token: Type.R_TRUE        },  // Valor booleano verdadero
            { lexeme: 'Console',    token: Type.R_CONSOLE     },  // Clase para entrada/salida
            { lexeme: 'WriteLine',  token: Type.R_WRITELINE   },  // Método para imprimir
            { lexeme: 'if',         token: Type.R_IF          },  // Estructura condicional
            { lexeme: 'else',       token: Type.R_ELSE        },  // Alternativa del if
            { lexeme: 'for',        token: Type.R_FOR         }   // Estructura de repetición
        ];
        this.colors = '';
    }

    // Función principal del analizador léxico - convierte texto en tokens
    scanner(input: string): Token[] {

        // Agregar un carácter especial al final para saber cuándo terminar
        input += '#';

        let char: string;

        // Recorrer el código carácter por carácter
        for (let i = 0; i < input.length; i++) {
            char = input[i];
            
            // Máquina de estados (autómata finito determinístico)
            switch(this.state) {
                case 0:  // Estado inicial - esperando cualquier carácter
                    switch(char) {
                        case '{':  // Llave de apertura
                            this.addChar(char);
                            this.state = 1;  // Ir al estado 1
                            break;
                        case '}':  // Llave de cierre
                            this.addChar(char);
                            this.state = 2;
                            break;
                        case '[':  // Corchete de apertura
                            this.addChar(char);
                            this.state = 3;
                            break;
                        case ']':  // Corchete de cierre
                            this.addChar(char);
                            this.state = 4;
                            break;
                        case '(':  // Paréntesis de apertura
                            this.addChar(char);
                            this.state = 5;
                            break;
                        case ')':  // Paréntesis de cierre
                            this.addChar(char);
                            this.state = 6;
                            break;
                        case ';':  // Punto y coma
                            this.addChar(char);
                            this.state = 7;
                            break;
                        case ',':  // Coma
                            this.addChar(char);
                            this.state = 8;
                            break;
                        case '.':  // Punto
                            this.addChar(char);
                            this.state = 9;
                            break;
                        case '=':  // Signo igual (puede ser = o ==)
                            this.addChar(char);
                            this.state = 10;
                            break;
                        case '+':  // Signo más (puede ser + o ++)
                            this.addChar(char);
                            this.state = 12;
                            break;
                        case '-':  // Signo menos (puede ser - o --)
                            this.addChar(char);
                            this.state = 14;
                            break;
                        case '*':  // Signo de multiplicación
                            this.addChar(char);
                            this.state = 16;
                            break;
                        case '!':  // Signo de exclamación (puede ser ! o !=)
                            this.addChar(char);
                            this.state = 17;
                            break;
                        case '<':  // Signo menor (puede ser < o <=)
                            this.addChar(char);
                            this.state = 19;
                            break;
                        case '>':  // Signo mayor (puede ser > o >=)
                            this.addChar(char);
                            this.state = 21;
                            break;
                        case '/':  // Signo de división (puede ser /, // o /*)
                            this.addChar(char);
                            this.state = 23;
                            break;
                        case '"':  // Comilla doble (inicio de cadena)
                            this.addChar(char);
                            this.state = 32;
                            break;
                        case "'":  // Comilla simple (inicio de carácter)
                            this.addChar(char);
                            this.state = 34;
                            break;
                        case ' ':  // Espacio en blanco - ignorar
                            this.column++;
                            this.colors += `${char}`;
                            break;
                        case '\n':  // Salto de línea
                        case '\r':
                            this.row++;
                            this.column = 1;
                            this.colors += `${char}`;
                            break;
                        case '\t':  // Tabulación
                            this.column += 4;
                            this.colors += `${char}`;
                            break;
                        default:
                            // Verificar si es una letra (inicio de identificador o palabra reservada)
                            if (/[a-zA-Z]/.test(char)) {
                                this.addChar(char);
                                this.state = 28;  // Ir al estado para identificadores
                                continue;
                            }

                            // Verificar si es un número (inicio de número entero)
                            if (/[0-9]/.test(char)) {
                                this.addChar(char);
                                this.state = 29;  // Ir al estado para números
                                continue;
                            }

                            // Si es el carácter final, terminar
                            if (char == '#' && i == input.length - 1) {
                                console.log("El análisis léxico ha terminado");
                            } else {
                                // Carácter no reconocido - es un error léxico
                                this.addError(char, this.row, this.column);
                                this.column++;
                            }

                            break;
                    }
                    break;
                case 1:  // Estado de aceptación para llave de apertura {
                    // Crear token de llave de apertura
                    this.addToken(Type.KEY_O, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();  // Limpiar y volver al estado inicial
                    i--;  // Retroceder para procesar el siguiente carácter
                    break;
                case 2:  // Estado de aceptación para llave de cierre }
                    this.addToken(Type.KEY_C, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 3:  // Estado de aceptación para corchete de apertura [
                    this.addToken(Type.BRA_O, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 4:  // Estado de aceptación para corchete de cierre ]
                    this.addToken(Type.BRA_C, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 5:  // Estado de aceptación para paréntesis de apertura (
                    this.addToken(Type.PAR_O, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 6:  // Estado de aceptación para paréntesis de cierre )
                    this.addToken(Type.PAR_C, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 7:  // Estado de aceptación para punto y coma ;
                    this.addToken(Type.SEMICOLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 8:  // Estado de aceptación para coma ,
                    this.addToken(Type.COMMA, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 9:  // Estado de aceptación para punto .
                    this.addToken(Type.PERIOD, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 10:  // Estado para signo igual = (puede ser = o ==)
                    if (char == '=') {  // Si viene otro =, es == (igualdad)
                        this.addChar(char);
                        this.state = 11;
                        continue;
                    }

                    // Si no, es solo = (asignación)
                    this.addToken(Type.ASSIGN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 11:  // Estado de aceptación para == (igualdad)
                    this.addToken(Type.EQUAL, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 12:  // Estado para signo más + (puede ser + o ++)
                    if (char == '+') {  // Si viene otro +, es ++ (incremento)
                        this.addChar(char);
                        this.state = 13;
                        continue;
                    }

                    // Si no, es solo + (suma)
                    this.addToken(Type.PLUS, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 13:  // Estado de aceptación para ++ (incremento)
                    this.addToken(Type.INC, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 14:  // Estado para signo menos - (puede ser - o --)
                    if (char == '-') {  // Si viene otro -, es -- (decremento)
                        this.addChar(char);
                        this.state = 15;
                        continue;
                    }

                    // Si no, es solo - (resta)
                    this.addToken(Type.MINUS, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 15:  // Estado de aceptación para -- (decremento)
                    this.addToken(Type.DEC, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 16:  // Estado de aceptación para * (multiplicación)
                    this.addToken(Type.MULT, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 17:  // Estado para ! (puede ser ! o !=)
                    if (char == '=') {  // Si viene =, es != (diferente)
                        this.addChar(char);
                        this.state = 18;
                        continue;
                    }

                    // Si no, es solo ! (error porque no está implementado)
                    this.addError(this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="error">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 18:  // Estado de aceptación para != (diferente)
                    this.addToken(Type.DIFF, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 19:  // Estado para < (puede ser < o <=)
                    if (char == '=') {  // Si viene =, es <= (menor o igual)
                        this.addChar(char);
                        this.state = 20;
                        continue;
                    }

                    // Si no, es solo < (menor que)
                    this.addToken(Type.LESS, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 20:  // Estado de aceptación para <= (menor o igual)
                    this.addToken(Type.LESS_EQ, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 21:  // Estado para > (puede ser > o >=)
                    if (char == '=') {  // Si viene =, es >= (mayor o igual)
                        this.addChar(char);
                        this.state = 22;
                        continue;
                    }

                    // Si no, es solo > (mayor que)
                    this.addToken(Type.GREATER, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 22:  // Estado de aceptación para >= (mayor o igual)
                    this.addToken(Type.GREATER_EQ, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 23:  // Estado para / (puede ser /, // o /*)
                    if (char == '/') {  // Si viene otro /, es comentario de una línea //
                        this.addChar(char);
                        this.state = 24;
                        continue;
                    }

                    if (char == '*') {  // Si viene *, es comentario de múltiples líneas /*
                        this.addChar(char);
                        this.state = 25;
                        continue;
                    }

                    // Si no, es solo / (división)
                    this.addToken(Type.DIV, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 24:  // Estado para comentario de una línea //
                    if (char != '\n') {  // Mientras no sea salto de línea, seguir acumulando
                        this.addChar(char);
                        continue;
                    }

                    // Al encontrar salto de línea, terminar el comentario
                    this.addToken(Type.COMMENT, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="comment">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 25:  // Estado para comentario de múltiples líneas /*
                    if (char == '*') {  // Si viene *, puede ser el final del comentario
                        this.addChar(char);
                        this.state = 26;
                        continue;
                    }

                    // Si es el final del archivo, es un error
                    if (char == '#' && i == input.length - 1) {
                        this.addError(this.auxChar, this.row, this.column);
                        this.clean();
                        i--;
                    }

                    // Si es salto de línea, actualizar contadores
                    if (char == '\n' || char == '\r') {
                        this.row++;
                        this.column = 1;
                    }

                    // Seguir acumulando caracteres del comentario
                    this.addChar(char);
                    break;
                case 26:  // Estado para * en comentario de múltiples líneas
                    if (char == '/') {  // Si viene /, terminar el comentario */
                        this.addChar(char);
                        this.state = 27;
                        continue;
                    }

                    // Si no es /, volver al estado 25 para seguir acumulando
                    this.state = 25;
                    i--;
                    break;
                case 27:  // Estado de aceptación para comentario de múltiples líneas */
                    this.addToken(Type.MULTICOMMENT, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="comment">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 28:  // Estado para identificadores y palabras reservadas
                    // Mientras sea letra, número o guión bajo, seguir acumulando
                    if (/[a-zA-Z0-9_]/.test(char)) {
                        this.addChar(char)
                        continue;
                    }

                    // Verificar si es una palabra reservada
                    let word: ReserverWords | undefined = this.reservedWords.find(token => token.lexeme === this.auxChar);

                    if (word) {
                        // Es una palabra reservada
                        this.addToken(word.token, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += `<span class="keyword">${this.auxChar}</span>`;
                        this.clean();
                        i--;
                        continue;
                    }

                    // Es un identificador (nombre de variable, función, etc.)
                    this.addToken(Type.IDENTIFIER, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    i--;
                    break;
                case 29:  // Estado para números enteros
                    if (char == '.') {  // Si viene punto, puede ser un número decimal
                        this.addChar(char);
                        this.state = 30;
                        continue;
                    }

                    // Si es otro número, seguir acumulando
                    if (/[0-9]/.test(char)) {
                        this.addChar(char);
                        continue;
                    }

                    // Si no es número ni punto, es un entero
                    this.addToken(Type.INTEGER, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="number">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 30:  // Estado para punto en número decimal
                    if (/[0-9]/.test(char)) {  // Si después del punto viene un número
                        this.addChar(char);
                        this.state = 31;  // Ir al estado para decimales
                        continue;
                    }

                    // Si no viene número después del punto, es un error
                    this.addError(this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="error">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 31:  // Estado para números decimales
                    if (/[0-9]/.test(char)) {  // Seguir acumulando números
                        this.addChar(char);
                        continue;
                    }

                    // Si no es número, terminar el decimal
                    this.addToken(Type.DECIMAL, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="number">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 32:  // Estado para cadenas de texto (después de ")
                    if (char == '"') {  // Si viene otra ", terminar la cadena
                        this.addChar(char);
                        this.state = 33;
                        continue;
                    }

                    // Si es salto de línea o final del archivo sin cerrar comillas, es error
                    if (char == '\n' || (char == '#' && i == input.length - 1)) {
                        this.addError(this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += `<span class="error">${this.auxChar}</span>`;
                        this.clean();
                        i--;
                        continue;
                    }

                    // Seguir acumulando caracteres de la cadena
                    this.addChar(char);
                    break;
                case 33:  // Estado de aceptación para cadenas de texto
                    this.addToken(Type.STRING, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="string">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 34:  // Estado para caracteres (después de ')
                    if (char != "'") {  // Si no es comilla simple, es el carácter
                        this.addChar(char);
                        this.state = 35;
                        continue;
                    }

                    // Si es comilla simple sin carácter, es error
                    this.addError(this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="error">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 35:  // Estado para verificar cierre de carácter
                    if (char == "'") {  // Si viene comilla simple, terminar el carácter
                        this.addChar(char);
                        this.state = 36;
                        continue;
                    }

                    // Si no es comilla simple, es error
                    this.addError(this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="error">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                case 36:  // Estado de aceptación para caracteres
                    this.addToken(Type.CHAR, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="string">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
            }
        }

        return this.tokenList;
    }

    // Función para agregar un carácter al token que se está construyendo
    addChar(char: string) {
        this.auxChar += char;
        this.column++;
    }

    // Función para limpiar el estado del autómata y volver al estado inicial
    clean() {
        this.auxChar = '';
        this.state = 0;
    }

    // Función para crear y agregar un token a la lista
    addToken(type: Type, lexeme: string, row: number, column: number) {
        this.tokenList.push(new Token(type, lexeme, row, column));
    }

    // Función para crear y agregar un error léxico a la lista
    addError(lexeme: string, row: number, column: number) {
        this.errorList.push(new Token(Type.UNKNOW, lexeme, row, column));
    }

    // Función para obtener la lista de tokens encontrados
    getTokenList(): Token[] {
        return this.tokenList;
    }

    // Función para obtener la lista de errores léxicos
    getErrorList(): Token[] {
        return this.errorList;
    }

    // Función para obtener el código con etiquetas de color
    getColors(): string {
        return this.colors;
    }
}