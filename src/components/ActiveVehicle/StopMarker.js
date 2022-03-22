import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export default function StopMarker({ stop, trip }) {
    return (
        <Marker
            position={stop.location}
            eventHandlers={{
                click: () => {}
            }}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker`} style={{ border: `3px solid ${trip.color}` }} title={`${stop.name} ${stop.on_request ? "(Ż)" : ""}`}></button>),
                iconSize: [30, 30],
                iconAnchor: [8, 7],
                popupAnchor: [0, -5]
            })}
            zIndexOffset={100}
        >
            <Popup autoPan={false}><b>{stop.name}</b></Popup>
        </Marker>
    );
}
