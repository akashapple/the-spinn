import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only assign uploader if they are currently a plain "user" (default role)
    if (user.role === 'user') {
      await base44.asServiceRole.entities.User.update(user.id, { role: 'uploader' });
      return Response.json({ assigned: true });
    }

    return Response.json({ assigned: false, role: user.role });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});