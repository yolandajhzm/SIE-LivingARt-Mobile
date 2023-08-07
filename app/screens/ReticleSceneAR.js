'use strict';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
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
} from '@viro-community/react-viro';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';

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
      modelSource: null,
      modelResources: [],
      modelUrl:
        'https://cmu-sie.oss-us-west-1.aliyuncs.com/threeDModels/5925aee6-e13f-4035-aa82-b675d464d3b2whiteChair.zip',
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

    this.fetchAndUnzip = this.fetchAndUnzip.bind(this);
  }

  async componentDidMount() {
    await this.fetchAndUnzip(this.state.modelUrl);
  }

  async fetchAndUnzip(fromUrl) {
    const zipFilePath = `${RNFS.DocumentDirectoryPath}/model.zip`; // path where the downloaded zip file should be stored
    const targetPath = `${RNFS.DocumentDirectoryPath}/model`; // path where the unzipped files should be stored

    try {
      const {jobId, promise} = RNFS.downloadFile({
        fromUrl: fromUrl, // use the argument as the URL
        toFile: zipFilePath,
      });

      await promise; // wait for the file to finish downloading
      console.log(`download completed at ${zipFilePath}`);

      await unzip(zipFilePath, targetPath); // unzip the downloaded file
      console.log(`unzip completed at ${targetPath}`);

      // Read the contents of the unzipped folder
      const files = await RNFS.readDir(targetPath + '/whiteChair');
      console.log('files', files);

      // Find the OBJ file and other resource files
      let objFile = null;
      let resources = [];

      files.forEach(file => {
        if (file.name.endsWith('.obj')) {
          objFile = file.path;
        } else {
          resources.push({uri: file.path});
        }
      });

      // Update the state with the found files
      if (objFile) {
        this.setState({
          modelSource: {uri: objFile},
          modelResources: resources,
        });
      } else {
        console.error('No OBJ file found in the unzipped folder');
      }
    } catch (err) {
      console.error(err);
    }
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
          <Viro3DObject
            source={this.state.modelSource}
            resources={this.state.modelResources}
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
            });
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
