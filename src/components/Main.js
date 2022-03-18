import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Vehicles from "./Vehicles";

const Main = () => {
    const [ vehicles, setVehicles ] = useState([]);
    const [ connected, setConnected ] = useState(false);

    useEffect(() => {
        if(connected) return;
        let wss = new WebSocket("wss://ws.domeqalt.repl.co");

        wss.onopen = () => {
            setConnected(true);
            toast.warning("Przybliż mapę aby zobaczyć pojazdy.");
        };
        wss.onmessage = ({ data }) => {
            let parsed = JSON.parse(data);
            if(!parsed.length) return;
            setVehicles(parsed.map(x => ({
                line: x.line,
                type: x.type,
                location: x.location,
                deg: calcBearing(x.previous || [], x.location) || x.deg,
                brigade: x.brigade,
                tab: x.tab,
                lastPing: x.timestamp,
                trip: x.trip
            })));
        };
        wss.onclose = () => setConnected(false);
    }, [ connected ]);

    useEffect(() => fetch('/loadVehicles').then(res => res.json()).then(setVehicles), []);

    return <Vehicles vehicles={vehicles} />;
};

export default Main;

function calcBearing(oldLocation, newLocation) {
    let deg = Math.atan2(newLocation[1] - oldLocation[1], newLocation[0] - oldLocation[0]) * 180 / Math.PI;
    return deg < 0 ? deg + 360 : deg;
}