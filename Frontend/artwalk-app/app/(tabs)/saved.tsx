import React from "react";
import { View, Text } from "react-native";
import { useState } from "react";
import { TextInput, Button } from "react-native";
import { StyleSheet } from "react-native";



export default function App() {


  return (
    <View style={styles.container}>
      <Text>My Saves</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFEFC',
    
  },
  
});