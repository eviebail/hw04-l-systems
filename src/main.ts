import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import LSystem from './LSystem';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
    Leaf_Type: 0,
    StartingAxiom: 0,
    NumIterations: 4,
};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;
let system : LSystem;
//for mesh, initMeshBuffers
let obj0: string = readTextFile('./src/resources/twig.obj');
let obj1: string = readTextFile('./src/resources/blossom.obj');
let obj2: string = readTextFile('./src/resources/ground.obj');
let mesh : Mesh;
let leaves : Mesh; 
let ground : Mesh;

function loadScene() {
  system = new LSystem(controls.StartingAxiom, controls.NumIterations);
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();
  mesh = new Mesh(obj0, vec3.fromValues(0,0,0));
  mesh.create();
  leaves = new Mesh(obj1, vec3.fromValues(0,0,0));
  leaves.create();
  ground = new Mesh(obj2, vec3.fromValues(0,0,0));
  ground.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  //for bark
  let offsetsArrayM = [];
  let forwardArrayM = [];
  let rightArrayM = [];
  let upArrayM = [];
  let scaleArrayM = [];
  let colorsArrayM = [];
  let typeArrayM = [];

  //for the leaves
  let offsetsArrayL = [];
  let forwardArrayL = [];
  let rightArrayL = [];
  let upArrayL = [];
  let scaleArrayL = [];
  let colorsArrayL = [];
  let typeArrayL = [];

  //let's use our lsystem to get position!
  //each three offsetsArrays correspond to the pos
  //of the turtle!!

  let pos = system.runSystem();

  //console.log(pos.length);
  let n = pos[0].length;
  let nM = 0;
  let nL = 0;
  for(let i = 0; i < n; i++) {
    let position : vec3 = pos[0][i];
    let forward : vec3 = pos[1][i];
    let right : vec3 = pos[2][i];
    let up : vec3 = pos[3][i];
    let scale : vec3 = pos[4][i];
    let depth : vec3 = pos[5][i];

    if (depth[0] > 1) {
      //leaves!
      nL+=1;
      //console.log("VBO POS: " + position);
      //console.log("i: " + i);
      // console.log("VBO UP: " + up);
      // console.log("i: " + i);

      offsetsArrayL.push(position[0]);
      offsetsArrayL.push(position[1] - 10);
      offsetsArrayL.push(position[2]);

      forwardArrayL.push(forward[0]);
      forwardArrayL.push(forward[1]);
      forwardArrayL.push(forward[2]);

      rightArrayL.push(right[0]);
      rightArrayL.push(right[1]);
      rightArrayL.push(right[2]);

      upArrayL.push(up[0]);
      upArrayL.push(up[1]);
      upArrayL.push(up[2]);

      scaleArrayL.push(scale[0]);
      scaleArrayL.push(scale[1]);
      scaleArrayL.push(scale[2]);

      colorsArrayL.push(99.0 / 255.0);
      colorsArrayL.push(161.0 / 255.0);
      colorsArrayL.push(75.0 / 255.0);
      colorsArrayL.push(1.0); // Alpha channel

      typeArrayL.push(1.0);
      typeArrayL.push(1.0);
      typeArrayL.push(controls.Leaf_Type);
    } else {
      nM+=1;
      //console.log("VBO POS: " + position);
      //console.log("i: " + i);
      // console.log("VBO UP: " + up);
      // console.log("i: " + i);

      offsetsArrayM.push(position[0]);
      offsetsArrayM.push(position[1] - 10);
      offsetsArrayM.push(position[2]);

      forwardArrayM.push(forward[0]);
      forwardArrayM.push(forward[1]);
      forwardArrayM.push(forward[2]);

      rightArrayM.push(right[0]);
      rightArrayM.push(right[1]);
      rightArrayM.push(right[2]);

      upArrayM.push(up[0]);
      upArrayM.push(up[1]);
      upArrayM.push(up[2]);

      scaleArrayM.push(scale[0]);
      scaleArrayM.push(scale[1]);
      scaleArrayM.push(scale[2]);

      typeArrayM.push(2.0);
      typeArrayM.push(2.0);
      typeArrayM.push(controls.Leaf_Type);

      colorsArrayM.push(186.0 / 255.0);
      colorsArrayM.push(202.0 / 255.0);
      colorsArrayM.push(114.0 / 255.0);
      colorsArrayM.push(1.0); // Alpha channel
    }
   
    }
  let offsets: Float32Array = new Float32Array(offsetsArrayM);
  let colors: Float32Array = new Float32Array(colorsArrayM);
  let forwards: Float32Array = new Float32Array(forwardArrayM);
  let rights: Float32Array = new Float32Array(rightArrayM);
  let ups: Float32Array = new Float32Array(upArrayM);
  let scales: Float32Array = new Float32Array(scaleArrayM);
  let typesM: Float32Array = new Float32Array(typeArrayM);
  mesh.setInstanceVBOs(offsets, colors, forwards, rights, ups, scales, typesM);
  mesh.setNumInstances(nM);

  let offsetsL: Float32Array = new Float32Array(offsetsArrayL);
  let colorsL: Float32Array = new Float32Array(colorsArrayL);
  let forwardsL: Float32Array = new Float32Array(forwardArrayL);
  let rightsL: Float32Array = new Float32Array(rightArrayL);
  let upsL: Float32Array = new Float32Array(upArrayL);
  let scalesL: Float32Array = new Float32Array(scaleArrayL);
  let typesL: Float32Array = new Float32Array(typeArrayL);
  leaves.setInstanceVBOs(offsetsL, colorsL, forwardsL, rightsL, upsL, scalesL, typesL);
  leaves.setNumInstances(nL);

  let offsetsArrayG = [];
  let colorsArrayG = [];
  let forwardArrayG = [];
  let rightArrayG = [];
  let upArrayG = [];
  let scaleArrayG = [];
  let typeArrayG = [];

  offsetsArrayG.push(0);
  offsetsArrayG.push(-22 - 10);
  offsetsArrayG.push(0);

  forwardArrayG.push(1);
  forwardArrayG.push(0);
  forwardArrayG.push(0);

  rightArrayG.push(0);
  rightArrayG.push(1);
  rightArrayG.push(0);

  upArrayG.push(0);
  upArrayG.push(0);
  upArrayG.push(1);

  scaleArrayG.push(1);
  scaleArrayG.push(1);
  scaleArrayG.push(1);

  typeArrayG.push(3.0);
  typeArrayG.push(3.0);
  typeArrayG.push(controls.Leaf_Type);

  colorsArrayG.push(97.0 / 255.0);
  colorsArrayG.push(190.0 / 255.0);    
  colorsArrayG.push(75.0 / 255.0);
  colorsArrayG.push(1.0);

  let offsetsG: Float32Array = new Float32Array(offsetsArrayG);
  let colorsG: Float32Array = new Float32Array(colorsArrayG);
  let forwardsG: Float32Array = new Float32Array(forwardArrayG);
  let rightsG: Float32Array = new Float32Array(rightArrayG);
  let upsG: Float32Array = new Float32Array(upArrayG);
  let scalesG: Float32Array = new Float32Array(scaleArrayG);
  let typesG: Float32Array = new Float32Array(typeArrayG);
  ground.setInstanceVBOs(offsetsG, colorsG, forwardsG, rightsG, upsG, scalesG, typesG);
  ground.setNumInstances(1.0);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'Leaf_Type', 0, 1).step(1);
  gui.add(controls, 'StartingAxiom', 0, 2).step(1);
  gui.add(controls, 'NumIterations', 0, 5).step(1);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  let prevLeaf = controls.Leaf_Type;
  let prevAxiom = controls.StartingAxiom;
  let prevExpan = controls.NumIterations;//NumIterations
  function tick() {
    let leafChanged : boolean = false;
    if (controls.Leaf_Type - prevLeaf != 0.0) {
      prevLeaf = controls.Leaf_Type;
      loadScene();
    }
    if (controls.StartingAxiom - prevAxiom != 0.0) {
      prevAxiom = controls.StartingAxiom;
      loadScene();
    }
    if (controls.NumIterations - prevExpan != 0.0) {
      prevExpan = controls.NumIterations;
      //obj1 = readTextFile('./src/resources/penguin.obj');
      loadScene();
    }
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      mesh, leaves, ground
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
