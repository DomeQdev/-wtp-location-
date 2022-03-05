import { useState } from 'react';
import { latLng } from 'leaflet';
import { Routes, Route } from "react-router-dom";
import { useMapEvents, useMap } from 'react-leaflet';
import VehicleMarker from './ActiveVehicle/VehicleMarker';
import ActiveVehicle from './ActiveVehicle';

const Vehicles = ({ vehicles }) => {
    const map = useMap();
    const [bounds, setBounds] = useState(map.getBounds());
    const { veh, line } = JSON.parse(localStorage.getItem('filter') || "{}");
    const { maxVehicles } = JSON.parse(localStorage.getItem('settings') || "{}");

    let filteredVehicles = veh?.length ? vehicles.filter(vehicle => veh.includes(`${vehicle.type}${vehicle.tab}`)) : vehicles;
    filteredVehicles = line?.length ? filteredVehicles.filter(vehicle => line.includes(vehicle.line)) : filteredVehicles;
    let vehiclesInBounds = filteredVehicles.filter(vehicle => bounds.contains(latLng(vehicle.location))).length;

    return (
        <>
            <Events />
            <Routes>
                <Route path="/" element={<>
                    {filteredVehicles.filter(vehicle => bounds.contains(latLng(vehicle.location)) && (vehiclesInBounds < (maxVehicles || 120) || map.getZoom() > 15)).map(vehicle => (
                        <VehicleMarker key={vehicle.trip} vehicle={vehicle} />
                    ))}
                </>} />
                <Route path="/:type/:tab" element={<ActiveVehicle vehicles={vehicles} />} />
            </Routes>
        </>
    );

    function Events() {
        useMapEvents({
            moveend: () => {
                setBounds(map.getBounds());
                localStorage.setItem("bounds", [map.getCenter().lat, map.getCenter().lng]);
                localStorage.setItem("zoom", map.getZoom());
            }
        });
        return null;
    }
}

export default Vehicles;