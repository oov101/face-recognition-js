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
      classes: ['howard', 'leonard', 'penny', 'raj', 'sheldon', 'bernadette', 'amy', 'stuart'],
      image: ''
    };
    this.maxDistance = 0.6;
    this.minConfidence = 0.7;
    this.useBatchProcessing = false;
    this.trainDescriptorsByClass = [];
    this.openFile = this.openFile.bind(this);
  }

  componentDidUpdate() {
    this.run();
  }

  openFile () {
    dialog.showOpenDialog(fileNames => {
      if (fileNames === undefined) return;
      var filePath = fileNames[0];
      console.log(filePath);

      fs.readFile(filePath, (err, data) => {
        console.log(data);

        //convert image file to base64-encoded string
        let base64Image = data.toString('base64');

        //combine all strings
        let imgSrcString = `data:image/${filePath.split('.').pop()};base64,${base64Image}`;
        console.log(imgSrcString);
        this.setState({
          image: imgSrcString
        });
      });
    });
  }

  getFaceImageUri(className, idx) {
    return `images/${className}/${className}${idx}.png`
  }

  async fetchImage(uri) {
    return (await fetch(uri)).blob()
  }

  // fetch first image of each class and compute their descriptors
  async initTrainDescriptorsByClass(net, numImagesForTraining = 1) {
    const maxAvailableImagesPerClass = 5
    numImagesForTraining = Math.min(numImagesForTraining, maxAvailableImagesPerClass)
    return Promise.all(this.state.classes.map(
      async className => {
        const descriptors = []
        for (let i = 1; i < (numImagesForTraining + 1); i++) {
          const img = await faceapi.bufferToImage(
            await this.fetchImage(this.getFaceImageUri(className, i))
          )
          descriptors.push(await net.computeFaceDescriptor(img))
        }
        return {
          descriptors,
          className
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
        ({ descriptors, className }) => ({
          distance: computeMeanDistance(descriptors),
          className
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
      const text = `${bestMatch.distance < this.maxDistance ? bestMatch.className : 'unkown'}`;
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
    await faceapi.loadFaceDetectionModel('/static/weights');
    await faceapi.loadFaceLandmarkModel('/static/weights');
    await faceapi.loadFaceRecognitionModel('/static/weights');

    this.trainDescriptorsByClass = await this.initTrainDescriptorsByClass(faceapi.recognitionNet, 1);
    this.updateResults();
  }

  render() {
    return(
      <div>
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