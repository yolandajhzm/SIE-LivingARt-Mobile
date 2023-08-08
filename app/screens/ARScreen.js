import React, { useState, useRef } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroAmbientLight,
  Viro3DObject,
  ViroMaterials,
  ViroNode,
  ViroARPlaneSelector,
} from '@viro-community/react-viro';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReticleSceneAR from './ReticleSceneAR';


const downloadModelURL = 'https://cmu-sie.oss-us-west-1.aliyuncs.com/threeDModels/5925aee6-e13f-4035-aa82-b675d464d3b2whiteChair.zip';
const vendorDimensions = {
  length: 43,
  width: 42,
  height: 62,
}
console.log("downloadModelURL", downloadModelURL);

function ARScreen({ navigation }) {
  const [flag, setFlag] = useState(false);
  const [dimensions, setDimensions] = useState(vendorDimensions);
  const [modelURL, setModelURL] = useState(downloadModelURL)

  const [resizeOn, setResizeOn] = useState(true);
  const toggleSwitch = () => setResizeOn(previousState => !previousState);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: ReticleSceneAR }}
        viroAppProps={{ flag: flag, modelURL: modelURL, modelDimensions: dimensions, resizeOn: resizeOn }}
        style={{ flex: 1 }}
      />

      <View style={styles.controlsView}>
        <TouchableOpacity onPress={() => setFlag(!flag)}>
          <Text style={{ fontSize: 30 }}>Reposition</Text>
        </TouchableOpacity>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={resizeOn ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={!resizeOn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  controlsView: {
    width: '100%',
    height: 100,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ARScreen;
