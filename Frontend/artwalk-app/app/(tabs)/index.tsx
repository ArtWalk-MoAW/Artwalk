import React from "react";
import { View, Text } from "react-native";
import { useState } from "react";
import { TextInput, Button } from "react-native";
import { StyleSheet } from "react-native";



export default function App() {
  const [command, setCommand] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [host, setHost] = useState<string>('localhost:8080');

  const sendCommand = async () => {
      try {
        const response = await fetch(`http://${host}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error(error);
        setMessage('Failed to execute command.');
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Architecture Demo App</Text>
      <Text style={styles.paragraph}>
        This is a simple demo app to illustrate communication between frontend 
        and backend.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a host and port"
        value={host}
        onChangeText={setHost}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Enter a command"
        value={command}
        onChangeText={setCommand}
        autoCapitalize='none'
      />
      <Button title="Send" onPress={sendCommand} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F69C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3A522D',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
    color: '#3A522D',
  },
  input: {
    height: 40,
    borderColor: '#3A522D',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: '#FFFFFF',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#3A522D',
  },
});