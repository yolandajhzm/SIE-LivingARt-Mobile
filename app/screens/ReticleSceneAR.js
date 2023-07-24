'use strict';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroTrackingStateConstants,
  Viro3DObject,
  ViroAmbientLight,
  ViroNode,
  ViroDirectionalLight,
  ViroImage,
  ViroQuad,
  ViroBox,
  ViroFlexView,
  ViroButton,
} from '@viro-community/react-viro';

class ReticleSceneAR extends Component {
  constructor(props) {
    super(props);

    // Set initial state here
    this.state = {
      text: 'Initializing AR...',
      modelWorldRotation: [0, 0, 0],
      displayHitReticle: false,
      foundPlane: false,
      planeReticleLocation: [0, 0, 0],
      shouldBillboard: true,
      isReady: false,
      lastFoundPlaneLocation: [0, 0, 0],
      flag: this.props.sceneNavigator.viroAppProps.flag,
      objectRotation: [0, 0, 0],
      UIPosition: [0, 0, 0],
    };

    console.log('!!flag:', this.state.flag);

    // bind 'this' to functions
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._getScanningQuads = this._getScanningQuads.bind(this);
    this._onClickScanningQuads = this._onClickScanningQuads.bind(this);
    this._setInitialDirection = this._setInitialDirection.bind(this);
    this._getModel = this._getModel.bind(this);
    this._onCameraARHitTest = this._onCameraARHitTest.bind(this);
    this._onRotateObject = this._onRotateObject.bind(this);
  }

  componentWillReceiveProps = props => {
    this.setState({
      isReady: false,
    });
    console.log('props', props.sceneNavigator.viroAppProps.flag);
    console.log('updated isReady:', this.state.isReady);
  };

  render() {
    return (
      <ViroARScene
        onCameraARHitTest={this._onCameraARHitTest}
        onTrackingUpdated={this._onTrackingUpdated}>
        <ViroAmbientLight color={'#ffffff'} intensity={200} />
        <ViroDirectionalLight
          color="#ffffff"
          direction={[0, -1, -0.5]}
          position={[0, 9, 0]}
          castsShadow={true}
          shadowOpacity={0.9}
        />
        <ViroFlexView
          transformBehaviors={'billboard'}
          position={this.state.UIPosition}
          style={{
            flexDirection: 'row',
            padding: 0,
            // alignItems: 'center',
            // justifyContent: 'center',
          }}
          width={1.5}
          height={0.5}>
          <ViroImage
            source={require('../assets/res/noun-rotate-3697381.png')}
            style={{flex: 0.2}}
            scale={[0.3, 0.3, 0.3]}
          />
          <ViroImage
            source={require('../assets/res/noun-refresh-5651.png')}
            style={{flex: 0.2}}
            scale={[0.3, 0.3, 0.3]}
          />
          <ViroImage
            source={require('../assets/res/noun-rotate-3697381-flipped.png')}
            style={{flex: 0.2}}
            scale={[0.3, 0.3, 0.3]}
          />
        </ViroFlexView>
        <ViroText
          text={this.state.text}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={styles.textStyle}
        />
        {this._getScanningQuads()}
        {this._getModel()}
      </ViroARScene>
    );
  }

  _setInitialDirection() {
    if (this.node) {
      this.node.getTransformAsync().then(retDict => {
        let rotation = retDict.rotation;
        let absX = Math.abs(rotation[0]);
        let absZ = Math.abs(rotation[2]);

        let yRotation = rotation[1];

        // if the X and Z aren't 0, then adjust the y rotation (the quaternion flipped the X or Z).
        if (absX != 0 && absZ != 0) {
          yRotation = 180 - yRotation;
        }

        yRotation = yRotation;

        this.setState({
          modelWorldRotation: [0, yRotation, 0],
          shouldBillboard: false,
        });
      });
    }
  }

  _getScanningQuads() {
    if (this.state.isReady) {
      return;
    }

    return (
      <ViroNode
        transformBehaviors={'billboardY'}
        position={this.state.planeReticleLocation}
        scale={[0.5, 0.5, 0.5]}
        onClick={this._onClickScanningQuads}>
        <ViroText
          rotation={[0, 0, 0]}
          visible={this.state.foundPlane}
          textAlign="center"
          text="Click to Place"
        />
        <ViroText
          rotation={[0, 0, 0]}
          visible={!this.state.foundPlane}
          textAlign="center"
          text="Move to Plane"
        />
        <ViroImage
          rotation={[-90, 0, 0]}
          visible={this.state.foundPlane}
          source={require('../assets/res/tracking_diffuse_2.png')}
        />
        <ViroImage
          rotation={[-90, 0, 0]}
          visible={!this.state.foundPlane}
          source={require('../assets/res/tracking_diffuse.png')}
        />
      </ViroNode>
    );
  }

  _onClickScanningQuads() {
    console.log('ClickScan isReady:', this.state.isReady);
    console.log('ClickScan foundPlane:', this.state.foundPlane);
    if (this.state.foundPlane) {
      console.log('Before setState:', this.state.isReady);
      this.setState({
        // isReady: true
        isReady: true,
        // flag: !this.state.flag
      });
      console.log('After setState:', this.state.isReady);
      this._setInitialDirection();
    }
  }

  _getModel() {
    // console.log("flag:", this.props.sceneNavigator.viroAppProps.flag);
    // if (!this.state.isReady) return;

    let position = this.state.isReady
      ? this.state.lastFoundPlaneLocation
      : [0, 20, 0];
    // console.log("model position:", position);

    var transformBehaviors = this.state.shouldBillboard ? 'billboardY' : [];

    return (
      <ViroNode
        position={position}
        rotation={this.state.modelWorldRotation}
        scale={[0.2, 0.2, 0.2]}
        transformBehaviors={transformBehaviors}>
        <ViroNode
          ref={ref => {
            this.node = ref;
          }}
          // scale={[.1, .1, .1]}
        >
          {/* <Viro3DObject
            visible={this.state.isReady}
            position={[0, .5, 0]}
            source={require('./res/emoji_heart_anim/emoji_heart_anim.vrx')}
            resources={[
              require('./res/emoji_heart_anim/emoji_heart.png'),
              require('./res/emoji_heart_anim/emoji_heart_specular.png'),
            ]}
            animation={{ name: "02", delay: 0, loop: true, run: true }}
            type="VRX" /> */}
          {/* <ViroBox
            visible={this.state.isReady}
            position={[0, .5, 0]}
            onClickState={this._onClickObject}>
          </ViroBox> */}
          <Viro3DObject
            source={require('../assets/model3D/whiteChair/modern_chair11obj.obj')}
            resources={[
              require('../assets/model3D/whiteChair/modern_chair11obj.mtl'),
              require('../assets/model3D/whiteChair/0027.JPG'),
              require('../assets/model3D/whiteChair/unrawpText.JPG'),
            ]}
            visible={this.state.isReady}
            rotation={this.state.objectRotation}
            onClickState={this._onClickObject}
            onRotate={this._onRotateObject}
            scale={[0.05, 0.05, 0.05]}
            type="OBJ"
          />
          {/* <ViroQuad
            rotation={[-90, 0, 0]}
            position={[0, -.001, 0]}
            width={8}
            height={8}
            arShadowReceiver={true}
            ignoreEventHandling={true} /> */}
        </ViroNode>
      </ViroNode>
    );
  }

  _onClickObject(stateValue, position, source) {
    console.log('ClickState', stateValue, position, source);
    if (stateValue == 1) {
      // Click Down
      console.log('Click Down', stateValue, position, source);
    } else if (stateValue == 2) {
      // Click Up
      console.log('Click Up', stateValue, position, source);
    } else if (stateValue == 3) {
      console.log('Clicked', stateValue, position, source);
    }
  }

  _onRotateObject(rotateState, rotationFactor, source) {
    const SCALE = 0.1;
    if (rotateState == 2) {
      this.setState({
        objectRotation: [
          0,
          this.state.objectRotation[1] + rotationFactor * SCALE,
          0,
        ],
      });
    }
  }

  _onTrackingUpdated(state, reason) {
    if (state == ViroTrackingStateConstants.TRACKING_NORMAL) {
      this.setState({
        text: '',
      });
    } else if (state == ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      this.setState({
        text: 'Tracking is unavailable. Try moving your camera.',
      });
    }
  }

  _onCameraARHitTest(results) {
    // console.log("_onCameraARHitTest");
    let newUIPosition = [
      results.cameraOrientation.forward[0] * 1.2,
      results.cameraOrientation.forward[1] * 1.2,
      results.cameraOrientation.forward[2] * 1.2,
    ];
    if (!this.state.isReady) {
      if (results.hitTestResults.length > 0) {
        for (var i = 0; i < results.hitTestResults.length; i++) {
          let result = results.hitTestResults[i];
          if (result.type == 'ExistingPlaneUsingExtent') {
            this.setState({
              planeReticleLocation: result.transform.position,
              displayHitReticle: true,
              foundPlane: true,
              lastFoundPlaneLocation: result.transform.position,
              UIPosition: newUIPosition,
            });
            //           this.props.arSceneNavigator.viroAppProps.setIsOverPlane(true);
            return;
          }
        }
      }
      // else we made it here, so just forward vector with unmarked.
      let newPosition = [
        results.cameraOrientation.forward[0] * 1.5,
        results.cameraOrientation.forward[1] * 1.5,
        results.cameraOrientation.forward[2] * 1.5,
      ];
      newPosition[0] = results.cameraOrientation.position[0] + newPosition[0];
      newPosition[1] = results.cameraOrientation.position[1] + newPosition[1];
      newPosition[2] = results.cameraOrientation.position[2] + newPosition[2];
      this.setState({
        planeReticleLocation: newPosition,
        displayHitReticle: true,
        foundPlane: false,
        UIPosition: newUIPosition,
      });
      return;
    }
    //  this.props.arSceneNavigator.viroAppProps.setIsOverPlane(false);
  }
}

let styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

export default ReticleSceneAR;
