export const onRequestGet = async ({ request }) => {
    let data = await Promise.all([
        fetch("https://old-api.matfiu.repl.co/all/routes", { cf: { cacheTtl: 86400, cacheEverything: true }, keepalive: true }).then(res => res.json()),
        fetch("https://old-api.matfiu.repl.co/all/filter", { cf: { cacheTtl: 86400, cacheEverything: true }, keepalive: true }).then(res => res.json())
    ]);
    return new Response(JSON.stringify({
        routes: data[0],
        ...data[1]
    }));
};
