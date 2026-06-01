import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, artist, channel, file_url } = await req.json();

    if (!title || !artist || !channel || !file_url) {
      return Response.json({ error: 'Missing required fields: title, artist, channel, file_url' }, { status: 400 });
    }

    const track = await base44.asServiceRole.entities.Track.create({
      title,
      artist,
      channel,
      file_url,
    });

    return Response.json({ track });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});