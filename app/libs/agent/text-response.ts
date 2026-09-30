// Resource routes are prerendered into static files, so the Content-Type here
// only matters in the dev server; the deployed types come from
// app/public/_headers.
const markdownResponse = (body: string) => new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })

const plainTextResponse = (body: string) => new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })

export { markdownResponse, plainTextResponse }
