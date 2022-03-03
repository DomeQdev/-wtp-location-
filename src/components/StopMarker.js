import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function StopMarker({ vehicle, stop, trip }) {
    const { properties, geometry } = nearest(stop.location);
    console.log(properties, geometry)

    return (
        <Marker
            key={stop.stop_id}
            position={properties?.dist < 30 ? geometry?.coordinates : stop.locatiom}
            eventHandlers={{
                click: () => {}
            }}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker`} title={`${stop.name} ${stop.on_request ? "(Ż)" : ""}`}></button>),
                iconSize: [30, 30],
                iconAnchor: [4.8, 5],
                popupAnchor: [0, -5]
            })}
            zIndexOffset={100}
        >
            <Popup autoPan={false}><b>{stop.name}</b></Popup>
        </Marker>
    );

    function nearest(location) {
        if (typeof location !== "object" || !trip) return null;
        return nearestPointOnLine(lineString(trip?.shapes), point(location), { units: 'meters' });
    }
}
