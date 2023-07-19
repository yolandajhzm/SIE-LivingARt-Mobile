import React, { useState } from "react"
// import { observer } from "mobx-react-lite"
import { Dimensions, PixelRatio, StyleSheet, TextStyle, ViewStyle } from "react-native"
// import { Header, Screen, Text } from "../../components"
// import { color, spacing } from "../../theme"

import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroMaterials,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARPlane,
  ViroARPlaneSelector,
  ViroQuad,
  ViroNode,
  ViroAnimations,
  ViroTrackingStateConstants
} from '@viro-community/react-viro';
// import { useNavigation } from "@react-navigation/core"

// const ROOT = {
//   backgroundColor: color.transparent,
//   flex: 1,
// }
// const BOLD = { fontWeight: "bold" }
// const HEADER = {
//   paddingTop: spacing[3],
//   paddingBottom: spacing[5] - 1,
//   paddingHorizontal: spacing[4],
// }
// const HEADER_TITLE = {
//   ...BOLD,
//   color: color.palette.black,
//   fontSize: 12,
//   lineHeight: 15,
//   textAlign: "center",
//   letterSpacing: 1.5,
// }

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

// ViroMaterials.createMaterials({
//   grid: {
//     diffuseTexture: require('./res/grid_bg.jpg'),
//   },
// });

ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 250, //.25 seconds
  },
});

export const MeasureSceneAR = () => {
  const [initialized, setInitialized] = useState(false)
  const [text, setText] = useState('Initializing AR...')
  const [firstNodePlaced, setFirstNodePlaced] = useState(false)
  const [distance, setDistance] = useState(null)

  const arSceneRef = React.useRef(null)
  const nodeRef1 = React.useRef(null)
  const nodeRef2 = React.useRef(null)

  const _onTrackingUpdated = (state, reason) => {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (!initialized && state == ViroTrackingStateConstants.TRACKING_NORMAL) {
      setInitialized(true);
      setText('Hello World!');
    }
  }

  const handleSceneClick = source => {
    arSceneRef.current.performARHitTestWithPoint((Dimensions.get('window').width * PixelRatio.get()) / 2, (Dimensions.get('window').height * PixelRatio.get()) / 2)
      .then((results) => {
        for (var i = 0; i < results.length; i++) {
          let result = results[i];
          if (result.type == "ExistingPlaneUsingExtent") {
            // We hit a plane, do something!
            if (firstNodePlaced) {
              console.log('move two')

              nodeRef2.current.setNativeProps({
                position: result.transform.position,
                visible: true,
              })

              nodeRef1.current.getTransformAsync().then(transform => {
                console.log(transform.position);

                getDistance(transform.position, result.transform.position)
              })

            } else {
              console.log('move one')

              nodeRef2.current.setNativeProps({ visible: false });

              nodeRef1.current.setNativeProps({
                position: result.transform.position,
                visible: true
              })

              setFirstNodePlaced(true)
            }
          }
        }
      });
  }

  const getDistance = (positionOne, positionTwo) => {
    // Compute the difference vector between the two hit locations.
    const dx = positionOne[0] - positionTwo[0];
    const dy = positionOne[1] - positionTwo[1];
    const dz = positionOne[2] - positionTwo[2];

    // // Compute the straight-line distance.
    const distanceMeters = Math.sqrt(dx * dx + dy * dy + dz * dz);

    console.log(distanceMeters * 100)

    setDistance(distanceMeters * 100)
  }

  const handleDrag = (dragToPos, source) => {
    nodeRef1.current.getTransformAsync().then(transform => {
      console.log(transform.position);

      getDistance(transform.position, dragToPos)
    })
  }

  return (
    <ViroARScene ref={arSceneRef} onTrackingUpdated={_onTrackingUpdated} onClick={handleSceneClick}>

      <ViroNode ref={nodeRef1} position={[0, 0, 0]} visible={false} onClick={() => { }}
        onDrag={() => { }}
        dragType="FixedToWorld"
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0, -1, -.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('../assets/res/emoji_smile_anim_a/emoji_smile_anim_a.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('../assets/res/emoji_smile_anim_a/emoji_smile_diffuse.png'),
          require('../assets/res/emoji_smile_anim_a/emoji_smile_specular.png'),
          require('../assets/res/emoji_smile_anim_a/emoji_smile_normal.png')]} />
      </ViroNode>

      <ViroNode ref={nodeRef2} position={[0, 0, 0]} visible={false} onClick={() => { }}
        onDrag={handleDrag}
        dragType="FixedToWorld"
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0, -1, -.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('../assets/res/emoji_smile_anim_a/emoji_smile_anim_a.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('../assets/res/emoji_smile_anim_a/emoji_smile_diffuse.png'),
          require('../assets/res/emoji_smile_anim_a/emoji_smile_specular.png'),
          require('../assets/res/emoji_smile_anim_a/emoji_smile_normal.png')]} />

        <ViroText text={distance ? distance.toFixed(2) + 'cm' : ''} scale={[.1, .1, .1]} position={[0, 0, -0.05]} style={styles.helloWorldTextStyle} />
      </ViroNode>

    </ViroARScene>
  )
}

// export const MeasureScreen = observer(function MeasureScreen() {
//   const navigation = useNavigation()
//   const goBack = () => navigation.goBack()

//   return (
//     <Screen style={ROOT} preset="fixed">
//       <Header
//         headerText="Measure"
//         leftIcon="back"
//         onLeftPress={goBack}
//         style={HEADER}
//         titleStyle={HEADER_TITLE}
//       />

//       <ViroARSceneNavigator
//         autofocus={true}
//         initialScene={{
//           scene: MeasureSceneAR,
//         }}
//         style={{ flex: 1 }}
//       />
//     </Screen>
//   )
// })