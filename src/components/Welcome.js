import { Box, FormControl, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const [city, setCity] = useState("");

    useEffect(() => {
        if (localStorage?.city) return navigate(`/${localStorage?.city}`);
    }, []);

    return <Box sx={{ height: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "4em" }}>👋</h1>
        <h1>Witaj!</h1>
        <h3>zbiorkom.live to serwis umożliwiający śledzenie pojazdów komunikacji miejskiej na żywo.</h3>
        <br />
        {page === 0 && <>
            <h2>Wybierz miasto:</h2>
            <FormControl>
                <RadioGroup value={city} onChange={({ target }) => setCity(target.value)}>
                    <FormControlLabel value="warsaw" control={<Radio />} label="Warszawa" />
                    <FormControlLabel value="gdansk" control={<Radio />} label="Gdańsk" />
                </RadioGroup>
            </FormControl>
        </>}
        {page === 1 && <></>}
        {page === 2 && <></>}

        <div style={{ padding: "30px" }}>
            <Button variant="contained" startIcon={<NavigateBefore />} disabled={page === 0} onClick={() => setPage(page - 1)}>
                Cofnij
            </Button>
            &nbsp;
            <Button variant="contained" endIcon={<NavigateNext />} disabled={(page === 0 && !city)} onClick={() => page === 2 ? save() : setPage(page + 1)}>
                {page === 2 ? "Zapisz" : "Dalej"}
            </Button>
        </div>
    </Box>

    function save() {
        localStorage.setItem("city", city);
        navigate(`/${city}`);
    }
};