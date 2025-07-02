import { IdDec } from "../../../utils/IdDec";
import { Type } from "../../Analyzer/Token";
import { Instruction } from "../abstract/Instruction";

// Clase que representa una declaración de variable en C#
// Ejemplo: int x = 5; string nombre = "Juan";
export class Declaration implements Instruction {

    row: number;           // Fila donde aparece la declaración
    column: number;        // Columna donde aparece la declaración
    private decType: Type; // Tipo de dato (int, string, float, etc.)
    private listIds: IdDec[]; // Lista de identificadores con sus valores opcionales

    constructor(decType: Type, listIds: IdDec[], row: number, column: number) {
        this.row = row;
        this.column = column;
        this.decType = decType;
        this.listIds = listIds;
    }

    // Método que convierte la declaración de C# a TypeScript
    transpiler(): string {

        // Convertir el tipo de C# a TypeScript
        let type: string = this.types(this.decType);
        
        // Empezar con "let" (declaración de variable en TypeScript)
        let declartions: string = `let `;

        // Convertir cada identificador con su posible valor
        declartions += this.listIds.map((id: IdDec) => {
            // Si tiene valor asignado: let x: number = 5;
            // Si no tiene valor: let x: number;
            return `${id.id.transpiler()}: ${type}${id.value ? ` = ${id.value.transpiler()}` : ''}`;
        }).join(', ');

        return `${declartions};\n`;
    }

    // Función que convierte tipos de C# a TypeScript
    private types(type: Type): string {
        switch(type) {
            case Type.R_INT:    // int en C# -> number en TypeScript
            case Type.R_FLOAT:  // float en C# -> number en TypeScript
                return 'number';
            case Type.R_STRING: // string en C# -> string en TypeScript
            case Type.R_CHAR:   // char en C# -> string en TypeScript
                return 'string';
            default:            // bool en C# -> boolean en TypeScript
                return 'boolean';
        }
    }

}