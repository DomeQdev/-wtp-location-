import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import Main from './components/Main';

import "leaflet/dist/leaflet.css";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const { customMapStyle, mapStyle, darkTheme } = JSON.parse(localStorage.getItem("settings") || "{}");

    return <>
        <ThemeProvider theme={createTheme({ palette: { mode: darkTheme ? "dark" : "light" } })}>
            <MapContainer
                center={localStorage.bounds?.split(",") || [52.22983095298667, 21.0117354814593]}
                zoom={localStorage.zoom || 16}
                minZoom={7}
                maxZoom={18}
                zoomControl={false}
                style={{ width: "100%", height: "100vh" }}
            >
                {darkTheme ? <GlobalStyles styles={{
                    ".leaflet-tile": {
                        filter: "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)"
                    },
                    ":root": {
                        "--rsbs-backdrop-bg": "#1b1b1b",
                        "--rsbs-bg": "#1b1b1b"
                    },
                    "[data-rsbs-is-blocking='false'] [data-rsbs-overlay]": {
                        "color": "white"
                    }
                }} /> : null}
                <TileLayer url={MapStyle()} />
                <ZoomControl position="topright" />
                <Main />
            </MapContainer>
        </ThemeProvider>
        <ToastContainer
            position="top-center"
            autoClose={7500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            theme="dark"
            rtl={false}
            pauseOnFocusLoss={false}
            limit={5}
            draggable
            pauseOnHover={false}
        />
    </>;

    function MapStyle() {
        switch (mapStyle) {
            case "mapboxbasic":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsbx3mn001s14pape9nn2qq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapboxmonochrame":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc7iaf000115jq0rtti3k8/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapboxstreets":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc7ufs000e15mrqldtaa15/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapboxsatellite":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc8506000215jqervcjkbk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapboxnavigation":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc8ra900qs14l84la2zfpk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "gmaps":
                return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            case "gsat":
                return "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            case "gterrain":
                return "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
            case "custom":
                return customMapStyle;
            default:
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        };
    };
};

export default App;