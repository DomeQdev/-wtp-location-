import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, InputLabel, FormControl, TextField, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
    const navigate = useNavigate();
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    const [mapStyle, setMapStyle] = useState(settings.mapStyle || "osmdefault");
    const [customMapStyle, setCustomMapStyle] = useState(settings.customMapStyle || "");

    return <Dialog
        open={true}
        onClose={() => navigate("/")}
        scroll={'paper'}
        PaperProps={{
            style: {
                width: "100%"
            },
        }}
    >
        <DialogTitle>Ustawienia</DialogTitle>
        <DialogContent dividers={true}>
            <DialogContentText tabIndex={-1} component={"div"}>
                <FormControl fullWidth>
                    <InputLabel>Styl mapy</InputLabel>
                    <Select
                        value={mapStyle}
                        label="Styl mapy"
                        onChange={({ target }) => setMapStyle(target.value)}
                    >
                        <MenuItem value="osmdefault">OSM Default</MenuItem>
                        <MenuItem value="mapboxbasic">Mapbox Basic</MenuItem>
                        <MenuItem value="mapboxstreets">Mapbox Streets</MenuItem>
                        <MenuItem value="mapboxsatellite">Mapbox Satellite</MenuItem>
                        <MenuItem value="mapboxnavigation">Mapbox Navigation</MenuItem>
                        <MenuItem value="gmaps">Google Maps</MenuItem>
                        <MenuItem value="gsat">Google Maps Satellite</MenuItem>
                        <MenuItem value="gterrain">Google Maps Terrain</MenuItem>
                        <MenuItem value="custom">Własna mapa (zaawansowane)</MenuItem>
                    </Select>
                    {mapStyle === "custom" ? <><TextField
                        autoFocus
                        margin="dense"
                        label="Tile Layer URL"
                        placeholder='https://moja_mapa.org/{z}/{x}/{y}.png'
                        type="url"
                        fullWidth
                        variant="standard"
                        value={customMapStyle}
                        onChange={({ target }) => setCustomMapStyle(target.value)}
                    /><b>Jest to funkcja przeznaczona dla osób, które hostują własne mapy!</b><p>Link powinien zawierać {`{x}, {y} i {z}`} aby wszystko poprawnie działało. Link nie jest sprawdzany pod względem poprawności.</p></> : null}
                </FormControl>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => navigate("/")}>Anuluj</Button>
            <Button onClick={() => {
                if (mapStyle === "custom" && !customMapStyle) return toast.error("Podaj link do spersonalizowanej mapy lub zmień styl mapy.");
                localStorage.setItem("settings", JSON.stringify({
                    mapStyle,
                    customMapStyle: mapStyle === "custom" ? customMapStyle : null,
                }));
                navigate("/");
                window.location.reload();
            }}>Zapisz</Button>
        </DialogActions>
    </Dialog>;
};

export default Settings;