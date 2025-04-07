import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '../../../lib/middleware/auth';
import { handleApiError } from '../../../lib/utils/error-handler';
import { rateLimit } from '../../../lib/utils/rate-limit';
import { validateRequiredFields } from '../../../lib/utils/validation';
import { searchSimilarDocuments } from '../../../lib/pinecone-service';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    rateLimit({
      maxRequests: 50,
      windowMs: 60 * 1000, // 1 minute
      keyGenerator: (req) => req.user.id,
    })(req, res);
    
    const { method } = req;
    
    switch (method) {
      case 'GET':
        // Search for similar documents
        const { query } = req.query;
        
        if (typeof query !== 'string') {
          return res.status(400).json({ error: 'Query parameter must be a string' });
        }
        
        const results = await searchSimilarDocuments(query, req.user.id);
        return res.status(200).json(results);
        
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

export default withAuth(handler); 