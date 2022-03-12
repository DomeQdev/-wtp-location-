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
            setVehicles(parsed.map(x => ({
                line: x.line,
                type: x.type,
                location: x.location,
                deg: calcBearing(x.previous || [], x.location),
                brigade: x.brigade,
                tab: x.tab,
                lastPing: x.timestamp,
                trip: x.trip
            })));
            if(!parsed.length) return toast.error(`Nie otrzymano informacji zwrotnej o położeniu pojazdów.`, { autoClose: 12500, closeOnClick: false, draggable: false });
        };
        wss.onclose = () => {
            toast.error("Stracono połączenie z serwerem.")
            setConnected(false);
        };
    }, [ connected ]);

    useEffect(() => fetch('/loadVehicles').then(res => res.json()).then(setVehicles), []);

    return <Vehicles vehicles={vehicles} />;
};

export default Main;

function calcBearing(oldLocation, newLocation) {
    let deg = Math.atan2(newLocation[1] - oldLocation[1], newLocation[0] - oldLocation[0]) * 180 / Math.PI;
    return deg < 0 ? deg + 360 : deg;
}