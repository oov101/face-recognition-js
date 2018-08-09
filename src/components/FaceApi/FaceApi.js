import React, { Component } from 'react';
import * as faceapi from 'face-api.js/dist/face-api.js';
import './FaceApi.css';
const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = electron.remote.require('fs');

class FaceApi extends Component {
  constructor() {
    super();
    this.state = {
      classes: [
        {
          name: 'sheldon',
          bufferImages: []
        }
      ],
      image: ''
    };
    this.maxDistance = 0.6;
    this.minConfidence = 0.7;
    this.useBatchProcessing = false;
    this.trainDescriptorsByClass = [];
    this.openFile = this.openFile.bind(this);
    this.openAndAddSuspectImages = this.openAndAddSuspectImages.bind(this);
    this.numbersOfSuspectImages = this.numbersOfSuspectImages.bind(this);
  }

  openAndAddSuspectImages() {
    dialog.showOpenDialog(
      { properties: ['openFile', 'multiSelections'] },
      fileNames => {
        if (fileNames === undefined) return;
        let blobArray = [];
        fileNames.forEach((FileName) => {
          fs.readFile(FileName, (err, data) => {
            blobArray.push(new Blob([new Uint8Array(data)]));
          });
        });
        
        this.setState({
          classes: [
            {
              name: this.state.classes[0].name,
              bufferImages: blobArray
            }
          ]
        });
      }
    );
  }

  openFile() {
    dialog.showOpenDialog(fileNames => {
      if (fileNames === undefined) return;
      var filePath = fileNames[0];
      fs.readFile(filePath, (err, data) => {
        let base64Image = data.toString('base64');
        let imgSrcString = `data:image/${filePath.split('.').pop()};base64,${base64Image}`;
        this.setState({
          image: imgSrcString
        });
        this.run();
      });
    });
  }

  getFaceImageUri(className, idx) {
    return `./images/${className}/${className}${idx}.png`
  }

  async fetchImage(uri) {
    return (await fetch(uri)).blob()
  }

  numbersOfSuspectImages() {
    return this.state.classes[0].bufferImages.length;
  }

  async initTrainDescriptorsByClass(net, numbersOfSuspectImages) {
    const maxAvailableImagesPerClass = 5
    numbersOfSuspectImages = Math.min(numbersOfSuspectImages, maxAvailableImagesPerClass)
    return Promise.all(this.state.classes.map(
      async suspect => {
        const descriptors = [];
        const name = suspect.name;
        
        suspect.bufferImages.forEach(async (bufferImage) => {
          const img = await faceapi.bufferToImage(await new Promise((resolve, reject) => {
            resolve(bufferImage);
          }));
          descriptors.push(await net.computeFaceDescriptor(img));
        });

        return {
          descriptors,
          name
        }
      }
    ))
  }

  getBestMatch(descriptorsByClass, queryDescriptor) {
    function computeMeanDistance(descriptorsOfClass) {
      return faceapi.round(
        descriptorsOfClass
          .map(d => faceapi.euclideanDistance(d, queryDescriptor))
          .reduce((d1, d2) => d1 + d2, 0)
            / (descriptorsOfClass.length || 1)
        )
    }
    return descriptorsByClass
      .map(
        ({ descriptors, name }) => ({
          distance: computeMeanDistance(descriptors),
          name
        })
      )
      .reduce((best, curr) => best.distance < curr.distance ? best : curr)
  }

  async updateResults() {
    const inputImgEl = document.getElementById('inputImg');
    const { width, height } = inputImgEl;
    const canvas = document.getElementById('overlay');
    canvas.width = width;
    canvas.height = height;

    const fullFaceDescriptions = (await faceapi.allFaces(inputImgEl, this.minConfidence, this.useBatchProcessing))
      .map(fd => fd.forSize(width, height));

    fullFaceDescriptions.forEach(({ detection, descriptor }) => {
      faceapi.drawDetection('overlay', [detection], { withScore: false });
      const bestMatch = this.getBestMatch(this.trainDescriptorsByClass, descriptor);
      const text = `${bestMatch.distance < this.maxDistance ? bestMatch.name : 'unkown'}`;
      const { x, y, height: boxHeight } = detection.getBox();
      faceapi.drawText(
        canvas.getContext('2d'),
        x,
        y + boxHeight,
        text,
        Object.assign(faceapi.getDefaultDrawOptions(), { color: 'red', fontSize: 16 })
      );
    });
  }

  async run() {
    await faceapi.loadFaceDetectionModel('./weights');
    await faceapi.loadFaceLandmarkModel('./weights');
    await faceapi.loadFaceRecognitionModel('./weights');
    this.trainDescriptorsByClass = await this.initTrainDescriptorsByClass(faceapi.recognitionNet, this.numbersOfSuspectImages());
    this.updateResults();
  }

  render() {
    return(
      <div>
        <button onClick={this.openAndAddSuspectImages}>Open suspect file</button>
        <button onClick={this.openFile}>Open file</button>
          {this.state.image &&
            <div id="render-container">
              <img id="inputImg" src={this.state.image} alt="" />
              <canvas id="overlay" />
            </div>
          }
      </div>
    );
  }
}

export default FaceApi;