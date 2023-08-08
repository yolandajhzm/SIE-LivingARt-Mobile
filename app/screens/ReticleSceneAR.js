'use strict';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
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
  ViroMaterials
} from '@viro-community/react-viro';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

ViroMaterials.createMaterials({
  tp: {
    diffuseColor: 'hsla(0, 50%, 50%, 0.25)',
  },
});


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
      modelDimensions: this.props.sceneNavigator.viroAppProps.modelDimensions,
      objectRotation: [0, 0, 0],
      objectScale: [1, 1, 1],
      boundingBox: {
        width: 0,
        length: 0,
        height: 0,
      },
      modelURL: this.props.sceneNavigator.viroAppProps.modelURL,
      modelSource: null,
      modelResources: [],
      resizeOn: false,
    }

    // console.log('!!flag:', this.state.flag);

    // bind 'this' to functions
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._getScanningQuads = this._getScanningQuads.bind(this);
    this._onClickScanningQuads = this._onClickScanningQuads.bind(this);
    this._setInitialDirection = this._setInitialDirection.bind(this);
    this._getModel = this._getModel.bind(this);
    this._onCameraARHitTest = this._onCameraARHitTest.bind(this);
    this._onRotateObject = this._onRotateObject.bind(this);
    this._onClickObject = this._onClickObject.bind(this);
    this._onPinchObject = this._onPinchObject.bind(this);
    // this._setInitialScale = this._setInitialScale.bind(this);

    this.fetchAndUnzip = this.fetchAndUnzip.bind(this);
  };

  async componentDidMount() {
    console.log("before fetchAndUnzip", this.state.modelURL);
    await this.fetchAndUnzip(this.state.modelURL);
  }

  async componentWillUnmount() {
    console.log("Exiting AR screen");

    const zipFile = `${RNFS.DocumentDirectoryPath}/model.zip`;
    const path = `${RNFS.DocumentDirectoryPath}/model`;
    try {
      await RNFS.unlink(path);
      await RNFS.unlink(zipFile);
      console.log("unlink: ", zipFile, path);
    } catch (err) {
      console.error(err);
    }
  }

  async fetchAndUnzip(fromUrl) {
    const zipFilePath = `${RNFS.DocumentDirectoryPath}/model.zip`; // path where the downloaded zip file should be stored
    const targetPath = `${RNFS.DocumentDirectoryPath}/model`; // path where the unzipped files should be stored
    console.log("after set FilePath", zipFilePath);
    try {
      const zipFileExist = await RNFS.exists(zipFilePath);
      const targetPathExist = await RNFS.exists(targetPath);
      console.log("after find zipFilePath exist", zipFileExist, zipFilePath);
      console.log("after find targetPath exist", targetPathExist, targetPath);
      if (true) {
        const { jobId, promise } = RNFS.downloadFile({
          fromUrl: fromUrl, // use the argument as the URL
          toFile: zipFilePath,
        });

        await promise; // wait for the file to finish downloading
        console.log(`download completed at ${zipFilePath}`);

        await unzip(zipFilePath, targetPath); // unzip the downloaded file
        console.log(`unzip completed at ${targetPath}`);
      }
      // Read the contents of the unzipped folder
      const files = await RNFS.readDir(targetPath);
      console.log("files", files);
      const item = files[0];
      const innerFiles = await RNFS.readDir(item.path);
      console.log('Files inside the directory:', innerFiles);

      // Find the OBJ file and other resource files
      let objFile = null;
      let resources = [];

      innerFiles.forEach(file => {
        if (file.name.endsWith('.obj')) {
          objFile = file.path;
        } else {
          resources.push({ uri: file.path });
        }
      });

      // Update the state with the found files
      if (objFile) {
        this.setState({
          modelSource: { uri: objFile },
          modelResources: resources,
        });
      } else {
        console.error('No OBJ file found in the unzipped folder');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // componentWillReceiveProps = props => {
  //   this.setState({
  //     isReady: false,
  //   });
  //   console.log('props', props.sceneNavigator.viroAppProps.flag);
  //   console.log('updated isReady:', this.state.isReady);
  // };

  componentDidUpdate(prevProps, pervState) {
    console.log('prev props', prevProps.sceneNavigator.viroAppProps.flag);
    console.log('prev state', this.state.flag);
    if (prevProps.sceneNavigator.viroAppProps.flag !== this.state.flag) {
      this.setState({
        isReady: false,
        flag: !this.state.flag,
      });
      console.log('props', this.props.sceneNavigator.viroAppProps.flag);
      console.log('updated isReady:', this.state.isReady);
    }
    if (prevProps.sceneNavigator.viroAppProps.resizeOn === this.state.resizeOn) {
      this.setState({
        resizeOn: !this.state.resizeOn,
      });
      console.log('props resizeOn', this.props.sceneNavigator.viroAppProps.resizeOn);
      console.log('updated state resizeOn:', this.state.resizeOn);
    }
  }

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
        {this.state.modelSource ? this._getModel() : console.log("Not Yet", this.state.modelSource)}
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
      // set initial scale for model object
      this._setInitialObjectDimension();
      // this._updateObjectDimension();
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
        // rotation={this.state.modelWorldRotation}
        rotation={this.state.objectRotation}
        scale={this.state.objectScale}
        onPinch={this._onPinchObject}
      // transformBehaviors={transformBehaviors}
      >
        <ViroText
          position={[0, this.state.boundingBox.height / this.state.objectScale[0] / 2, - this.state.boundingBox.length / 2 / this.state.objectScale[0]]}
          rotation={[0, 0, 0]}
          transformBehaviors={'billboardY'}
          visible={this.state.isReady && this.state.resizeOn}
          // rotation={this.state.objectRotation}
          textAlign="center"
          width={2}
          height={1.8}
          style={{
            fontFamily: "Arial",
            fontSize: 8,
            fontWeight: '1000',
            fontStyle: "italic",
            color: "#EE4B2B",
          }}
          text={`Width: ${Math.round(this.state.boundingBox.width * 100)}cm,\n Height: ${Math.round(this.state.boundingBox.height * 100)}cm,\n Length: ${Math.round(this.state.boundingBox.length * 100)}cm`}
        />
        {/* <ViroText
          position={[this.state.boundingBox.width / 2 / this.state.objectScale[0], this.state.boundingBox.height / this.state.objectScale[0] + 0.4, 0]}
          rotation={[0, -90, 0]}
          transformBehaviors={'billboardY'}
          visible={this.state.isReady}
          // rotation={this.state.objectRotation}
          textAlign="center"
          text={`Height: ${Math.round(this.state.boundingBox.height * 100)}cm, Length: ${Math.round(this.state.boundingBox.length * 100)}cm`}
        /> */}

        <ViroNode
          ref={ref => {
            this.node = ref;
            // console.log("this.node", this.node)
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
            position={[0, 1.55, 0]}
            height={this.state.boundingBox.height / this.state.objectScale[0]}
            length={this.state.boundingBox.length / this.state.objectScale[0]}
            width={this.state.boundingBox.width / this.state.objectScale[0]}
            materials={'tp'}
            rotation={this.state.objectRotation}
            onClickState={this._onClickObject}
            onRotate={this._onRotateObject}
          >
          </ViroBox> */}
          <Viro3DObject
            // source={require('../assets/model3D/whiteChair/modern_chair11obj.obj')}
            // resources={[
            //   require('../assets/model3D/whiteChair/modern_chair11obj.mtl'),
            //   require('../assets/model3D/whiteChair/0027.JPG'),
            //   require('../assets/model3D/whiteChair/unrawpText.JPG'),
            // ]}
            source={this.state.modelSource}
            resources={this.state.modelResources}
            visible={this.state.isReady}
            rotation={this.state.objectRotation}
            onClickState={this._onClickObject}
            onRotate={this._onRotateObject}
            onPinch={this._onPinchObject}
            scale={[0.01, 0.01, 0.01]}
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
      </ViroNode >
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
      console.log("!!File downloaded!!")
      this._updateObjectDimension();
      // console.log("state.rotation", this.state.objectRotation);
      // this.state.boundingBox.height = d.maxY - d.minY;
    }
  }

  _updateObjectDimension() {
    // console.log(this.node);
    let dx, dy, dz;
    this.node.getBoundingBoxAsync().then((data) => {
      // console.log(data);
      dx = data.boundingBox.maxX - data.boundingBox.minX;
      dy = data.boundingBox.maxY - data.boundingBox.minY;
      dz = data.boundingBox.maxZ - data.boundingBox.minZ;
      console.log("dx:", dx);
      console.log("dy:", dy);
      console.log("dz:", dz);
      console.log("minY:", data.boundingBox.minY);
    }).then(this.node.getTransformAsync().then((transform) => {
      console.log("pos:", transform.position);
      console.log("scale:", transform.scale);
      console.log("rotation:", transform.rotation);
      let a = transform.rotation[1];
      let c = Math.abs(Math.cos(2 * a / 180.0 * Math.PI));
      let s = Math.abs(Math.sin(2 * a / 180.0 * Math.PI));
      console.log("cal ", c)
      this.setState({
        boundingBox: {
          width: (c * dx - s * dz) / (c * c - s * s),
          length: (c * dz - s * dx) / (c * c - s * s),
          height: dy,
        }
      })
      console.log("bB.width:", this.state.boundingBox.width);
    }))
  }

  _updateObjectScale(scaleFactor) {
    this.setState({
      objectScale: [
        this.state.objectScale[0] * scaleFactor,
        this.state.objectScale[1] * scaleFactor,
        this.state.objectScale[2] * scaleFactor,
      ]
    })
    this.setState({
      boundingBox: {
        width: this.state.boundingBox.width * scaleFactor,
        length: this.state.boundingBox.length * scaleFactor,
        height: this.state.boundingBox.height * scaleFactor,
      }
    })
  }


  _setInitialObjectDimension() {
    // console.log(this.node);
    let dx, dy, dz;
    this.node.getBoundingBoxAsync().then((data) => {
      // console.log(data);
      dx = data.boundingBox.maxX - data.boundingBox.minX;
      dy = data.boundingBox.maxY - data.boundingBox.minY;
      dz = data.boundingBox.maxZ - data.boundingBox.minZ;
      console.log("dx:", dx);
      console.log("dy:", dy);
      console.log("dz:", dz);
      console.log("minY:", data.boundingBox.minY);
    }).then(this.node.getTransformAsync().then((transform) => {
      console.log("pos:", transform.position);
      console.log("scale:", transform.scale);
      console.log("rotation:", transform.rotation);
      let a = transform.rotation[1];
      let c = Math.abs(Math.cos(2 * a / 180.0 * Math.PI));
      let s = Math.abs(Math.sin(2 * a / 180.0 * Math.PI));
      console.log("cal ", c)
      this.setState({
        boundingBox: {
          width: (c * dx - s * dz) / (c * c - s * s),
          length: (c * dz - s * dx) / (c * c - s * s),
          height: dy,
        }
      })
      console.log("original bB.height:", this.state.boundingBox.height);
      console.log("Model dimension:", this.state.modelDimensions);
      const scaleFactor = this.state.modelDimensions.height / 100 / this.state.boundingBox.height;
      console.log("initialize scaleFactor:", scaleFactor);
      this._updateObjectScale(scaleFactor);
    }))
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

  _onPinchObject(pinchState, scaleFactor, source) {
    if (this.state.resizeOn) {
      if (pinchState == 3) {
        console.log("onPinch:", scaleFactor);
        this._updateObjectScale(scaleFactor);
        // update scale of obj by multiplying by scaleFactor when pinch ends.
        console.log("onPinch: updateScale");
      }
    }
    //set scale using native props to reflect pinch.  
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
