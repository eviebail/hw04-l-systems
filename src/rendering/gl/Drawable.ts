import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufTranslate: WebGLBuffer;
  bufRotation: WebGLBuffer;
  bufRight : WebGLBuffer;
  bufUp : WebGLBuffer;
  bufScale : WebGLBuffer;
  bufCol: WebGLBuffer;
  bufUV: WebGLBuffer;
  bufType: WebGLBuffer;

  idxGenerated: boolean = false;
  posGenerated: boolean = false;
  norGenerated: boolean = false;
  colGenerated: boolean = false;
  translateGenerated: boolean = false;
  rotationGenerated: boolean = false;
  rightGenerated: boolean = false;
  upGenerated: boolean = false;
  scaleGenerated: boolean = false;
  typeGenerated: boolean = false;
  uvGenerated: boolean = false;

  numInstances: number = 0; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

  destroy() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufTranslate);
    gl.deleteBuffer(this.bufRotation);
    gl.deleteBuffer(this.bufRight);
    gl.deleteBuffer(this.bufUp);
    gl.deleteBuffer(this.bufScale);
    gl.deleteBuffer(this.bufUV);
    gl.deleteBuffer(this.bufType);
  }

  generateIdx() {
    this.idxGenerated = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posGenerated = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norGenerated = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colGenerated = true;
    this.bufCol = gl.createBuffer();
  }

  generateTranslate() {
    this.translateGenerated = true;
    this.bufTranslate = gl.createBuffer();
  }

  generateRotation() {
    this.rotationGenerated = true;
    this.bufRotation = gl.createBuffer();
  }

  generateRight() {
    this.rightGenerated = true;
    this.bufRight = gl.createBuffer();
  }

  generateUp() {
    this.upGenerated = true;
    this.bufUp = gl.createBuffer();
  }

  generateScale() {
    this.scaleGenerated = true;
    this.bufScale = gl.createBuffer();
  }

  generateUV() {
    this.uvGenerated = true;
    this.bufUV = gl.createBuffer();
  }

  generateType() {
    this.typeGenerated = true;
    this.bufType = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxGenerated) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxGenerated;
  }

  bindPos(): boolean {
    if (this.posGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posGenerated;
  }

  bindNor(): boolean {
    if (this.norGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norGenerated;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindTranslate(): boolean {
    if (this.translateGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    }
    return this.translateGenerated;
  }

  bindRotation(): boolean {
    if (this.rotationGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufRotation);
    }
    return this.rotationGenerated;
  }

  bindRight(): boolean {
    if (this.rightGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufRight);
    }
    return this.rightGenerated;
  }

  bindUp(): boolean {
    if (this.upGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUp);
    }
    return this.upGenerated;
  }

  bindScale(): boolean {
    if (this.scaleGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufScale);
    }
    return this.scaleGenerated;
  }

  bindType(): boolean {
    if (this.typeGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufType);
    }
    return this.typeGenerated;
  }

  bindUV(): boolean {
    if (this.uvGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    }
    return this.uvGenerated;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;
