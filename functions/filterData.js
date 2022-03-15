export const onRequestGet = async ({ request }) => {
    let cache = caches.default;

    let response = await cache.match("filter");
    if(!response) {
        let data = await Promise.all([
            fetch("https://new-api.domeqalt.repl.co/all/routes", { cf: { cacheTtl: 86400, cacheEverything: true }, keepalive: true }).then(res => res.json()),
            fetch("https://new-api.domeqalt.repl.co/all/filter", { cf: { cacheTtl: 86400, cacheEverything: true }, keepalive: true }).then(res => res.json())
        ]);
        response = JSON.stringify({
            routes: data[0],
            ...data[1],
            time: Date.now()
        });
        cache.put("filter", response);
    }
    return new Response(response);
};