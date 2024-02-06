export async function onRequest(context) {
    // Contents of context object
    // const {
    //   request, // same as existing Worker API
    //   env, // same as existing Worker API
    //   params, // if filename includes [id] or [[path]]
    //   waitUntil, // same as ctx.waitUntil in existing Worker API
    //   next, // used for middleware or to fetch assets
    //   data, // arbitrary space for passing data between middlewares
    // } = context;

    if (context.request.method == "POST") {
        const body = await getReqBody(context.request.body);
        await env.stuff.put(new Date().getTime().toString(), body);
    }
    return new Response("Hi there", { headers: { "Content-Type": "text/html" } });  
}

async function getReqBody(stream) {
    var out = "";
    for await (const chunk of stream) {
        out+=chunk
    }
    return out
}