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

// const downloadModelURL =
//   'https://cmu-sie.oss-us-west-1.aliyuncs.com/threeDModels/5925aee6-e13f-4035-aa82-b675d464d3b2whiteChair.zip';
// const vendorDimensions = {
//   length: 43,
//   width: 42,
//   height: 62,
// };

// console.log('downloadModelURL', downloadModelURL);

function ARScreen({ route, navigation }) {
  const downloadModelURL = route.params.model;
  const vendorDimensions = route.params.dimension;
  const [flag, setFlag] = useState(false);
  const [dimensions, setDimensions] = useState(vendorDimensions);
  const [modelURL, setModelURL] = useState(downloadModelURL);

  const [resizeOn, setResizeOn] = useState(true);
  const toggleSwitch = () => setResizeOn(previousState => !previousState);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: ReticleSceneAR }}
        viroAppProps={{ flag: flag, modelURL: modelURL, modelDimensions: dimensions, resizeOn: resizeOn }}
        style={styles.arView}
      />

      <View style={styles.controlsView}>
        <TouchableOpacity style={styles.reposBtn} onPress={() => setFlag(!flag)}>
          <Text style={{ fontSize: 30 }}>Reposition</Text>
        </TouchableOpacity>
        <Switch style={styles.toggleSwitch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={resizeOn ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={!resizeOn}
        />
        <Text style={styles.txtStyle}> Resize </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  arView: {
    position: 'relative',
  },
  controlsView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(52, 52, 52, 0.35)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleSwitch: {
    margin: 8,
  },
  reposBtn: {
    fontSize: 30,
    margin: 8,
  },
  txtStyle: {
    fontSize: 30
  }
});

export default ARScreen;
