export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) return new Response("{error:true}", { status: 400 });

    let busstopId = id.slice(0, 4);
    let busstopNr = id.slice(4, 6);

    let lines = await rfetch(`https://api.um.warszawa.pl/api/action/dbtimetable_get/?id=88cd555f-6f31-43ca-9de4-66c479ad5942&busstopId=${busstopId}&busstopNr=${busstopNr}&apikey=20cafce4-8100-4f16-96ce-d0c0ffec122c`, {
        cf: {
            cacheTtl: 86400,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!lines) return new Response("{error:true}", { status: 500 });

    let res = Promise.all(lines.result.map(async(val) => {
        return rfetch(`https://api.um.warszawa.pl/api/action/dbtimetable_get/?id=e923fa0e-d96c-43f9-ae6e-60518c9f3238&busstopId=${busstopId}&busstopNr=${busstopNr}&line=${val.values[0].value}&apikey=20cafce4-8100-4f16-96ce-d0c0ffec122c`).then(res => res.json()).then(res => {
            return res.result.filter(({ values }) => czas(values[5].value) > Date.now() - (10 * 60 * 1000)).map(({ values }) => {
                return {
                    line: val.values[0].value,
                    type: val.values[0].value.length === 3 ? "bus" : "tram",
                    brigade: values[2].value,
                    headsign: values[3].value,
                    delay: null,
                    realTime: null,
                    scheduledTime: czas(values[5].value),
                    vehicle: null,
                    trip: null
                }
            });
        }).catch(() => null);
    }));

    return new Response(JSON.stringify(res));
};

async function rfetch(url, limit = 10) {
    let res = await fetch(url).catch(() => null);
    if (res) return (new JSDOM(await res.text())).window.document;
    if (limit === 0) return null;
    console.log(`Retry: ${url} | Left: ${limit}`)
    return fetch(url, limit - 1);
}

function czas(time) {
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    return new Date().setHours(0, 0, 0, 0) + ((hours * 60 + minutes) * 60 * 1000);
}