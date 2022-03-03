import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Vehicles from "./Vehicles";

const Main = () => {
    const [ vehicles, setVehicles ] = useState([]);
    const [ connected, setConnected ] = useState(false);

    useEffect(() => {
        if(connected) return;
        let wss = new WebSocket("wss://ws.domeqalt.repl.co");
        setConnected(true);

        fetch('/loadVehicles').then(res => res.json()).then(setVehicles);

        wss.onopen = () => {
            setConnected(true);
            toast.warning("Przybliż mapę aby zobaczyć pojazdy.");
        };
        wss.onmessage = ({ data }) => {
            let parsed = JSON.parse(data);
            if(!parsed.length) return toast.error(`Brak danych od UM Warszawa.`, {autoClose: 18500,closeOnClick: false,draggable: false});
            setVehicles(parsed);
        };
        wss.onclose = () => setConnected(false);
    }, [ connected ]);

    return <Vehicles vehicles={vehicles} />;
};

export default Main;