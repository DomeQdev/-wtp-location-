import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const ActiveVehicle = ({ vehicles }) => {
    const navigate = useNavigate();
    const { tab, type } = useParams();
    const [ activeVehicle, setActiveVehicle ] = useState(null);

    useEffect(() => {
        if(!vehicles.length) return;

        let v = vehicles.find(vehicle => vehicle.tab === tab && vehicle.type === type);
        if(!v) {
            toast.error(activeVehicle ? "Utracono połącznie z pojazdem." : "Nie znaleziono pojazdu.");
            return navigate("/");
        };
        setActiveVehicle(v);
    }, [ vehicles ]);
    return <></>;
};

export default ActiveVehicle;