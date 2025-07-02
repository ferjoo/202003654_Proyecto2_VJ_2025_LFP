import { useState } from 'react';
import type { AnalysisResponse, Error as AnalysisError } from '../types';
import { analyzeCode } from '../services/api';

interface UseAnalysisReturn {
  analysisResult: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (code: string) => Promise<void>;
  clearResults: () => void;
}

export const useAnalysis = (): UseAnalysisReturn => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (code: string): Promise<void> => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeCode(code);
      console.log('[DEBUG] Raw backend response:', result);
      // Patch tokens to have 'type' if needed
      if (result.tokens && result.tokens.length > 0 && (result.tokens[0] as any).typeTokenString) {
        result.tokens = result.tokens.map(t => ({
          ...t,
          type: (t as any).typeTokenString
        }));
        console.log('[DEBUG] Patched tokens:', result.tokens);
      }
      // Patch errors to have 'type' and 'description' if needed
      if (result.errors && result.errors.length > 0 && (result.errors[0] as any).typeTokenString) {
        result.errors = result.errors.map(e => ({
          ...e,
          type: (e as any).typeTokenString,
          description: (e as any).lexeme
        }));
        console.log('[DEBUG] Patched errors:', result.errors);
      }
      setAnalysisResult(result);
      console.log('[DEBUG] AnalysisResult set:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = (): void => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    analysisResult,
    isLoading,
    error,
    analyze,
    clearResults,
  };
}; 