import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MainCard from 'ui-component/cards/MainCard';
import MapsDialog from './mapModal';
import { useEvent, useGetTechnicienPLacement } from 'services/technicien-placement.service';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

const convertSVG = ({ color }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill="${color}"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`;

  const dataURI = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  return dataURI;
};
const MapComponent = ({ placement }) => {
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [open, setOpen] = React.useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const convertSVG = ({ color }) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill="${color}"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`;

    const dataURI = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

    return dataURI;
  };
  const handleMarkerClick = (user) => {
    setSelectedMarker(user);
    setOpen(true);
  };
  console.log(placement);
  useEffect(() => {
    // JSON data containing user information

    // Create the map when the component mounts
    const map = new Map({
      target: 'map', // The ID of the div element where the map should be rendered
      layers: [
        new TileLayer({
          source: new OSM() // OpenStreetMap as the base layer
        })
      ],
      view: new View({
        center: fromLonLat([2.3522, 48.8566]), // Center the map on a default location (e.g., Paris)
        zoom: 5 // Adjust the zoom level to show France properly
      })
    });

    // Create a vector source to hold the marker features
    const vectorSource = new VectorSource();

    // Loop through the user data and create markers

    const lat = placement?.emplacement?.latitude;
    const lng = placement?.emplacement?.longitude;
    const color = placement?.user?.couleur;
    // Create a feature for each user's marker
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
      user: placement?.user
    });

    // Customize the marker's style with the provided color
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          src: convertSVG({ color: color }),
          scale: 1.5
        })
      })
    );
    // Add a click event listener to the map to handle marker clicks

    // Add the marker feature to the vector source
    vectorSource.addFeature(markerFeature);

    // Create a vector layer to display the markers
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Add the vector layer to the map
    map.addLayer(vectorLayer);
    map.on('click', (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const user = feature.get('user');
        if (user) {
          setSelectedUser(user);
          handleMarkerClick(user);
        }
      });
    });

    // Clean up the map instance when the component unmounts
    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      {/* Pop-up */}
      {open && selectedMarker && (
        <MapsDialog user={selectedUser} />
        // <div
        //   style={{
        //     position: 'absolute',
        //     top: '50%',
        //     left: '50%',
        //     transform: 'translate(-50%, -50%)',
        //     backgroundColor: '#fff',
        //     padding: '10px',
        //     borderRadius: '5px',
        //     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
        //   }}
        // >
        //   <h3>{selectedMarker.name}</h3>
        //   <p>Email: {selectedMarker.email}</p>
        //   {/* <button onClick={closePopup}>Close</button> */}
        // </div>
      )}
    </div>
  );

  // return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

const PointageMaps = ({ technicienId }) => {
  const getTechnicienCurrentPlaceQuery = useGetTechnicienPLacement(technicienId);
  return (
    <MainCard
      title="Historique de Pointage des
    Techniciens"
      content={false}
      secondary={
        <LoadingButton
          loadingPosition="end"
          endIcon={<SendIcon />}
          loading={useGetTechnicienPLacement.isLoading}
          variant="contained"
          onClick={async () => {
            try {
              await getTechnicienCurrentPlaceQuery.refetch();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Actualiser
        </LoadingButton>
      }
    >
      {getTechnicienCurrentPlaceQuery?.isFetching === false && <MapComponent placement={getTechnicienCurrentPlaceQuery?.data} />}
    </MainCard>
  );
};
export default PointageMaps;
