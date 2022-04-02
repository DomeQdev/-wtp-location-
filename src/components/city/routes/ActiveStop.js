import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default ({ city }) => {
    const { id } = useParams();
    const [departures, setDepartures] = useState([]);

    useEffect(() => {
        fetch(`/api/${city}/stop?id=${id}`).then(res => res.json()).then(setDepartures).catch(() => null);
    }, []);

    return <></>;
};