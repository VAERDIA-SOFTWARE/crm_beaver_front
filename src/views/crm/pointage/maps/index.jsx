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

const convertSVG = ({ color }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill="${color}"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`;

  const dataURI = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  return dataURI;
};
const MapComponent = () => {
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [open, setOpen] = React.useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const convertSVG = ({ color }) => {
    console.log(color);
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill="${color}"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`;

    const dataURI = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    console.log(svgContent);

    return dataURI;
  };
  const handleMarkerClick = (user) => {
    setSelectedMarker(user);
    setOpen(true);
  };

  useEffect(() => {
    // JSON data containing user information
    const userData = {
      users: [
        {
          id: 1,
          name: 'John Doe',
          start_date: '22/05/2024',
          nomClient: 'test',
          fiche_name: 'test.pdf',
          email: 'john.doe@example.com',
          avatar: 'assets/images/profile/img-profile2.jpg',
          role: 'Technicien',
          marker: {
            lat: 45.8566,
            lng: 2.3522,
            color: '#000000',
            start_date: '22/05/2024',
            end_date: '22/05/2024',
            emplacement: 'Paris',
            emplacement_fin: undefined
          }
        },
        {
          id: 2,
          name: 'John ee',
          start_date: '22/05/2024',
          nomClient: 'test',
          fiche_name: 'test.pdf',
          email: 'john.doe@example.com',
          avatar: 'assets/images/profile/img-profile2.jpg',
          role: 'Technicien',

          marker: {
            lat: 49.8566,
            lng: 2.3522,
            color: '#ffffff',
            start_date: '22/05/2024',
            end_date: '22/05/2024',
            emplacement: 'Paris',
            emplacement_fin: undefined
          }
        },
        {
          id: 3,
          name: 'Alice Johnson',
          start_date: '22/05/2024',
          nomClient: 'test',
          fiche_name: 'test.pdf',
          email: 'alice.johnson@example.com',
          avatar: 'assets/images/profile/img-profile2.jpg',
          role: 'Technicien',

          marker: {
            lat: 48.8566,
            lng: 3.3522,
            color: '#ff0000',
            start_date: '22/05/2024',
            end_date: '22/05/2024',
            emplacement: 'Paris',
            emplacement_fin: undefined
          }
        },
        {
          id: 4,
          name: 'Bob Williams',
          nomClient: 'test',
          fiche_name: 'test.pdf',
          email: 'bob.williams@example.com',
          avatar: 'assets/images/profile/img-profile2.jpg',
          role: 'Technicien',
          marker: {
            lat: 46.8566,
            lng: 1.3522,
            color: '#00ff00',
            start_date: '22/05/2024',
            end_date: '22/05/2024',
            emplacement: 'Paris',
            emplacement_fin: undefined
          }
        }
        // Add more user objects here
      ]
    };

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
    userData.users.forEach((user) => {
      const { lat, lng, color } = user.marker;
      // Create a feature for each user's marker
      const markerFeature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
        user: user
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
    });

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
        <MapsDialog open={open} setOpen={setOpen} user={selectedUser} />
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

const PointageMaps = () => {
  return (
    <MainCard
      title="Historique de Pointage des 
          Techniciens"
      content={false}
    >
      <MapComponent />
    </MainCard>
  );
};
export default PointageMaps;
