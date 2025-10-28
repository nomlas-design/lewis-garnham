import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify the webhook secret for security
    const authHeader = request.headers.get('authorization');
    const expectedSecret = import.meta.env.SANITY_REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error('SANITY_REVALIDATE_SECRET is not configured');
      return new Response(
        JSON.stringify({
          message: 'Revalidation secret not configured',
          revalidated: false
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check authorization header (format: "Bearer YOUR_SECRET")
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      console.error('Unauthorized revalidation attempt');
      return new Response(
        JSON.stringify({
          message: 'Unauthorized',
          revalidated: false
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    console.log('Revalidation triggered for:', body._type || 'unknown type');

    // For Vercel ISR with Astro, we need to manually purge the cache
    // This can be done by setting appropriate cache headers in the response
    // However, Astro + Vercel ISR doesn't have built-in programmatic revalidation
    // So we'll trigger a build hook instead (more reliable)

    const vercelDeployHook = import.meta.env.VERCEL_DEPLOY_HOOK_URL;

    if (vercelDeployHook) {
      // Trigger a new deployment to clear cache
      const deployResponse = await fetch(vercelDeployHook, {
        method: 'POST',
      });

      if (!deployResponse.ok) {
        throw new Error(`Deploy hook failed: ${deployResponse.statusText}`);
      }

      console.log('Deploy hook triggered successfully');

      return new Response(
        JSON.stringify({
          message: 'Revalidation triggered via deploy hook',
          revalidated: true,
          type: body._type
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If no deploy hook is configured, return success anyway
    // (cache will still expire based on ISR settings)
    return new Response(
      JSON.stringify({
        message: 'Webhook received (deploy hook not configured)',
        revalidated: false,
        type: body._type
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Revalidation error:', error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : 'Internal server error',
        revalidated: false
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Disable prerendering for this endpoint
export const prerender = false;
