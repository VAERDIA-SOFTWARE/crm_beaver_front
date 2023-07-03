import PropTypes from 'prop-types';

// material-ui
import { Divider, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';

// third party

// project imports
import MainCard from 'ui-component/cards/MainCard';

import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM.js';
import { useEffect } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useQueryClient } from '@tanstack/react-query';

const HistoriqueCard = ({ title, data, style, map, chantierData }) => {
  useEffect(() => {
    let map = null;
    if (chantierData?.localisation?.location) {
      const iconFeature = new Feature({
        // geometry: new Point([0, 0]),
        geometry: new Point(
          fromLonLat([parseInt(chantierData?.localisation?.location?.longitude), parseInt(chantierData?.localisation?.location?.latitude)])
        ),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      });

      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'data/icon.png'
        })
      });

      // iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature]
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      map = new Map({
        target: 'map',
        // controls: Control.defaults({ attribution: false }),
        layers: [
          new TileLayer({
            source: new OSM({
              attributions: false
            })

            // source: new XYZ({
            //   url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            // })
          }),
          vectorLayer
        ],
        view: new View({
          // center: [0, 0],
          center: fromLonLat([
            parseInt(chantierData?.localisation?.location?.longitude),
            parseInt(chantierData?.localisation?.location?.latitude)
          ]),
          zoom: 12
        })
      });
    }

    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, [chantierData?.localisation?.location]);

  return (
    <MainCard title={title} content={false}>
      {map && chantierData?.localisation?.location && (
        <div
          id="map"
          style={{
            width: '100%',
            height: 300
          }}
          tabindex="0"
        ></div>
      )}

      <div style={{ height: 890, overflow: 'auto', ...style }}>
        <List
          component="nav"
          aria-label="main mailbox folders"
          sx={{
            '& svg': {
              width: 32,
              my: -0.75,
              ml: -0.75,
              mr: 0.75
            }
          }}
        >
          {Array.isArray(data) &&
            data?.map((e) => (
              <>
                <ListItemButton>
                  {/* <ListItemIcon>
                  <ArrowDropUpIcon sx={successSX} />
                </ListItemIcon> */}
                  <ListItemText
                    primary={
                      <Stack
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography sx={{ textAlign: 'center' }} variant="h6">
                          {e?.titre || e?.nom}
                        </Typography>
                        <Typography
                          style={{
                            color: 'rgb(13 102 125)'
                          }}
                          // variant="h6"
                          // sx={successSX}
                        >
                          {e?.date}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
                <Divider />
              </>
            ))}

          {/* <ListItemButton>
            <ListItemIcon>
              <ArrowDropDownIcon sx={errorSX} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <span>Ethereum</span>
                  <Typography sx={errorSX}>- $6.368</Typography>
                </Stack>
              }
            />
          </ListItemButton> */}
        </List>
      </div>
    </MainCard>
  );
};

HistoriqueCard.propTypes = {
  title: PropTypes.string
};

export default HistoriqueCard;
