import { Box, FormControl, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Toggle } from "./misc/Switch";

export default () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const [city, setCity] = useState(null);
    const [mapStyle, setMapStyle] = useState("gmaps");
    const [customMapStyle, setCustomMapStyle] = useState(null);
    const [grouping, setGrouping] = useState(false);
    const [showBrigade, setShowBrigade] = useState(false);
    const [showVehicleInfo, setShowVehicleInfo] = useState(false);

    useEffect(() => {
        if (localStorage?.city) return navigate(`/${localStorage?.city}`);
    }, []);

    return <Box sx={{ height: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "4em" }}>👋</h1>
        <h1>Witaj!</h1>
        <h3>zbiorkom.live to serwis umożliwiający śledzenie pojazdów komunikacji miejskiej na żywo.</h3>
        <br />
        {page === 0 && <>
            <h2>Wybierz miasto:</h2>
            <FormControl>
                <RadioGroup value={city} onChange={({ target }) => setCity(target.value)}>
                    <FormControlLabel value="warsaw" control={<Radio />} label="Warszawa" />
                    <FormControlLabel value="gdansk" control={<Radio />} label="Trójmiasto" />
                </RadioGroup>
            </FormControl>
        </>}
        {page === 1 && <>
            <h2>Wybierz styl mapy:</h2>
            <FormControl>
                <RadioGroup value={mapStyle} onChange={({ target }) => {
                    if (target.value === "custom") {
                        let val = prompt("Wpisz link do własnej mapy.\n\nPrzykład: https://moja_mapa.org/{z}/{x}/{y}.png");
                        if (!val || !val.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/g)) return toast.error("Niepoprawny link do mapy.");
                        setCustomMapStyle(val);
                    }
                    setMapStyle(target.value);
                }}>
                    <FormControlLabel value="gmaps" control={<Radio />} label="Google Maps" />
                    <FormControlLabel value="gsat" control={<Radio />} label="Google Satelita" />
                    <FormControlLabel value="osm" control={<Radio />} label="OpenStreetMap" />
                    <FormControlLabel value="mapbox" control={<Radio />} label="Mapbox" />
                    <FormControlLabel value="mapstr" control={<Radio />} label="Mapbox Streets" />
                    <FormControlLabel value="mapnav" control={<Radio />} label="Mapbox Navigation" />
                    <FormControlLabel value="mapsat" control={<Radio />} label="Mapbox Satelita" />
                    <FormControlLabel value="custom" control={<Radio />} label={mapStyle === "custom" && customMapStyle ? customMapStyle : "Własna mapa"} />
                </RadioGroup>
            </FormControl>
        </>}
        {page === 2 && <>
            <h2>Już prawie!</h2>
            <FormControlLabel
                control={<Toggle sx={{ m: 1 }} checked={grouping} onChange={() => setGrouping(!grouping)} />}
                label="Grupowanie pojazdów"
            />
            <br />
            <FormControlLabel
                control={<Toggle sx={{ m: 1 }} checked={showBrigade} onChange={() => setShowBrigade(!showBrigade)} />}
                label="Pokazuj brygady pojazdów"
            />
            <br />
            <FormControlLabel
                control={<Toggle sx={{ m: 1 }} checked={showVehicleInfo} onChange={() => setShowVehicleInfo(!showVehicleInfo)} />}
                label="Tylko informacje o pojeździe"
            />
        </>}

        <div style={{ padding: "30px" }}>
            <Button variant="contained" startIcon={<NavigateBefore />} disabled={page === 0} onClick={() => setPage(page - 1)}>
                Cofnij
            </Button>
            &nbsp;
            <Button variant="contained" endIcon={<NavigateNext />} disabled={(page === 0 && !city)} onClick={() => page === 2 ? save() : setPage(page + 1)}>
                {page === 2 ? "Zapisz" : "Dalej"}
            </Button>
        </div>
    </Box>

    function save() {
        localStorage.setItem("city", city);
        localStorage.setItem("mapStyle", mapStyle);
        localStorage.setItem("customMapStyle", mapStyle === "custom" ? customMapStyle : null);
        localStorage.setItem("grouping", grouping);
        localStorage.setItem("showBrigade", showBrigade);
        localStorage.setItem("showVehicleInfo", showVehicleInfo);
        navigate(`/${city}`);
    }
};