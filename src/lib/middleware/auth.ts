import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../supabase';

export type AuthenticatedRequest = NextApiRequest & {
  user: {
    id: string;
    email: string;
  };
};

export type ApiHandler<T = any> = (
  req: AuthenticatedRequest,
  res: NextApiResponse<T>
) => Promise<void | NextApiResponse<T>>;

export function withAuth<T = any>(handler: ApiHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse<T>) => {
    try {
      // Get the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' } as T);
      }

      // Extract the token
      const token = authHeader.replace('Bearer ', '');
      
      // Verify the token
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' } as T);
      }

      // Add the user to the request
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email || '',
      };

      // Call the handler
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' } as T);
    }
  };
} 