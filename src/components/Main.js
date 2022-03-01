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
        toast.warning("Przybliż mapę aby zobaczyć pojazdy.");

        fetch('https://ws.domeqalt.repl.co').then(res => res.json()).then(setVehicles);

        wss.onopen = () => setConnected(true);
        wss.onmessage = ({ data }) => {
            let parsed = JSON.parse(data);
            if(!parsed.length) return toast.error(`Przepraszamy, z powodu usterki po stronie UM Warszawa, nie otrzymujemy aktualnie danych o lokalizacji pojazdów.`, {autoClose: 18500,closeOnClick: false,draggable: false});
            toast.success(`Odświeżono dane o ${parsed.length} pojazdach.`, { autoClose: 400 });
            setVehicles(parsed);
        };
        wss.onclose = () => setConnected(false);
    }, [ connected ]);

    return <Vehicles vehicles={vehicles} />;
};

export default Main;