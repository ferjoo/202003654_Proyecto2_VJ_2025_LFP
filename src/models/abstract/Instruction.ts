// Interfaz que define cómo debe ser una instrucción en el transpilador
// Todas las instrucciones (declaraciones, asignaciones, if, for, etc.) deben implementar esta interfaz
export interface Instruction {

    row: number;      // Fila donde aparece la instrucción (para reportar errores)
    column: number;   // Columna donde aparece la instrucción (para reportar errores)

    // Método que convierte la instrucción de C# a TypeScript
    // Cada tipo de instrucción debe implementar su propia lógica de traducción
    transpiler(): string;
}