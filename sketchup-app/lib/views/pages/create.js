'use strict';

import React from 'react';
import Page from '../components/page';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import classnames from 'classnames';

const Shapes = {
  Pencil: 'pencil',
  Cirlce: 'circle',
  Rectangle: 'rectangle',
  Line: 'line'
};

class CreateSketch extends React.Component {
  constructor () {
    super();
    this.state = {
        file: '',
        isDrawing: false,
        color: '#000',
        shape: Shapes.Pencil,
        sketchName: 'untitled',
        tempCanvas: false
    };
    this.prevPos = { x: 0, y: 0 };
    this.canvas = React.createRef();
    this.image = React.createRef();
    this.tempCanvas = React.createRef();
    this.containerRef = React.createRef();
  }

  componentDidMount () {
    const { width, height } = this.canvas.current;
    const { offsetLeft, offsetTop } = this.containerRef.current;
    const ctx = this.canvas.current.getContext("2d");

    // border adjustments
    this.offsetLeft = offsetLeft + 25;
    this.offsetTop = offsetTop + 25;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
  }

  drawShape = (ctx, x, y) => {
    ctx.beginPath();
    ctx.strokeStyle = this.state.color;
    const startX = this.startPos.x, startY = this.startPos.y;
    if (this.state.shape === Shapes.Rectangle) {
      ctx.rect(startX, startY, x - startX, y - startY);
    } else if (this.state.shape === Shapes.Cirlce) {
      ctx.arc(startX, startY, x - startX, 0, 2 * Math.PI)
    } else if (this.state.shape === Shapes.Line) {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
  }

  mouseUpHandler = (event) => {
    const x = event.pageX - this.offsetLeft,
    y = event.pageY - this.offsetTop,
    ctx = this.canvas.current.getContext("2d");

    this.drawShape(ctx, x, y);
    this.setState({isDrawing: false});
  }

  setShape = (shape) => {
    this.setState({
      shape: shape,
      tempCanvas: shape !== 'pencil'
    });
  }

  mouseDownhandler = (event) => {
    const x = event.pageX - this.offsetLeft,
          y = event.pageY - this.offsetTop;

    this.prevPos = {x, y};
    this.startPos = {x, y};
    this.setState({isDrawing: true});
  }

  mouseMoveHandler = (event) => {
    if (!this.state.isDrawing) {
      return;
    }
    const x = event.pageX - this.offsetLeft,
         y = event.pageY - this.offsetTop;

    if (this.state.shape === 'pencil') {
      const ctx = this.canvas.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(this.prevPos.x, this.prevPos.y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.strokeStyle = this.state.color;
      ctx.stroke();
      this.prevPos = {x, y};
    } else {
      const ctx = this.tempCanvas.current.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.drawShape(ctx, x, y);
    }
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
          canvas = this.canvas.current,
          tempCanvas = this.tempCanvas.current,
          tempContext = tempCanvas.getContext('2d');

    tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCanvas.width = 200;
    tempCanvas.height = 120;
    tempContext.drawImage(canvas, 0, 0, 200, 120);
    const dataUrl = tempCanvas.toDataURL(imgType, 0.5);

    // this.props.dispatch(actions.saveImage({
    //   file: dataUrl,
    //   type: imgType,
    //   name: this.state.sketchName
    // }));

    canvas.toBlob(function(blob) {
      console.log(blob);
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('name', self.state.sketchName);
      formData.append('type', imgType);
      formData.append('thumbnail', dataUrl);

      self.props.dispatch(actions.uploadImage(formData));
    }, imgType);

    this.setState({
      tempCanvas: false
    });
  }

  render () {
    const tempCanvasClass = classnames('temp-canvas', { hidden: !this.state.tempCanvas }),
          pencilClass = classnames('tool', { active: this.state.shape === Shapes.Pencil }),
          lineClass = classnames('tool', { active: this.state.shape === Shapes.Line }),
          rectangleClass = classnames('tool', { active: this.state.shape === Shapes.Rectangle }),
          circleClass = classnames('tool', { active: this.state.shape === Shapes.Cirlce });

    return (
      <Page className="create-sketch-page" header="Create Sketch" loading={this.props.loading}>
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
              <div className={pencilClass} onClick={() => this.setShape(Shapes.Pencil)}>
                <div className="shape">+</div><div>Pencil</div>
              </div>
              <div className={lineClass} onClick={() => this.setShape(Shapes.Line)}>
                <div className="shape">-</div><div>Line</div>
              </div>
              <div className={rectangleClass} onClick={() => this.setShape(Shapes.Rectangle)}>
                <div className="shape">&#9633;</div><div>Rectangle</div>
              </div>
              <div className={circleClass} onClick={() => this.setShape(Shapes.Cirlce)}>
                <div className="shape">&#9675;</div><div>Circle</div>
              </div>
            </div>
          </div>
          <div className="create-sketch-content">
            <div className="action-section">
              <div className="input-field name">
                <input type="text" className="sketch-name" placeholder="untitled" onChange={this.sketchNamehandler} autoFocus/>
              </div>
            <div className="button-section">
              <button className="btn btn-primary" onClick={this.saveImageHandler}>Save Sketch</button>
            </div>
            </div>
            <div className="sketch-content" ref={this.containerRef}>
              <canvas className="sketch-board" ref={this.canvas} width={940} height={540} onMouseDown={this.mouseDownhandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler}/>
              <img ref={this.image} src={this.state.imgPath} className="hidden" onLoad={this.imgChangeHandler}/>
              <canvas className={tempCanvasClass} ref={this.tempCanvas} width={940} height={540} onMouseDown={this.mouseDownhandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler}></canvas>
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
