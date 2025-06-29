import React, { useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import savedCard from "@/components/savedArtworkItem";
import SavedArtworkItem from "@/components/savedArtworkItem";

type Artwork = {
  id: string; // Assuming you have an id for the artwork
  title: string;
  location: string;
  description: string;
  img: string;
};

type Props = {
  mapArtworks: Artwork[];
  scannedArtworks: Artwork[];
  onRefresh?: () => void;
};

export default function SavedArtworkTabs({
  mapArtworks,
  scannedArtworks,
  onRefresh = () => {},
}: Props) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "map", title: "Map Art" },
    { key: "scanned", title: "Scanned Art" },
    { key: "routes", title: "Routes" },
  ]);

  const renderArtList = (data: Artwork[]) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <SavedArtworkItem
          id={item.id}
          title={item.title}
          location={item.location}
          description={item.description}
          img={item.img}
          onDeleted={onRefresh}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Keine gespeicherten Orte in dieser Kategorie.
          </Text>
        </View>
      }
    />
  );

  const renderScene = SceneMap({
    map: () => renderArtList(mapArtworks),
    scanned: () => renderArtList(scannedArtworks),
    routes: () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Keine Routen gespeichert.</Text>
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
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "InstrumentSerif-Regular",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#555",
    fontFamily: "InstrumentSans",
  },
  separator: {
    height: 2,
    backgroundColor: "#1D0C02",
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
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
