import { Routes, Route } from "react-router-dom";
import Map from "../Map";

export default () => {
    return <Map city={"gdansk"}>
        <Routes>
            <Route path="/" element={<></>} />
            <Route path="/:type/:tab" element={<></>} />
            <Route path="/filter" element={<></>} />
        </Routes>
    </Map>;
};