import { Routes, Route } from "react-router-dom";
import Map from "../Map";

export default () => {
    return <Map city={"warsaw"}>
        <Routes>
            <Route path="/" element={<></>} />
            <Route path="/:type/:tab" element={<></>} />
            <Route path="/filter" element={<></>} />
        </Routes>
    </Map>;
};