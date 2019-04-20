'use strict';

import React from 'react';
import Page from '../components/page';
import * as actions from '../../actions';
import { connect } from 'react-redux';

class CreateSketch extends React.Component {
  constructor () {
    super();
    this.state = {
        file: '',
        isDrawing: false,
        color: '#000',
        sketchName: 'untitled'
    };
    this.prevPos = { x: 0, y: 0 };
    this.canvas = React.createRef();
    this.image = React.createRef();
  }

  mouseUpHandler = () => {
    this.setState({isDrawing: false});
  }

  componentDidMount () {
    const { offsetLeft, offsetTop, width, height } = this.canvas.current;
    const ctx = this.canvas.current.getContext("2d");

    this.offsetLeft = offsetLeft;
    this.offsetTop = offsetTop;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
  }

  mouseDownhandler = (event) => {
    const x = event.pageX - this.offsetLeft,
          y = event.pageY - this.offsetTop;

    this.prevPos = {x, y};
    this.setState({isDrawing: true});
  }

  mouseMoveHandler = (event) => {
    if (!this.state.isDrawing) {
      return;
    }
    const ctx = this.canvas.current.getContext("2d");
    const x = event.pageX - this.offsetLeft,
         y = event.pageY - this.offsetTop;

    ctx.beginPath();
    ctx.moveTo(this.prevPos.x, this.prevPos.y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.strokeStyle = this.state.color;
    ctx.stroke();
    this.prevPos = {x, y};
  }

  colorPickHandler = (event) => {
    this.setState({
      color: event.target.value
    });
  }

  sketchNamehandler = (event) => {
    this.setState({
      sketchName: event.target.value
    });
  }

  filePickHandler = (event) => {
    let self = this;
    console.log(event);
    const file = event.target.files[0],
          reader  = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = function (e) {
      console.log(e.target.result);
      self.setState({
        file: file,
        imgPath: e.target.result
      });
    }
  }

  imgChangeHandler = (event) => {
    console.log(event);
    const canvas = this.canvas.current,
          ctx = canvas.getContext("2d"),
          img = this.image.current,
          ratio  = Math.min(canvas.width/img.width, canvas.height/img.height);

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width*ratio, img.height*ratio);
  }

  saveImageHandler = () => {
    const self = this,
          imgType = 'image/png',
          dataUrl = this.canvas.current.toDataURL(imgType);

    // this.props.dispatch(actions.saveImage({
    //   file: dataUrl,
    //   type: imgType,
    //   name: this.state.sketchName
    // }));
    this.canvas.current.toBlob(function(blob) {
      console.log(blob);
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('name', self.state.sketchName);
      formData.append('type', imgType);

      self.props.dispatch(actions.uploadImage(formData));
    }, imgType);
  }

  render () {
    return (
      <Page className="create-sketch-page" header="Create" loading={this.props.loading}>
        <div className="create-sketch-container">
          <div className="sketch-toolbox">
            <div className="logo-section"></div>
            <div className="input-field upload tool">
              <label htmlFor="filePicker">
                <div className="shape">&#9635;</div><div>Image</div>
              </label>
              <input type="file" className="btn btn-upload hidden" id="filePicker" accept="image/png, image/jpeg" onChange={this.filePickHandler} />
            </div>
            <div className="input-field color tool">
              <input type="color" id="colorPicker" className="color-picker" onChange={this.colorPickHandler} />
              <label htmlFor="colorPicker">Color</label>
            </div>
            <div className="input-field shape-list">
              <div className="tool"><div className="shape">-</div><div>Line</div></div>
              <div className="tool"><div className="shape">&#9633;</div><div>Rectangle</div></div>
              <div className="tool"><div className="shape">&#9675;</div><div>Circle</div></div>
            </div>
          </div>
          <div className="create-sketch-content">
            <div className="action-section">
              <div className="input-field name">
                <input type="text" className="sketch-name" placeholder="untitled" onChange={this.sketchNamehandler} />
              </div>
            <div className="button-section">
              <button className="btn btn-primary" onClick={this.saveImageHandler}>Save Sketch</button>
            </div>
            </div>
            <div className="sketch-content">
              <canvas className="sketch-board" ref={this.canvas} width={1080} height={540} onMouseDown={this.mouseDownhandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler}/>
              <img ref={this.image} src={this.state.imgPath} className="hidden" onLoad={this.imgChangeHandler}/>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

CreateSketch.displayName = 'CreateSketch';

function select (state) {
  return {
    loading: state.dataRequests.loading
  };
}

export default connect(select)(CreateSketch);
