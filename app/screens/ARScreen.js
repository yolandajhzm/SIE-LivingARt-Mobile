import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import HelloWorldSceneAR from './HelloWorldSceneAR';
import ReticleSceneAR from './ReticleSceneAR';
import { MeasureSceneAR } from './MeasureSceneAR';

const InitialScene = props => {
  const [rotation, setRotation] = useState(0);
  const objectRef = useRef(null);

  function _onRotate(rotateState, rotationFactor, source) {
    const scale = 0.1;
    if (rotateState == 2) {
      setRotation(prevRotation => prevRotation + rotationFactor * scale);
    }
  }

  let data = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />

      {data.flag === true ? (
        <Viro3DObject
          source={require('../assets/model3D/whiteChair/modern_chair11obj.obj')}
          resources={[
            require('../assets/model3D/whiteChair/modern_chair11obj.mtl'),
            require('../assets/model3D/whiteChair/0027.JPG'),
            require('../assets/model3D/whiteChair/unrawpText.JPG'),
          ]}
          position={[0, -1, -1]}
          scale={[0.02, 0.02, 0.02]}
          type="OBJ"
          onRotate={_onRotate}
        // rotation={[0, rotation, 0]}
        // dragType={'FixedToWorld'}

        // dragType="FixedToPlane"
        // dragPlane={{
        //   planePoint: [0, -2, 0],
        //   planeNormal: [0, 1, 0],
        //   maxDistance: 4
        // }}
        // onDrag={() => { }}
        />
      ) : (
        <ViroText
          text={'Object is Hidden'}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
        />
      )}
    </ViroARScene>
  );
};

function ARScreen({ navigation }) {
  const [flag, setFlag] = useState(false);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: ReticleSceneAR }}
        // initialScene={{ scene: InitialScene }}
        // initialScene={{ scene: MeasureSceneAR }}
        viroAppProps={{ flag: flag }}
        style={{ flex: 1 }}
      />

      <View style={styles.controlsView}>
        <TouchableOpacity onPress={() => setFlag(!flag)}>
          <Text style={{ fontSize: 30 }}>Reposition</Text>
        </TouchableOpacity>
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
