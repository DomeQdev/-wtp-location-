export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let tab = url.searchParams.get('tab');
    let type = url.searchParams.get('type');
    if (!tab || !type) return new Response("{error:true}", { status: 400 });

    let vehicles = await fetch("https://files.cloudgdansk.pl/d/otwarte-dane/ztm/baza-pojazdow.json", {
        cf: {
            cacheTtl: 86400,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!vehicles) return new Response("{error:true}", { status: 500 });

    let vehicleData = vehicles.find(v => v.nr_inwentarzowy === tab && v.rodzaj_pojazdu === (type === "bus" ? "Autobus" : "Tramwaj"));
    if (!vehicleData) return new Response("{error:true}", { status: 404 });

    let features = [];
    if (vehicleData.AED === "tak") features.push("AED");
    if (vehicleData.USB === "tak") features.push("USB");
    if (vehicleData.biletomat === "tak") features.push("automat biletowy");
    if (vehicleData.klimatyzacja === "tak") features.push("klimatyzacja");
    if (vehicleData.monitor_wewnetrzny === "tak") features.push("monitor wewnętrzny");
    if (vehicleData.monitoring === "tak") features.push("monitoring");
    if (vehicleData.pojazd_dwukierunkowy === "tak") features.push("pojazd dwukierunkowy");
    if (vehicleData.pojazd_zabytkowy === "tak") features.push("pojazd zabytkowy");
    if (vehicleData.przyklek === "tak") features.push("przyklęk");
    if (vehicleData.rampa_dla_wozkow === "tak") features.push("rampa");
    if (vehicleData.zapowiedzi_glosowe === "tak") features.push("zapowiedzi głosowe");
    features.push(vehicleData.typ_pojazdu);

    return new Response(JSON.stringify({
        tab: vehicleData.nr_inwentarzowy,
        type: vehicleData.rodzaj_pojazdu === "Autobus" ? "bus" : "tram",
        brand: vehicleData.marka,
        model: vehicleData.model,
        prodYear: vehicleData.rok_produkcji,
        carrier: vehicleData.operator_przewoznik,
        doors: vehicleData.drzwi_pasazerskie,
        seats: vehicleData.liczba_miejsc_siedzacych,
        length: `${vehicleData.dlugosc}m`,
        bikes: vehicleData.mocowanie_rowerow,
        patron: vehicleData.patron,
        features
    }));
};