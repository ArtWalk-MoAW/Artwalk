import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

declare const require: {
  context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): any;
};

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
