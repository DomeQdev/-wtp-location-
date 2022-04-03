import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Map from "./components/misc/Map";
import Warsaw from "./components/city/Warsaw";
import Gdansk from "./components/city/Gdansk";
import Welcome from "./components/Welcome";

import 'react-toastify/dist/ReactToastify.css';
import "react-spring-bottom-sheet/dist/style.css"
import 'react-leaflet-markercluster/dist/styles.min.css';

export default () => {
    let darkTheme = JSON.parse(localStorage?.darkTheme || "false");

    return <>
        <ThemeProvider theme={createTheme({ palette: { mode: darkTheme && localStorage?.city ? "dark" : "light" } })}>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/warsaw/*" element={<Map city={"warsaw"}><Warsaw /></Map>} />
                <Route path="/gdansk/*" element={<Map city={"gdansk"}><Gdansk /></Map>} />
                <Route path="*" element={<Welcome />} />
            </Routes>
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
        </ThemeProvider>
    </>;
};