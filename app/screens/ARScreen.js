import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroAmbientLight,
  Viro3DObject,
  ViroMaterials,
  ViroNode,
} from '@viro-community/react-viro';
import {TouchableOpacity} from 'react-native-gesture-handler';

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

      {data.flag === 'show' ? (
        <ViroNode
          position={[0, -5, -5]}
          rotation={[0, rotation, 0]}
          dragType={'FixedToWorld'}
          onDrag={() => {}}
          ref={objectRef}>
          <Viro3DObject
            source={require('../assets/model3D/whiteChair/modern_chair11obj.obj')}
            position={[0, -5.1, -5]}
            scale={[0.05, 0.05, 0.05]}
            resources={[
              require('../assets/model3D/whiteChair/modern_chair11obj.mtl'),
              require('../assets/model3D/whiteChair/0027.JPG'),
              require('../assets/model3D/whiteChair/unrawpText.JPG'),
            ]}
            type="OBJ"
            onRotate={_onRotate}
          />
        </ViroNode>
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

function ARScreen({navigation}) {
  const [flag, setFlag] = useState('Hello World');

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{scene: InitialScene}}
        viroAppProps={{flag: flag}}
        style={{flex: 1}}
      />

      <View style={styles.controlsView}>
        <TouchableOpacity onPress={() => setFlag('show')}>
          <Text>Show</Text>
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
