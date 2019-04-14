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
    this.offsetLeft = this.canvas.current.offsetLeft;
    this.offsetTop = this.canvas.current.offsetTop;
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

    ctx.moveTo(this.prevPos.x, this.prevPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = this.state.color;
    ctx.stroke();
    this.prevPos = {x, y};
  }

  drawRectangle = (event) => {

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
    const ctx = this.canvas.current.getContext("2d");
    const img = this.image.current;
    ctx.drawImage(img, 0, 0)
  }

  saveImageHandler = () => {
    const imgType = 'image/png', dataUrl = this.canvas.current.toDataURL(imgType);

    this.props.dispatch(actions.saveImage({
      file: dataUrl,
      type: imgType,
      name: this.state.sketchName
    }));

    // this.canvas.current.toBlob(function(blob) {
    //   console.log(blob);
    //   self.props.dispatch(actions.saveSketch({
    //     file: blob,
    //     name: 'file.png',
    //     type: blob.type
    //   }));
    // },'image/png');

    //take user to home page once save succesful
  }

  render () {
    return (
      <Page className="create-sketch-page" header="Create">
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
              <canvas className="sketch-board" ref={this.canvas} width={960} height={540} onMouseDown={this.mouseDownhandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler}/>
              <img ref={this.image} src={this.state.imgPath} className="hidden" onLoad={this.imgChangeHandler}/>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

CreateSketch.displayName = 'CreateSketch';

export default connect()(CreateSketch);
