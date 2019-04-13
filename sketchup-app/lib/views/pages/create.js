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
        imgName: '',
        isDrawing: false,
        allowSave: false,
        color: '#ff0000'
    };

    this.canvas = React.createRef();
    this.image = React.createRef();
    this.mouseUpHandler = this.mouseToggleHandler(false);
    this.mouseDownhandler = this.mouseToggleHandler(true);
  }

  mouseToggleHandler = (isDrawing) => {
    this.setState({isDrawing});
  }

  mouseMoveHandler = (event) => {
    if (!this.state.isDrawing) {
      return;
   }
   const ctx = this.canvas.current.getContext("2d");
   const x = event.pageX - this.offsetLeft,
         y = event.pageY - this.offsetTop;

    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
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
    let dataUrl = this.canvas.current.toDataURL(), imgData, self = this;

    this.props.dispatch(actions.saveImage({ file: dataUrl, type: 'image/png', name: 'file.png'}));

    // this.canvas.current.toBlob(function(blob) {
    //   console.log(blob);
    //   self.props.dispatch(actions.saveSketch({
    //     file: blob,
    //     name: 'file.png',
    //     type: blob.type
    //   }));
    // },'image/png');
  }

  render () {
    return (
      <Page className="create-sketch-page" header="Create">
        <div className="create-sketch-container">
            <div className="button-section">
                <input type="file" className="btn btn-upload" accept="image/png, image/jpeg" onChange={this.filePickHandler} />
            </div>
            <div className="sketch-content">
                <canvas ref={this.canvas} width={640} height={425} onMouseDown={this.mouseDownhandler} onMouseUp={this.mouseUpHandler} onMouseMove={this.mouseMoveHandler}/>
                <img ref={this.image} src={this.state.imgPath} className="hidden" onLoad={this.imgChangeHandler}/>
            </div>
            <div className="button-section hide">
                <button className="btn btn-save" onClick={this.saveImageHandler}>Save Image</button>
            </div>
        </div>
      </Page>
    );
  }
}

CreateSketch.displayName = 'CreateSketch';

export default connect()(CreateSketch);
