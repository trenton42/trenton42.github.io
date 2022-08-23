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

  const out = {
    "message": "Hi there",
    "lucky_number": getRandomInt(13, 2007),
  }


  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}