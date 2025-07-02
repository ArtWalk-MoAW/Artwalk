import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SavedArtworkItem from "@/components/savedArtworkItem";
import {
  getSavedArtworks,
  getScannedArtworks,
} from "@/services/artworkService";
import DetailAnalysisView from "./DetailAnaysisView";

type Artwork = {
  id: string;
  title: string;
  location: string;
  description: string;
  img: string;
  latitude: number;
  longitude: number;
  type?: "map" | "scanned";
  originalJson?: any;
};

export default function SavedArtworkTabs() {
  const [index, setIndex] = useState(0);
  const [mapArtworks, setMapArtworks] = useState<Artwork[]>([]);
  const [scannedArtworks, setScannedArtworks] = useState<Artwork[]>([]);
  const [analysisViewData, setAnalysisViewData] = useState<{
    analysisResult: any;
    capturedImage: string;
  } | null>(null);

  const [routes] = useState([
    { key: "map", title: "Map Art" },
    { key: "scanned", title: "Scanned Art" },
    { key: "routes", title: "Routes" },
  ]);

  const loadData = async () => {
    try {
      const mapData = await getSavedArtworks();
      const scannedRaw = await getScannedArtworks();

      const scanned = scannedRaw.map((item: any) => ({
        id: item.id,
        title: item.artwork_analysis?.title || "Unbenannt",
        location: item.artist_info?.name || "Unbekannter Künstler",
        description:
          item.artwork_analysis?.interpretation || "Keine Beschreibung",
        img: item.captured_image,
        latitude: 0,
        longitude: 0,
        type: "scanned",
        originalJson: item,
      }));

      const mapped = mapData.map((item: any) => ({
        ...item,
        type: "map",
      }));

      setMapArtworks(mapped);
      setScannedArtworks(scanned);
    } catch (err) {
      console.error("Fehler beim Laden der Artworks:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderArtList = (data: Artwork[]) => {
    const isEmpty = data.length === 0;

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={
          isEmpty ? styles.emptyContentContainer : styles.container
        }
        renderItem={({ item }) => (
          <SavedArtworkItem
            id={item.id}
            title={item.title}
            location={item.location}
            description={item.description}
            img={item.img}
            onDeleted={loadData}
            latitude={item.latitude}
            longitude={item.longitude}
            type={item.type}
            originalJson={item.originalJson}
            onOpenAnalysis={() =>
              setAnalysisViewData({
                analysisResult: item.originalJson,
                capturedImage: item.img,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No saved Artworks within this category.
          </Text>
        }
      />
    );
  };

  const renderScene = SceneMap({
    map: () => renderArtList(mapArtworks),
    scanned: () => renderArtList(scannedArtworks),
    routes: () => (
      <View style={styles.emptyContentContainer}>
        <Text style={styles.emptyText}>No saved routes.</Text>
      </View>
    ),
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={styles.activeColor.color}
      inactiveColor={styles.inactiveColor.color}
      pressColor="transparent"
    />
  );

  if (analysisViewData) {
    return (
      <DetailAnalysisView
        analysisResult={analysisViewData.analysisResult}
        capturedImage={analysisViewData.capturedImage}
        onBack={() => setAnalysisViewData(null)}
      />
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={renderTabBar}
      style={styles.tabview}
    />
  );
}

const styles = StyleSheet.create({
  tabview: {
    marginTop: 0,
    backgroundColor: "#FFFEFC",
  },
  container: {
    paddingVertical: 5,
    backgroundColor: "#FFFEFC",
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFEFC",
  },
  separator: {
    height: 2,
    backgroundColor: "#1D0C02",
    width: "100%",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  tabBar: {
    backgroundColor: "#FFFEFC",
  },
  tabLabel: {
    fontWeight: "bold",
    color: "#000",
  },
  indicator: {
    backgroundColor: "#F95636",
  },
  activeColor: {
    color: "#F95636",
  },
  inactiveColor: {
    color: "#999",
  },
});
