import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '../../../lib/middleware/auth';
import { handleApiError } from '../../../lib/utils/error-handler';
import { chatService } from '../../../lib/db/supabase-service';
import { rateLimit } from '../../../lib/utils/rate-limit';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    rateLimit({
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      keyGenerator: (req) => req.user.id,
    })(req, res);
    
    const { method } = req;
    
    switch (method) {
      case 'GET':
        // Get all chats for the current user
        const chats = await chatService.getChats(req.user.id);
        return res.status(200).json(chats);
        
      case 'POST':
        // Create a new chat
        const { title } = req.body;
        
        if (!title) {
          return res.status(400).json({ error: 'Title is required' });
        }
        
        const newChat = await chatService.createChat({
          user_id: req.user.id,
          title,
        });
        
        return res.status(201).json(newChat);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

export default withAuth(handler); 