import React, { useState, useEffect } from 'react';
import { Country, State, City } from "country-state-city";
import { Grid, TextField, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';

const Rough4 = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            const statesList = State.getStatesOfCountry(selectedCountry); // Get states of selected country
            setStates(statesList);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            const citiesList = City.getCitiesOfState(selectedCountry, selectedState); // Get cities of selected state
            setCities(citiesList);
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountry]);

    return (
        <div>
            <h1>Profile Page</h1>

            {/* Grid layout for the form */}
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {/* Country Dropdown */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Select Country</InputLabel>
                            <Select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                label="Select Country"
                            >
                                <MenuItem value="">
                                    <em>Select Country</em>
                                </MenuItem>
                                {countries.map((country) => (
                                    <MenuItem key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* State Dropdown */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Select State</InputLabel>
                            <Select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                label="Select State"
                                disabled={!selectedCountry} // Disable if no country is selected
                            >
                                <MenuItem value="">
                                    <em>Select State</em>
                                </MenuItem>
                                {states.map((state) => (
                                    <MenuItem key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* City Dropdown */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Select City</InputLabel>
                            <Select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                label="Select City"
                                disabled={!selectedState} // Disable if no state is selected
                            >
                                <MenuItem value="">
                                    <em>Select City</em>
                                </MenuItem>
                                {cities.map((city) => (
                                    <MenuItem key={city.name} value={city.name}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Rough4;
