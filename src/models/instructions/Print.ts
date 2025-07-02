import { Instruction } from "../abstract/Instruction";

// Clase que representa una instrucción de impresión en C#
// Ejemplo: Console.WriteLine("Hola mundo");
export class Print implements Instruction {

    row: number;           // Fila donde aparece la instrucción
    column: number;        // Columna donde aparece la instrucción
    private expression: string; // La expresión que se va a imprimir

    constructor(expression: string, row: number, column: number) {
        this.row = row;
        this.column = column;
        this.expression = expression;
    }

    // Método que convierte Console.WriteLine de C# a console.log de TypeScript
    transpiler(): string {
        // Console.WriteLine("texto") -> console.log("texto")
        return `console.log(${this.expression});\n`;
    }

}