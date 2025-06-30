import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type RouteFormData = {
  name: string;
  district: string;
  max_minutes: string;
  num_stops: string;
  styles?: string[];
};

type ArtworkEntry = {
  id: string;
  image: string;
  style?: string[];
  [key: string]: any;
};

type RouteFormContextType = {
  formData: RouteFormData;
  setFormData: (data: Partial<RouteFormData>) => void;
  resetForm: () => void;
  artworks: ArtworkEntry[];
  route: any[];
  setRoute: (data: any[]) => void;
};

const RouteFormContext = createContext<RouteFormContextType | undefined>(undefined);

export const RouteFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormDataState] = useState<RouteFormData>({
    name: "",
    district: "",
    max_minutes: "",
    num_stops: "",
    styles: undefined,
  });

  const [artworks, setArtworks] = useState<ArtworkEntry[]>([]);
  const [route, setRoute] = useState<any[]>([]);

  const setFormData = (data: Partial<RouteFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormDataState({
      name: "",
      district: "",
      max_minutes: "",
      num_stops: "",
      styles: undefined,
    });
    setArtworks([]);
    setRoute([]);
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/get-exhibitions`);
        const data = await res.json();
        setArtworks(data);
      } catch (err) {
        console.error("Fehler beim Laden der Artwork-Daten:", err);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <RouteFormContext.Provider value={{ formData, setFormData, resetForm, artworks, route, setRoute }}>
      {children}
    </RouteFormContext.Provider>
  );
};

export const useRouteForm = () => {
  const context = useContext(RouteFormContext);
  if (!context) {
    throw new Error("useRouteForm must be used within a RouteFormProvider");
  }
  return context;
};