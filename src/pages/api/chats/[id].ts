import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '../../../lib/middleware/auth';
import { handleApiError } from '../../../lib/utils/error-handler';
import { chatService } from '../../../lib/db/supabase-service';
import { rateLimit } from '../../../lib/utils/rate-limit';
import { validateUUID } from '../../../lib/utils/validation';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    rateLimit({
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      keyGenerator: (req) => req.user.id,
    })(req, res);
    
    const { method } = req;
    const { id } = req.query;
    
    // Validate the chat ID
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid chat ID' });
    }
    
    validateUUID(id);
    
    switch (method) {
      case 'GET':
        // Get a specific chat
        const chat = await chatService.getChat(id);
        
        // Check if the chat belongs to the current user
        if (chat.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        return res.status(200).json(chat);
        
      case 'PUT':
        // Update a chat
        const { title, is_archived } = req.body;
        
        // Get the chat first to check ownership
        const existingChat = await chatService.getChat(id);
        
        if (existingChat.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Update the chat
        const updatedChat = await chatService.updateChat(id, {
          ...(title !== undefined && { title }),
          ...(is_archived !== undefined && { is_archived }),
        });
        
        return res.status(200).json(updatedChat);
        
      case 'DELETE':
        // Delete a chat
        // Get the chat first to check ownership
        const chatToDelete = await chatService.getChat(id);
        
        if (chatToDelete.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        await chatService.deleteChat(id);
        
        return res.status(204).end();
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

export default withAuth(handler); 