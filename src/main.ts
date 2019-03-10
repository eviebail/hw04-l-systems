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
};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;
let system : LSystem = new LSystem();
//for mesh, initMeshBuffers
let obj0: string = readTextFile('./src/resources/penguin.obj');
let mesh : Mesh; 

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();
  mesh = new Mesh(obj0, vec3.fromValues(-1.0,0,0));
  mesh.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  let offsetsArray = [];
  let forwardArray = [];
  let rightArray = [];
  let upArray = [];
  let colorsArray = [];

  //let's use our lsystem to get position!
  //each three offsetsArrays correspond to the pos
  //of the turtle!!

  let pos = system.runSystem();

  //console.log(pos.length);
  let n = pos[0].length;
  for(let i = 0; i < n; i++) {
    let position : vec3 = pos[0][i];
    let forward : vec3 = pos[1][i];
    let right : vec3 = pos[2][i];
    let up : vec3 = pos[3][i];

      console.log("VBO POS: " + position);
      console.log("i: " + i);
      // console.log("VBO UP: " + up);
      // console.log("i: " + i);

      offsetsArray.push(position[0]);
      offsetsArray.push(position[1]);
      offsetsArray.push(position[2]);

      forwardArray.push(forward[0]);
      forwardArray.push(forward[1]);
      forwardArray.push(forward[2]);

      rightArray.push(right[0]);
      rightArray.push(right[1]);
      rightArray.push(right[2]);

      upArray.push(up[0]);
      upArray.push(up[1]);
      upArray.push(up[2]);

      colorsArray.push(i / n);
      colorsArray.push(4.0 / n);
      colorsArray.push(1.0);
      colorsArray.push(1.0); // Alpha channel
      
    }
  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  let forwards: Float32Array = new Float32Array(forwardArray);
  let rights: Float32Array = new Float32Array(rightArray);
  let ups: Float32Array = new Float32Array(upArray);
  square.setInstanceVBOs(offsets, colors);
  square.setNumInstances(n); // grid of "particles"
  mesh.setInstanceVBOs(offsets, colors, forwards, rights, ups);
  mesh.setNumInstances(n);
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
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      square, mesh
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
