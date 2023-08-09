import React from 'react';
import NavigationContainer from './app/navigation/NavigationContainer';
import { LogBox } from "react-native"
LogBox.ignoreAllLogs(true)
export default function App() {
  return (
    <NavigationContainer />
  );
}
