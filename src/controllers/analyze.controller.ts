import { Request, Response } from "express";
import { LexicalAnalyzer } from "../Analyzer/LexicalAnalyzer";
import { Token, Type } from "../Analyzer/Token";
import { SyntacticAnalyzer } from "../Analyzer/SyntacticAnalyzer";
import { Error } from "../Analyzer/Error";
import { Transpiler } from "../Analyzer/Transpiler";
import { Instruction } from "../models/abstract/Instruction";

// Función para mostrar la página principal
export const home = (req: Request, res: Response) => {
    res.render('pages/index');
}

// Función principal que analiza el código C# enviado por el usuario
export const analyze = (req: Request, res: Response) => {
    // Obtener el código C# del cuerpo de la petición
    const body = req.body;

    // Crear el analizador léxico (lee el código carácter por carácter)
    let scanner: LexicalAnalyzer = new LexicalAnalyzer();

    // Convertir el código en tokens (palabras, números, símbolos)
    let tokenList: Token[]  = scanner.scanner(body);

    // Variables para el análisis sintáctico y traducción
    let parser: SyntacticAnalyzer;
    let errorParser: Error[] = [];
    let transpiler: Transpiler;
    let code: string = '';

    // Crear el analizador sintáctico (verifica que la estructura del código sea correcta)
    parser = new SyntacticAnalyzer(tokenList);
    parser.parser();

    // Obtener errores de sintaxis si los hay
    errorParser = parser.getErrors();

    // Si no hay errores de sintaxis, traducir el código a TypeScript
    if (errorParser.length == 0) {
        // Crear el transpilador (convierte C# a TypeScript)
        transpiler = new Transpiler(tokenList);
        transpiler.parser();

        // Convertir cada instrucción a código TypeScript
        transpiler.getInstructions().forEach((instruction: Instruction) => {
            code += instruction.transpiler();
        });
    }

    // Enviar los resultados al frontend
    res.json({
        tokens: tokenList,                    // Lista de tokens encontrados
        errors: scanner.getErrorList(),       // Errores léxicos (caracteres no reconocidos)
        syntacticErrors: errorParser,         // Errores de sintaxis (estructura incorrecta)
        traduction: code,                     // Código traducido a TypeScript
        colors: scanner.getColors()           // Código con colores para resaltar en el editor
    });
}