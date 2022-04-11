import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, FormControl, TextField, Autocomplete, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DirectionsBus, Tram, Train } from '@mui/icons-material';

const Settings = () => {
    const navigate = useNavigate();

    const local = JSON.parse(localStorage.getItem('filter') || "{}");

    const [data, setData] = useState({
        routes: []
    });

    const [line, setLine] = useState(local?.line || []);

    // https://static.higenku.org/https://beta.freewifi.waw.pl/filterData
    useEffect(() => {
        let filter = JSON.parse(localStorage.getItem("filterData") || "{}");
        if(filter?.routes) return setData(filter);
        if(!filter || (Date.now() - filter?.timestamp || 0) < 86400000) fetch("/filterData").then(res => res.json()).then(data => {
            setData(data);
            localStorage.setItem("filterData", JSON.stringify({
                ...data,
                timestamp: Date.now()
            }));
        }).catch(() => navigate("/"));
    }, []);
    useEffect(() => setLine(local?.line ? local.line.map(l => data?.routes[l]) : []), [data]);

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
        <DialogTitle>Filtrowanie pojazdów</DialogTitle>
        <DialogContent dividers={true}>
            <DialogContentText tabIndex={-1} component={"div"}>
                <FormControl fullWidth>
                    {data?.routes ? <Autocomplete
                        multiple
                        fullWidth
                        disableCloseOnSelect
                        options={Object.values(data?.routes)}
                        value={line}
                        onChange={(event, newValue) => setLine(newValue)}
                        autoHighlight
                        getOptionLabel={(option) => option ? option[0] : null}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                {option[2] === "bus" ? <DirectionsBus style={{ fill: `#${option[3]}` }} /> : (option[2] === "tram" ? <Tram style={{ fill: `#${option[3]}` }} /> : <Train style={{ fill: `#${option[3]}` }} />)} {option[0]} {option[1]}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Sortowanie po linii"
                                type="text"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'off'
                                }}
                            />
                        )}
                    /> : null}
                </FormControl>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => navigate("/")}>Anuluj</Button>
            <Button onClick={() => {
                localStorage.setItem("filter", JSON.stringify({
                    line: line.map(x => x[0])
                }));
                navigate("/");
            }}>Zapisz</Button>
        </DialogActions>
    </Dialog>;
};

export default Settings;
