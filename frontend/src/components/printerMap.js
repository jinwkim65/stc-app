import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import LocationDialog from "./locationDialog"
import axios from 'axios';

export function PrinterMap() {
    const style = {
        height: "600px",
        width: "100%"
    };
    const center = {
        lat: 41.3117,
        lng: -72.9256
    };
    
    const [markers, setMarkers] = useState(null);
    const [printers, setPrinters] = useState([]);
    const [loadState, setLoadState] = useState(true);
    const [selectedPrinter, setSelectedPrinter] = useState(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        const fetchPrinters = async () => {
        try{
            await axios.get('http://127.0.0.1:5000/printers')
            .then(response => {
                setPrinters(response.data);
                setLoadState(false);
            });
        }
        catch (error) {
            console.error('Error fetching printer data:', error);
            setLoadState(false);
        }}
        fetchPrinters();
    }, []);

    useEffect(() => {
        const geocodeAddress = address => {
            return new Promise((resolve, reject) => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    resolve(location);
                } else {
                    console.error('Address not found:' + address);
                    resolve(undefined);
                }
                });
            });
        };
        const geocodeAddresses = async () => {
            if (!loadState && isLoaded) {
                const promises = printers.map(async item => {
                const location = await geocodeAddress(item.addr);
                return (
                    <Marker
                    key={item.loc}
                    position={location}
                    icon={'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
                    onClick={() => handleMarkerClick(item)}
                    />
                );
            });
            const resolvedMarkers = await Promise.all(promises);
            setMarkers(resolvedMarkers);
            }
        };
    geocodeAddresses();
    }, [printers, loadState, isLoaded]);

    const handleMarkerClick = (printer) => {
        setSelectedPrinter(printer);
    };
    
    const handleDialogClose = () => {
        setSelectedPrinter(null);
    };

    return (
        <>
            {isLoaded ? (
            <GoogleMap mapContainerStyle={style} zoom={15} center={center} options={{ disableDefaultUI: true }}>
            {markers}
            </GoogleMap>
            ) : (
            <div>Loading</div>
            )   
        }
        {selectedPrinter && <LocationDialog item={selectedPrinter} onClose={handleDialogClose} />}
        </>
    )
};

export default PrinterMap;