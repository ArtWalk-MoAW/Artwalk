import React from 'react';
import { Marker } from 'react-native-maps';

type LocationMarkerProps = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
 
};

const LocationMarker: React.FC<LocationMarkerProps> = ({ id, title, latitude, longitude, address, }) => (
  <Marker
    key={id}
    coordinate={{ latitude, longitude }}
    title={title}
    description={address}
    
  />
);

export default LocationMarker;
