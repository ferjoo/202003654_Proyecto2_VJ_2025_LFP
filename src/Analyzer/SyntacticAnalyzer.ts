import { First } from "../../utils/First";
import { Production } from "../../utils/Production";
import { Error } from "./Error";
import { Token, Type } from "./Token";

export class SyntacticAnalyzer {

    // Variables del analizador sintáctico
    private tokens: Token[];         // Lista de tokens que vienen del analizador léxico
    private pos: number;             // Posición actual en la lista de tokens
    private errors: Error[];         // Lista de errores de sintaxis encontrados
    private flagError: boolean;      // Bandera para evitar múltiples errores en cascada
    private preAnalysis: Token;      // Token actual que se está analizando
    private firsts: First[];         // Conjuntos First para análisis predictivo

    constructor(tokens: Token[]) {
        this.errors = [];
        this.pos = 0;
        this.tokens = tokens;
        this.flagError = false;
        
        // Definir los conjuntos First para cada producción de la gramática
        // Los conjuntos First indican qué tokens pueden aparecer al inicio de cada regla
        this.firsts = [
            // Primera regla: INSTRUCTION puede empezar con tipos de datos, identificadores, Console, if, for
            {production: Production.INSTRUCTION, first: [Type.R_INT, Type.R_FLOAT, Type.R_BOOL, Type.R_STRING, Type.R_CHAR, Type.IDENTIFIER, Type.R_CONSOLE, Type.R_IF, Type.R_FOR]},
            // Segunda regla: LIST_INSTRUCTIONS_P puede empezar con los mismos tokens que INSTRUCTION
            {production: Production.LIST_INSTRUCTIONS_P, first: [Type.R_INT, Type.R_FLOAT, Type.R_BOOL, Type.R_STRING, Type.R_CHAR, Type.IDENTIFIER, Type.R_CONSOLE, Type.R_IF, Type.R_FOR]},
            // Tercera regla: ID_ASIGN_P puede empezar con = (asignación)
            {production: Production.ID_ASIGN_P, first: [Type.ASSIGN]},
            // Cuarta regla: LIST_ID_P puede empezar con , (coma para múltiples variables)
            {production: Production.LIST_ID_P, first: [Type.COMMA]},
            // Quinta regla: INST_IF_P puede empezar con else
            {production: Production.INST_IF_P, first: [Type.R_ELSE]},
            // Sexta regla: FIRST_BLOCK_FOR puede empezar con tipos de datos o identificadores
            {production: Production.FIRST_BLOCK_FOR, first: [Type.R_INT, Type.R_FLOAT, Type.R_BOOL, Type.R_STRING, Type.R_CHAR, Type.IDENTIFIER]},
            // Séptima regla: THIRD_BLOCK_FOR_P puede empezar con ++ o --
            {production: Production.THIRD_BLOCK_FOR_P, first: [Type.INC, Type.DEC]},
            // Octava regla: ARITHMETIC puede empezar con (, identificador, número, string, char, true, false
            {production: Production.ARITHMETIC, first: [Type.PAR_O, Type.IDENTIFIER, Type.INTEGER, Type.DECIMAL, Type.STRING, Type.CHAR, Type.R_FALSE, Type.R_TRUE]},
            // Novena regla: ARITHMETIC_P puede empezar con + o -
            {production: Production.ARITHMETIC_P, first: [Type.PLUS, Type.MINUS]},
            // Décima regla: RELATIONAL puede empezar con operadores de comparación
            {production: Production.RELATIONAL, first: [Type.EQUAL, Type.DIFF, Type.LESS, Type.LESS_EQ, Type.GREATER, Type.GREATER_EQ]},
            // Undécima regla: TERM_P puede empezar con * o /
            {production: Production.TERM_P, first: [Type.MULT, Type.DIV]},
            // Duodécima regla: FACTOR puede empezar con los mismos tokens que ARITHMETIC
            {production: Production.FACTOR, first: [Type.PAR_O, Type.IDENTIFIER, Type.INTEGER, Type.DECIMAL, Type.STRING, Type.CHAR, Type.R_FALSE, Type.R_TRUE]}
        ];
        this.preAnalysis = this.tokens[this.pos];
    }

    // Función principal del analizador sintáctico
    public parser() { 
        // Analizar la estructura completa de un programa C#
        this.blockUsing();  // Primero debe venir "using System;"
        this.class();       // Luego la clase principal
    }

    // Función para analizar la declaración "using System;"
    private blockUsing() {  
        this.expect(Type.R_USING);    // Debe venir "using"
        this.expect(Type.R_SYSTEM);   // Debe venir "System"
        this.expect(Type.SEMICOLON);  // Debe venir ";"
    }

    // Función para analizar la declaración de la clase principal
    private class() {   
        this.expect(Type.R_PUBLIC);   // Debe venir "public"
        this.expect(Type.R_CLASS);    // Debe venir "class"
        this.expect(Type.IDENTIFIER); // Debe venir el nombre de la clase
        this.expect(Type.KEY_O);      // Debe venir "{"
        this.blockMain();             // Analizar el método Main
        this.expect(Type.KEY_C);      // Debe venir "}"
    }

    // Función para analizar el método Main
    private blockMain() {
        this.expect(Type.R_STATIC);   // Debe venir "static"
        this.expect(Type.R_VOID);     // Debe venir "void"
        this.expect(Type.R_MAIN);     // Debe venir "Main"
        this.expect(Type.PAR_O);      // Debe venir "("
        this.expect(Type.R_STRING);   // Debe venir "string"
        this.expect(Type.BRA_O);      // Debe venir "["
        this.expect(Type.BRA_C);      // Debe venir "]"
        this.expect(Type.IDENTIFIER); // Debe venir "args"
        this.expect(Type.PAR_C);      // Debe venir ")"
        this.expect(Type.KEY_O);      // Debe venir "{"
        this.listInstructions();      // Analizar las instrucciones del método
        this.expect(Type.KEY_C);      // Debe venir "}"
    }

    // Función para analizar una lista de instrucciones
    private listInstructions() {
        this.instruction();           // Analizar la primera instrucción
        this.listInstructionsP();     // Analizar las siguientes instrucciones (si las hay)
    }

    // Función recursiva para analizar múltiples instrucciones
    private listInstructionsP() {
        // Si el token actual puede ser el inicio de una instrucción
        if (this.isFirst(Production.LIST_INSTRUCTIONS_P)) {
            this.instruction();       // Analizar la siguiente instrucción
            this.listInstructionsP(); // Continuar con las siguientes
        }
    }    

    // Función para analizar una instrucción individual
    private instruction() {
        switch(this.preAnalysis.getType()) {
            case Type.R_INT:      // Si es un tipo de dato
            case Type.R_STRING:
            case Type.R_FLOAT:
            case Type.R_BOOL:
            case Type.R_CHAR:
                this.declaration();    // Es una declaración de variable
                break;
            case Type.IDENTIFIER:      // Si es un identificador
                this.assignation();    // Es una asignación
                break;
            case Type.R_CONSOLE:       // Si es Console
                this.print();          // Es una instrucción de impresión
                break;
            case Type.R_IF:            // Si es if
                this.instrIf();        // Es una estructura condicional
                break;
            case Type.R_FOR:           // Si es for
                this.instrFor();       // Es una estructura de repetición
                break;
            default:
                // Si no es ninguno de los anteriores y no hay error previo
                if (this.flagError) return;

                // Buscar qué tokens se esperaban para dar un mensaje de error útil
                const firsts: First | undefined = this.firsts.find(first => first.production === Production.INSTRUCTION);
                this.addError(this.preAnalysis, firsts ? firsts.first : []);
                break;
        }
    }

    // Función para analizar una declaración de variable
    private declaration() {
        this.type();              // Analizar el tipo de dato
        this.listId();            // Analizar la lista de identificadores
        this.expect(Type.SEMICOLON); // Debe terminar con ";"
    }

    // Función para analizar el tipo de dato
    private type() {
        this.expect(this.preAnalysis.getType()); // El tipo actual debe ser un tipo válido
    }

    // Función para analizar una lista de identificadores
    private listId() {
        this.idAsign();           // Analizar el primer identificador
        this.listIdP();           // Analizar los siguientes (si los hay)
    }

    // Función para analizar un identificador con posible asignación
    private idAsign() {
        this.expect(Type.IDENTIFIER); // Debe venir un identificador
        this.idAsignP();              // Puede venir una asignación
    }

    // Función para analizar la parte opcional de asignación
    private idAsignP() {
        // Si viene "=", entonces debe venir una expresión
        if (this.isFirst(Production.ID_ASIGN_P)) {
            this.expect(Type.ASSIGN);  // Debe venir "="
            this.expression();         // Debe venir una expresión
        }
    }

    // Función para analizar múltiples identificadores separados por comas
    private listIdP() {
        // Si viene ",", entonces debe venir otro identificador
        if (this.isFirst(Production.LIST_ID_P)) {
            this.expect(Type.COMMA);   // Debe venir ","
            this.idAsign();            // Debe venir otro identificador
            this.listIdP();            // Continuar con los siguientes
        }
    }

    // Función para analizar una asignación de variable
    private assignation() {
        this.expect(Type.IDENTIFIER); // Debe venir un identificador
        this.expect(Type.ASSIGN);     // Debe venir "="
        this.expression();            // Debe venir una expresión
        this.expect(Type.SEMICOLON);  // Debe terminar con ";"
    }

    // Función para analizar una instrucción de impresión
    private print() {
        this.expect(Type.R_CONSOLE);   // Debe venir "Console"
        this.expect(Type.PERIOD);      // Debe venir "."
        this.expect(Type.R_WRITELINE); // Debe venir "WriteLine"
        this.expect(Type.PAR_O);       // Debe venir "("
        this.expression();             // Debe venir una expresión
        this.expect(Type.PAR_C);       // Debe venir ")"
        this.expect(Type.SEMICOLON);   // Debe terminar con ";"
    }

    // Función para analizar una estructura if
    private instrIf() {
        this.expect(Type.R_IF);        // Debe venir "if"
        this.expect(Type.PAR_O);       // Debe venir "("
        this.expression();             // Debe venir una condición
        this.expect(Type.PAR_C);       // Debe venir ")"
        this.expect(Type.KEY_O);       // Debe venir "{"
        this.listInstructions();       // Deben venir las instrucciones del if
        this.expect(Type.KEY_C);       // Debe venir "}"
        this.instIfP();                // Puede venir un else
    }

    // Función para analizar la parte opcional else del if
    private instIfP() {
        // Si viene "else", entonces debe venir un bloque else
        if (this.isFirst(Production.INST_IF_P)) {
            this.expect(Type.R_ELSE);  // Debe venir "else"
            this.expect(Type.KEY_O);   // Debe venir "{"
            this.listInstructions();   // Deben venir las instrucciones del else
            this.expect(Type.KEY_C);   // Debe venir "}"
        }
    }

    // Función para analizar una estructura for
    private instrFor() {
        this.expect(Type.R_FOR);       // Debe venir "for"
        this.expect(Type.PAR_O);       // Debe venir "("
        this.firstBlockFor();          // Analizar la inicialización
        this.expression();             // Analizar la condición
        this.expect(Type.SEMICOLON);   // Debe venir ";"
        this.thirdBlockFor();          // Analizar el incremento/decremento
        this.expect(Type.PAR_C);       // Debe venir ")"
        this.expect(Type.KEY_O);       // Debe venir "{"
        this.listInstructions();       // Deben venir las instrucciones del for
        this.expect(Type.KEY_C);       // Debe venir "}"
    }

    // Función para analizar la inicialización del for
    private firstBlockFor() {
        if (this.isFirst(Production.FIRST_BLOCK_FOR)) {
            switch(this.preAnalysis.getType()) {
                case Type.IDENTIFIER:
                    this.assignation();
                    break;
                default:
                    this.declaration();
                    break;
            }

            return;
        }

        if (this.flagError) return;

        const firsts: First | undefined = this.firsts.find(first => first.production === Production.FIRST_BLOCK_FOR);

        this.addError(this.preAnalysis, firsts ? firsts.first : []);
    }

    private thirdBlockFor() {
        this.expect(Type.IDENTIFIER);
        this.thirdBlockForP();
    }

    private thirdBlockForP() {
        if (this.isFirst(Production.THIRD_BLOCK_FOR_P)) {
            switch(this.preAnalysis.getType()) {
                case Type.INC:
                    this.increment();
                    break;
                default:
                    this.decrement()
                    break;
            }

            return;
        }

        if (this.flagError) return;

        const firsts: First | undefined = this.firsts.find(first => first.production === Production.THIRD_BLOCK_FOR_P);

        this.addError(this.preAnalysis, firsts ? firsts.first : []);
    }

    private increment() {
        this.expect(Type.INC);
    }   
    
    private decrement() {
        this.expect(Type.DEC);
    }

    private expression() {
        this.arithmetic();
        this.relational();
    }

    private relational() {
        if (this.isFirst(Production.RELATIONAL)) {
            this.expect(this.preAnalysis.getType());
            this.arithmetic();
        }
    }

    private arithmetic() {
        this.term();
        this.arithmeticP();
    }

    private arithmeticP() {
        if (this.isFirst(Production.ARITHMETIC_P)) {
            this.expect(this.preAnalysis.getType());
            this.term();
            this.arithmeticP();
        }
    }

    private term() {
        this.factor();
        this.termP();
    }   
    
    private termP() {
        if (this.isFirst(Production.TERM_P)){
            this.expect(this.preAnalysis.getType());
            this.factor();
            this.termP();
        }
    }

    private factor() {
        if (this.isFirst(Production.FACTOR)) {
            switch(this.preAnalysis.getType()) {
                case Type.PAR_O:
                    this.expect(Type.PAR_O);
                    this.arithmetic();
                    this.expect(Type.PAR_C);
                    break;
                case Type.IDENTIFIER:
                    this.expect(Type.IDENTIFIER);
                    break;
                default:
                    this.expect(this.preAnalysis.getType());
                    break;
            }

            return;
        }

        if (this.flagError) return;

        const firsts: First | undefined = this.firsts.find(first => first.production === Production.FACTOR);

        this.addError(this.preAnalysis, firsts ? firsts.first : []);
    }

    // Function to read the token of current position
    private read() {
        this.preAnalysis = this.tokens[this.pos];
    }

    private expect(typeToken: Type) {

        if (this.flagError) {
            this.pos++;

            if (this.isEnd()) return;

            this.read();

            if ([Type.SEMICOLON, Type.KEY_C].includes(this.preAnalysis.getType())) {
                this.flagError = false;
            }

            return;
        }

        if (this.preAnalysis.getType() === typeToken) { // T(q, x, x) -> (q, );
            this.pos++;

            if (this.isEnd()) return;

            this.read();
            return;
        }

        this.addError(this.preAnalysis, [typeToken]);
    }

    private isFirst(production: Production): boolean {
        const firsts: First | undefined = this.firsts.find(first => first.production === production);

        if (!firsts) {
            return false;
        }

        return firsts.first.includes(this.preAnalysis.getType());
    }

    private isEnd(): boolean {
        return this.pos == this.tokens.length;
    }

    private addError(token: Token, firsts: Type[]) {
        this.errors.push(new Error(token.getLexeme(),
            `Got Token: ${token.getTypeTokenString()} when expect: ${firsts.map((type) => {
                return `${Type[type]}`
            }).join('|')}`,
            token.getRow(), 
            token.getColumn()
        ));

        this.flagError = true;
    }

    public getErrors(): Error[] {
        return this.errors;
    }

}