import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from './error-handler';
import { AuthenticatedRequest } from '../middleware/auth';

// Simple in-memory rate limiting
// In production, use Redis or another distributed cache
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: AuthenticatedRequest) => string;
}) {
  const { maxRequests, windowMs, keyGenerator } = options;
  
  return (req: AuthenticatedRequest, res: NextApiResponse) => {
    // Generate a key for the request
    const key = keyGenerator 
      ? keyGenerator(req)
      : req.user?.id || 
        req.headers['x-forwarded-for'] as string || 
        'anonymous';
    
    // Get the current time
    const now = Date.now();
    
    // Get the rate limit data for this key
    const rateLimitData = rateLimitStore.get(key);
    
    // If there's no data or the reset time has passed, create new data
    if (!rateLimitData || now > rateLimitData.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.floor((now + windowMs) / 1000));
      
      return;
    }
    
    // Increment the count
    rateLimitData.count++;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - rateLimitData.count));
    res.setHeader('X-RateLimit-Reset', Math.floor(rateLimitData.resetTime / 1000));
    
    // If the count exceeds the limit, throw an error
    if (rateLimitData.count > maxRequests) {
      throw new ApiError('Too many requests', 429);
    }
  };
} 