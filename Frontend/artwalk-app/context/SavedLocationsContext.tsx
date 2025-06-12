import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LocationData } from '../components/LocationBottomSheet';

type SavedLocationsContextType = {
  saved: LocationData[];
  addLocation: (location: LocationData) => void;
};

const SavedLocationsContext = createContext<SavedLocationsContextType>({
  saved: [],
  addLocation: () => {},
});

export const useSavedLocations = () => useContext(SavedLocationsContext);

export const SavedLocationsProvider = ({ children }: { children: ReactNode }) => {
  const [saved, setSaved] = useState<LocationData[]>([]);

  const addLocation = (location: LocationData) => {
    setSaved((prev) =>
      prev.find((l) => l.title === location.title) ? prev : [...prev, location]
    );
  };

  return (
    <SavedLocationsContext.Provider value={{ saved, addLocation }}>
      {children}
    </SavedLocationsContext.Provider>
  );
};
