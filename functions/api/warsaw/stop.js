export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) return new Response("{error:true}", { status: 400 });

    return new Response(JSON.stringify({}));
};