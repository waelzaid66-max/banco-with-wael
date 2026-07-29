/**
 * Cloudflare Workers stub for GitHub "Workers Builds: bancoo" status checks.
 *
 * Production API traffic is served by Coolify/Docker (see docker-compose.coolify.yml),
 * not by this worker. The stub exists so the connected Workers Builds project has a
 * valid wrangler entrypoint and stops failing every PR with "missing main".
 *
 * Do NOT attach custom domains to this worker without an explicit owner decision.
 */
export default {
  async fetch(_request: Request): Promise<Response> {
    return new Response(
      JSON.stringify({
        ok: true,
        service: "bancoo-workers-stub",
        message:
          "BANCO production API is Coolify-hosted. This Cloudflare Worker is a CI stub only.",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
      },
    );
  },
};
