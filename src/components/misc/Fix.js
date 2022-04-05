import { useEffect } from "react";

export default () => {
    useEffect(() => {
        localStorage.clear();
        document.cookie = "";
        setTimeout(() => window.location.href = "/", 1000);
    }, []);
    return <h1 style={{ textAlign: "center" }}>JESTEŚ GOTOW😊 DO NOWEJ WERSJI!</h1>;
}