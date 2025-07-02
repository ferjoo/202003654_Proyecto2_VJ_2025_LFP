export interface Token {
  type: string;
  lexeme: string;
  row: number;
  column: number;
}

export interface Error {
  type: string;
  description: string;
  row: number;
  column: number;
}

export interface AnalysisResponse {
  tokens: Token[];
  errors: Error[];
  syntacticErrors: Error[];
  traduction: string;
  colors: string;
}

export interface AnalysisRequest {
  code: string;
} 