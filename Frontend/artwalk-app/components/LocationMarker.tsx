import React from 'react';
import { Marker } from 'react-native-maps';
import { LocationBottomSheetRef } from './LocationBottomSheet';

type Props = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  image: string;
  bottomSheetRef: React.RefObject<LocationBottomSheetRef | null>;
};

const LocationMarker: React.FC<Props> = ({
  id,
  title,
  latitude,
  longitude,
  address,
  description,
  image,
  bottomSheetRef,
}) => {
  const handlePress = () => {
    bottomSheetRef.current?.open({
      title,
      address,
      description,
      image,
    });
  };

  return (
    <Marker
      key={id}
      coordinate={{ latitude, longitude }}
      title={title}
      description={address}
      pinColor="#F95636"
      onPress={handlePress}
    />
  );
};

export default LocationMarker;

