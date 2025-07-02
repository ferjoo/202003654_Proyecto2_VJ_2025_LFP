import { First } from "../../utils/First";
import { IdDec } from "../../utils/IdDec";
import { Production } from "../../utils/Production";
import { Instruction } from "../models/abstract/Instruction";
import { Arithmetic } from "../models/expressions/Arithmetic";
import { Identifier } from "../models/expressions/Identifier";
import { Primitive } from "../models/expressions/Primitive";
import { Relational } from "../models/expressions/Relational";
import { Assignation } from "../models/instructions/Assignation";
import { Declaration } from "../models/instructions/Declaration";
import { For } from "../models/instructions/For";
import { If } from "../models/instructions/If";
import { Print } from "../models/instructions/Print";
import { DataType } from "../models/tools/DataType";
import { Error } from "./Error";
import { Token, Type } from "./Token";

export class Transpiler {

    // Variables del transpilador (convierte C# a TypeScript)
    private tokens: Token[];         // Lista de tokens que vienen del analizador léxico
    private pos: number;             // Posición actual en la lista de tokens
    private errors: Error[];         // Lista de errores encontrados durante la traducción
    private flagError: boolean;      // Bandera para evitar múltiples errores en cascada
    private preAnalysis: Token;      // Token actual que se está procesando
    private firsts: First[];         // Conjuntos First para análisis predictivo (igual que en sintáctico)
    private instructions: Instruction[]; // Lista de instrucciones traducidas a TypeScript
    private countTab: number;        // Contador de tabulaciones para el formato del código

    constructor(tokens: Token[]) {
        this.instructions = [];
        this.errors = [];
        this.pos = 0;
        this.tokens = tokens;
        this.flagError = false;
        
        // Definir los conjuntos First (igual que en el analizador sintáctico)
        this.firsts = [
            {production: Production.INSTRUCTION, first: [Type.R_INT, Type.R_FLOAT, Type.R_BOOL, Type.R_STRING, Type.R_CHAR, Type.IDENTIFIER, Type.R_CONSOLE, Type.R_IF, Type.R_FOR]},
            {production: Production.LIST_INSTRUCTIONS_P, first: [Type.R_INT, Type.R_FLOAT, Type.R_BOOL, Type.R_STRING, Type.R_CHAR, Type.IDENTIFIER, Type.R_CONSOLE, Type.R_IF, Type.R_FOR]},
            {production: Production.ID_ASIGN_P, first: [Type.ASSIGN]},
            {production: Production.LIST_ID_P, first: [Type.COMMA]},
            {production: Production.INST_IF_P, first: [Type.R_ELSE]},
            {production: Production.FIRST_BLOCK_FOR, first: [Type.R_INT, Type.R_FLOAT, Type.R_BOOL, Type.R_STRING, Type.R_CHAR, Type.IDENTIFIER]},
            {production: Production.THIRD_BLOCK_FOR_P, first: [Type.INC, Type.DEC]},
            {production: Production.ARITHMETIC, first: [Type.PAR_O, Type.IDENTIFIER, Type.INTEGER, Type.DECIMAL, Type.STRING, Type.CHAR, Type.R_FALSE, Type.R_TRUE]},
            {production: Production.ARITHMETIC_P, first: [Type.PLUS, Type.MINUS]},
            {production: Production.RELATIONAL, first: [Type.EQUAL, Type.DIFF, Type.LESS, Type.LESS_EQ, Type.GREATER, Type.GREATER_EQ]},
            {production: Production.TERM_P, first: [Type.MULT, Type.DIV]},
            {production: Production.FACTOR, first: [Type.PAR_O, Type.IDENTIFIER, Type.INTEGER, Type.DECIMAL, Type.STRING, Type.CHAR, Type.R_FALSE, Type.R_TRUE]}
        ];
        this.preAnalysis = this.tokens[this.pos];
        this.countTab = 1;
    }

    // Función principal del transpilador - convierte C# a TypeScript
    public parser() { 
        // Analizar la estructura completa y convertir a TypeScript
        this.blockUsing();  // Convertir "using System;" (se ignora en TypeScript)
        this.class();       // Convertir la clase principal
    }

    // Función para procesar "using System;" (no se traduce a TypeScript)
    private blockUsing() {  
        this.expect(Type.R_USING);    // Consumir "using"
        this.expect(Type.R_SYSTEM);   // Consumir "System"
        this.expect(Type.SEMICOLON);  // Consumir ";"
    }

    // Función para convertir la clase principal
    private class() {   
        this.expect(Type.R_PUBLIC);   // Consumir "public"
        this.expect(Type.R_CLASS);    // Consumir "class"
        this.expect(Type.IDENTIFIER); // Consumir el nombre de la clase
        this.expect(Type.KEY_O);      // Consumir "{"
        this.blockMain();             // Convertir el método Main
        this.expect(Type.KEY_C);      // Consumir "}"
    }

    // Función para convertir el método Main
    private blockMain() {
        this.expect(Type.R_STATIC);   // Consumir "static"
        this.expect(Type.R_VOID);     // Consumir "void"
        this.expect(Type.R_MAIN);     // Consumir "Main"
        this.expect(Type.PAR_O);      // Consumir "("
        this.expect(Type.R_STRING);   // Consumir "string"
        this.expect(Type.BRA_O);      // Consumir "["
        this.expect(Type.BRA_C);      // Consumir "]"
        this.expect(Type.IDENTIFIER); // Consumir "args"
        this.expect(Type.PAR_C);      // Consumir ")"
        this.expect(Type.KEY_O);      // Consumir "{"
        this.instructions = this.listInstructions(); // Convertir las instrucciones
        this.expect(Type.KEY_C);      // Consumir "}"
    }

    // Función para convertir una lista de instrucciones
    private listInstructions(): Instruction[] {
        let instructions: Instruction[] = [];
        let instruction: Instruction | undefined = this.instruction();

        if (instruction) instructions.push(instruction);

        return this.listInstructionsP(instructions);
    }

    // Función recursiva para convertir múltiples instrucciones
    private listInstructionsP(instructions: Instruction[]): Instruction[] {
        if (this.isFirst(Production.LIST_INSTRUCTIONS_P)) {
            let instruction: Instruction | undefined = this.instruction();

            if (instruction) instructions.push(instruction);

            return this.listInstructionsP(instructions);
        }

        return instructions;
    }    

    // Función para convertir una instrucción individual
    private instruction(): Instruction | undefined {
        switch(this.preAnalysis.getType()) {
            case Type.R_INT:      // Si es un tipo de dato
            case Type.R_STRING:
            case Type.R_FLOAT:
            case Type.R_BOOL:
            case Type.R_CHAR:
                return this.declaration();    // Convertir declaración de variable
            case Type.IDENTIFIER:      // Si es un identificador
                return this.assignation();    // Convertir asignación
            case Type.R_CONSOLE:       // Si es Console
                return this.print();          // Convertir instrucción de impresión
            case Type.R_IF:            // Si es if
                return this.instrIf();        // Convertir estructura condicional
            case Type.R_FOR:           // Si es for
                return this.instrFor();       // Convertir estructura de repetición
            default:
                // Si no es ninguno de los anteriores y no hay error previo
                if (this.flagError) return;

                // Buscar qué tokens se esperaban para dar un mensaje de error útil
                const firsts: First | undefined = this.firsts.find(first => first.production === Production.INSTRUCTION);
                this.addError(this.preAnalysis, firsts ? firsts.first : []);
                break;
        }
    }

    // Función para convertir una declaración de variable
    private declaration(): Instruction {
        let type: Type = this.preAnalysis.getType();  // Obtener el tipo de dato
        let row: number = this.preAnalysis.getRow();   // Obtener la fila para reportar errores
        let column: number = this.preAnalysis.getColumn(); // Obtener la columna para reportar errores

        this.type();              // Consumir el tipo de dato
        let listIds: IdDec[] = this.listId(); // Convertir la lista de identificadores
        this.expect(Type.SEMICOLON); // Consumir ";"

        // Crear una instrucción de declaración con el tipo, identificadores y posición
        return new Declaration(type, listIds, row, column);
    }

    // Función para consumir el tipo de dato
    private type() {
        this.expect(this.preAnalysis.getType());
    }

    // Función para convertir una lista de identificadores
    private listId(): IdDec[] {
        let listId: IdDec[] = [];

        listId.push(this.idAsign()); // Convertir el primer identificador
        return this.listIdP(listId); // Convertir los siguientes (si los hay)
    }

    // Función para convertir un identificador con posible asignación
    private idAsign(): IdDec {
        let value: string = this.preAnalysis.getLexeme(); // Obtener el nombre del identificador
        let row: number = this.preAnalysis.getRow();
        let column: number = this.preAnalysis.getColumn();

        this.expect(Type.IDENTIFIER); // Consumir el identificador

        // Crear una expresión de identificador
        let id: Instruction = new Identifier(value, row, column);

        return this.idAsignP(id); // Procesar la posible asignación
    }

    // Función para procesar la parte opcional de asignación
    private idAsignP(id: Instruction): IdDec {
        if (this.isFirst(Production.ID_ASIGN_P)) {
            this.expect(Type.ASSIGN);  // Consumir "="
            let exp: Instruction | undefined = this.expression(); // Convertir la expresión

            if (exp) return {id: id, value: exp}; // Retornar identificador con valor
        }

        return {id: id, value: undefined} // Retornar identificador sin valor
    }

    // Función para convertir múltiples identificadores separados por comas
    private listIdP(listId: IdDec[]): IdDec[] {
        if (this.isFirst(Production.LIST_ID_P)) {
            this.expect(Type.COMMA);   // Consumir ","
            listId.push(this.idAsign()); // Convertir el siguiente identificador
            return this.listIdP(listId); // Continuar con los siguientes
        }

        return listId;
    }

    // Función para convertir una asignación de variable
    private assignation(): Instruction | undefined {
        let id: string = this.preAnalysis.getLexeme(); // Obtener el nombre de la variable
        let row: number = this.preAnalysis.getRow();
        let column: number = this.preAnalysis.getColumn();

        this.expect(Type.IDENTIFIER); // Consumir el identificador
        this.expect(Type.ASSIGN);     // Consumir "="
        let exp: Instruction | undefined = this.expression(); // Convertir la expresión
        this.expect(Type.SEMICOLON);  // Consumir ";"

        // Crear una instrucción de asignación
        if (exp) {
            return new Assignation(id, exp, row, column);
        }
    }

    private print(): Instruction | undefined {
        let row: number = this.preAnalysis.getRow();
        let column: number = this.preAnalysis.getColumn();

        this.expect(Type.R_CONSOLE);
        this.expect(Type.PERIOD);
        this.expect(Type.R_WRITELINE);
        this.expect(Type.PAR_O);
        let exp: Instruction | undefined = this.expression();
        this.expect(Type.PAR_C);
        this.expect(Type.SEMICOLON);

        if (exp) return new Print(exp, row, column);
    }

    private instrIf(): Instruction | undefined {
        let row: number = this.preAnalysis.getRow();
        let column: number = this.preAnalysis.getColumn();

        this.expect(Type.R_IF);
        this.expect(Type.PAR_O);
        let exp: Instruction | undefined = this.expression();
        this.expect(Type.PAR_C);
        this.expect(Type.KEY_O);
        this.countTab++;
        let instructions: Instruction[] = this.listInstructions();
        this.countTab--;
        this.expect(Type.KEY_C);
        let instructionsElse: Instruction[] | undefined = this.instIfP();

        if (exp) return new If(exp, instructions, instructionsElse, row, column, this.countTab);
    }

    private instIfP(): Instruction[] | undefined {
        if (this.isFirst(Production.INST_IF_P)) {
            this.expect(Type.R_ELSE);
            this.expect(Type.KEY_O);
            let instructions: Instruction[] = this.listInstructions();
            this.expect(Type.KEY_C);

            return instructions;
        }
    }

    private instrFor(): Instruction {
        let row: number = this.preAnalysis.getRow();
        let column: number = this.preAnalysis.getColumn();

        this.expect(Type.R_FOR);
        this.expect(Type.PAR_O);
        let firstFor: Instruction | undefined = this.firstBlockFor();
        let condition: Instruction | undefined = this.expression();
        this.expect(Type.SEMICOLON);
        let step = this.thirdBlockFor();
        this.expect(Type.PAR_C);
        this.expect(Type.KEY_O);
        this.countTab++;
        let instructions: Instruction[] = this.listInstructions();
        this.countTab--;
        this.expect(Type.KEY_C);

        return new For(firstFor, condition, step, instructions, row, column, this.countTab);
    }

    private firstBlockFor(): Instruction |  undefined {
        if (this.isFirst(Production.FIRST_BLOCK_FOR)) {
            switch(this.preAnalysis.getType()) {
                case Type.IDENTIFIER:
                    return this.assignation();
                default:
                    return this.declaration();
            }
        }

        if (this.flagError) return;

        const firsts: First | undefined = this.firsts.find(first => first.production === Production.FIRST_BLOCK_FOR);

        this.addError(this.preAnalysis, firsts ? firsts.first : []);
    }

    private thirdBlockFor(): {id: Instruction, operator: string} | undefined {
        let value: string = this.preAnalysis.getLexeme();
        let row: number = this.preAnalysis.getRow();
        let column: number = this.preAnalysis.getColumn();

        this.expect(Type.IDENTIFIER);
        let operator: string | undefined = this.thirdBlockForP();

        if (operator) return {id: new Identifier(value, row, column), operator: operator}
    }

    private thirdBlockForP(): string | undefined {
        if (this.isFirst(Production.THIRD_BLOCK_FOR_P)) {
            switch(this.preAnalysis.getType()) {
                case Type.INC:
                    this.increment();
                    return '++';
                default:
                    this.decrement()
                    return '--';
            }
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

    private expression(): Instruction | undefined {
        return this.relational(this.arithmetic());
    }

    private relational(exp1: Instruction | undefined): Instruction | undefined {
        if (this.isFirst(Production.RELATIONAL)) {
            let operator: string = this.preAnalysis.getLexeme();
            let row: number = this.preAnalysis.getRow();
            let column: number = this.preAnalysis.getColumn();

            this.expect(this.preAnalysis.getType());

            let exp2: Instruction | undefined = this.arithmetic();

            return new Relational(exp1, exp2, operator, row, column);
        }

        return exp1;
    }

    private arithmetic(): Instruction | undefined {
        return this.arithmeticP(this.term());
    }

    private arithmeticP(exp1: Instruction | undefined): Instruction | undefined {
        if (this.isFirst(Production.ARITHMETIC_P)) {
            let operator: string = this.preAnalysis.getLexeme();
            let row: number = this.preAnalysis.getRow();
            let column: number = this.preAnalysis.getColumn();

            this.expect(this.preAnalysis.getType());

            let exp2: Instruction | undefined = this.arithmeticP(this.term());

            return new Arithmetic(exp1, exp2, operator, row, column);
        }
        
        return exp1;
    }

    private term(): Instruction | undefined { // 2 * 2 -> num * num
        return this.termP(this.factor());
    }   
    
    private termP(exp1: Instruction | undefined): Instruction | undefined {
        if (this.isFirst(Production.TERM_P)){
            let operator: string = this.preAnalysis.getLexeme();
            let row: number = this.preAnalysis.getRow();
            let column: number = this.preAnalysis.getColumn();
            this.expect(this.preAnalysis.getType());

            let exp2: Instruction | undefined = this.termP(this.factor());
            
            return new Arithmetic(exp1, exp2, operator, row, column);
        }

        return exp1;
    }

    private factor(): Instruction | undefined {
        if (this.isFirst(Production.FACTOR)) {
            let lexeme: string = this.preAnalysis.getLexeme();
            let row: number = this.preAnalysis.getRow();
            let column: number = this.preAnalysis.getColumn();

            switch(this.preAnalysis.getType()) {
                case Type.PAR_O:
                    this.expect(Type.PAR_O);
                    let exp: Instruction | undefined = this.arithmetic();
                    this.expect(Type.PAR_C);

                    if (exp instanceof Arithmetic) {
                        exp.setFlag(true);
                    }

                    return exp;
                case Type.IDENTIFIER:
                    this.expect(Type.IDENTIFIER);
                    return new Identifier(lexeme, row, column);
                case Type.INTEGER:
                    this.expect(Type.INTEGER);
                    return new Primitive(lexeme, DataType.INT, row, column);
                case Type.DECIMAL:
                    this.expect(Type.DECIMAL);
                    return new Primitive(lexeme, DataType.FLOAT, row, column);
                case Type.STRING:
                    this.expect(Type.STRING);
                    return new Primitive(lexeme, DataType.STRING, row, column);
                case Type.CHAR:
                    this.expect(Type.CHAR);
                    return new Primitive(lexeme, DataType.CHAR, row, column);
                default:
                    this.expect(this.preAnalysis.getType());
                    return new Primitive(lexeme, DataType.BOOL, row, column);
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

    public getInstructions(): Instruction[] {
        return this.instructions;
    }
}