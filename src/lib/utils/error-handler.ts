import { NextApiResponse } from 'next';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown, res: NextApiResponse) {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
  
  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string };
    
    if (supabaseError.code === '23505') {
      return res.status(409).json({
        error: 'Resource already exists',
      });
    }
    
    if (supabaseError.code === '23503') {
      return res.status(400).json({
        error: 'Referenced resource does not exist',
      });
    }
  }
  
  // Default error
  return res.status(500).json({
    error: 'Internal server error',
  });
} 