import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import DeleteArtworkButton from "./DeleteArtwork";

type Props = {
  id: string; // Assuming you have an id for the artwork
  title: string;
  location: string;
  description: string;
  img: string;
  onDeleted: () => void;
};

export default function SavedArtworkItem({
  id,
  title,
  location,
  description,
  img,
  onDeleted,
}: Props) {
  return (
    <View style={styles.itemContainer}>
      <DeleteArtworkButton id={id} onDeleted={onDeleted} />

      <Image source={{ uri: img }} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{location}</Text>
        <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "InstrumentSerif-Regular",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#555",
    fontFamily: "InstrumentSans",
  },
  
});
