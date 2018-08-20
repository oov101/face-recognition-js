import React, { Component } from 'react';
import * as faceapi from 'face-api.js/dist/face-api.js';
import './FaceReco.css';
import { Link } from 'react-router-dom';
const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = electron.remote.require('fs');

class FaceApi extends Component {
  constructor() {
    super();
    this.state = {
      classes: [
        {
          name: '',
          bufferImages: [],
          base64: []
        }
      ],
      image: '',
      loading: false
    };
    this.maxDistance = 0.6;
    this.minConfidence = 0.7;
    this.useBatchProcessing = false;
    this.trainDescriptorsByClass = [];
    this.openFile = this.openFile.bind(this);
    this.openAndAddSuspectImages = this.openAndAddSuspectImages.bind(this);
    this.numbersOfSuspectImages = this.numbersOfSuspectImages.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.force = this.force.bind(this);
  }

  openAndAddSuspectImages() {
    dialog.showOpenDialog(
      { properties: ['openFile', 'multiSelections'] },
      fileNames => {
        if (fileNames === undefined) return;
        let blobArray = [];
        let base64Array = [];
        fileNames.forEach((FileName) => {
          fs.readFile(FileName, (err, data) => {
            blobArray.push(new Blob([new Uint8Array(data)]));
            let base64Image = data.toString('base64');
            base64Array.push('data:image/png;base64,' + base64Image);
          });
        });
        
        this.setState(prevState => ({
          classes: [
            {
              ...prevState.classes[0],
              bufferImages: blobArray,
              base64: base64Array
            }
          ]
        }));
        setTimeout(() => {this.forceUpdate()}, 0);
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
          image: imgSrcString,
          loading: true
        });
        this.run();
      });
    });
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
          const img = await faceapi.bufferToImage(await bufferImage);
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
    this.setState({
      loading: false
    });
  }

  async run() {
    await faceapi.loadFaceDetectionModel('./weights');
    await faceapi.loadFaceLandmarkModel('./weights');
    await faceapi.loadFaceRecognitionModel('./weights');
    this.trainDescriptorsByClass = await this.initTrainDescriptorsByClass(faceapi.recognitionNet,this.numbersOfSuspectImages());
    this.updateResults();
  }

  handleChange(event) {
    this.setState({
      classes: [
        {
          name: event.target.value
        }
      ]
    })
  }

  force() {
    this.forceUpdate();
  }

  render() {
    return(
      <div id='FaceReco'>
        <div className='toolbar'>
          <Link to="/"><button>Home</button></Link>
          <input type="text" placeholder='Name:' value={this.state.classes[0].name} onChange={this.handleChange} />
          <button onClick={this.openAndAddSuspectImages}>Open suspect file</button>
          <button onClick={this.openFile}>Open file</button>
        </div>
        <div className='suspect-images'>
          { this.state.classes[0].base64 &&
            this.state.classes[0].base64.map((imageSrc, i) => {
            return <img key={i} src={imageSrc} alt="" />
          })} 
        </div>
        {this.state.image &&
        <div>
          <div className="loading-container">
            { this.state.loading &&
              <Loading />
            }
          </div>
          <div id="render-container">
            <div>
              <img id="inputImg" src={this.state.image} alt="" />
              <canvas id="overlay" />
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

const Loading = () => {
  return(
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  );
}
export default FaceApi;