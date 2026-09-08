import { createFileRoute } from '@tanstack/react-router';
import { handleLead } from '@/lib/crm/handler.server.mjs';
export const Route = createFileRoute('/api/leads')({server:{handlers:{POST:({request})=>handleLead(request)}}});
