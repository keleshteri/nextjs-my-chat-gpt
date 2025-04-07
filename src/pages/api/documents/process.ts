import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '../../../lib/middleware/auth';
import { handleApiError } from '../../../lib/utils/error-handler';
import { rateLimit } from '../../../lib/utils/rate-limit';
import { validateRequiredFields } from '../../../lib/utils/validation';
import { processDocument } from '../../../lib/pinecone-service';
import { documentService } from '../../../lib/db/supabase-service';

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
      case 'POST':
        // Process a document
        const { documentId } = req.body;
        
        validateRequiredFields(req.body, ['documentId']);
        
        // Get the document
        const document = await documentService.getDocument(documentId);
        
        // Check if the document belongs to the current user
        if (document.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Process the document
        const embeddingRecord = await processDocument(
          documentId,
          document.content,
          {
            user_id: req.user.id,
            title: document.title,
          }
        );
        
        return res.status(200).json(embeddingRecord);
        
      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

export default withAuth(handler); 