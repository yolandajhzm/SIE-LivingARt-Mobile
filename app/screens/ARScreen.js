import React from 'react';
import { View, Text } from 'react-native';

function ARScreen({ route, navigation }) {
  const models  = route.params.threeModels;
  console.log(models)
    return (
        <View>
            <Text>AR Screen</Text>
        </View>
    );}
    export default ARScreen;

// import React, {useState, useRef, useEffect} from 'react';
// import {View, Text, StyleSheet} from 'react-native';
// import {
//   ViroARScene,
//   ViroText,
//   ViroARSceneNavigator,
//   ViroAmbientLight,
//   Viro3DObject,
//   ViroMaterials,
//   ViroNode,
//   ViroARPlaneSelector,
// } from '@viro-community/react-viro';
// import {TouchableOpacity} from 'react-native-gesture-handler';
// import HelloWorldSceneAR from './HelloWorldSceneAR';
// import ReticleSceneAR from './ReticleSceneAR';
// import RNFS from 'react-native-fs';
// import unzip from 'react-native-zip-archive';

// async function fetchAndUnzip(fromUrl) {
//   const zipFilePath = `${RNFS.DocumentDirectoryPath}/model.zip`; // path where the downloaded zip file should be stored
//   const targetPath = `${RNFS.DocumentDirectoryPath}/model`; // path where the unzipped files should be stored

//   try {
//     const {jobId, promise} = RNFS.downloadFile({
//       fromUrl: fromUrl, // use the argument as the URL
//       toFile: zipFilePath,
//     });

//     await promise; // wait for the file to finish downloading
//     console.log(`download completed at ${zipFilePath}`);

//     await unzip(zipFilePath, targetPath); // unzip the downloaded file
//     console.log(`unzip completed at ${targetPath}`);
//   } catch (err) {
//     console.error(err);
//   }
// }

// const InitialScene = props => {
//   const [rotation, setRotation] = useState(0);
//   const objectRef = useRef(null);

//   const [objectSource, setObjectSource] = useState(null);
//   const [resources, setResources] = useState([]);

//   useEffect(() => {
//     fetchAndUnzip().then(() => {
//       // Assuming the unzipped files are named as `model.obj` and `texture.jpg`
//       setObjectSource({
//         uri: `file://${RNFS.DocumentDirectoryPath}/model/model.obj`,
//       });
//       setResources([
//         {uri: `file://${RNFS.DocumentDirectoryPath}/model/texture.jpg`},
//       ]);
//     });
//   }, []);

//   function _onRotate(rotateState, rotationFactor, source) {
//     const scale = 0.1;
//     if (rotateState == 2) {
//       setRotation(prevRotation => prevRotation + rotationFactor * scale);
//     }
//   }

//   let data = props.sceneNavigator.viroAppProps;

//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="#ffffff" />

//       {data.flag === true ? (
//         <Viro3DObject
//           //source={require('../assets/model3D/whiteChair/modern_chair11obj.obj')}
//           source={objectSource}
//           // resources={[
//           //   require('../assets/model3D/whiteChair/modern_chair11obj.mtl'),
//           //   require('../assets/model3D/whiteChair/0027.JPG'),
//           //   require('../assets/model3D/whiteChair/unrawpText.JPG'),
//           // ]}
//           resource={resources}
//           position={[0, -1, -1]}
//           scale={[0.02, 0.02, 0.02]}
//           type="OBJ"
//           onRotate={_onRotate}
//           // rotation={[0, rotation, 0]}
//           // dragType={'FixedToWorld'}

//           // dragType="FixedToPlane"
//           // dragPlane={{
//           //   planePoint: [0, -2, 0],
//           //   planeNormal: [0, 1, 0],
//           //   maxDistance: 4
//           // }}
//           // onDrag={() => { }}
//         />
//       ) : (
//         <ViroText
//           text={'Object is Hidden'}
//           scale={[0.5, 0.5, 0.5]}
//           position={[0, 0, -1]}
//         />
//       )}
//     </ViroARScene>
//   );
// };

// function ARScreen({navigation}) {
//   const [flag, setFlag] = useState(false);

//   return (
//     <View style={styles.container}>
//       <ViroARSceneNavigator
//         initialScene={{scene: ReticleSceneAR}}
//         // initialScene={{ scene: InitialScene }}
//         viroAppProps={{flag: flag}}
//         style={{flex: 1}}
//       />

//       <View style={styles.controlsView}>
//         <TouchableOpacity style={styles.button} onPress={() => setFlag(!flag)}>
//           <Text style={styles.buttonText}>Reposition</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   controlsView: {
//     width: '100%',
//     height: 100,
//     backgroundColor: '#ffffff',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: '#FFFFE0',
//     borderColor: '#000000',
//     borderWidth: 2,
//     borderRadius: 5,
//     padding: 10,
//   },
//   buttonText: {
//     color: '#000000',
//     fontSize: 20,
//   },
// });

// export default ARScreen;
