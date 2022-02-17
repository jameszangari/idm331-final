import * as THREE from "../../node_modules/three/build/three.module.js"; // import { GUI } from "../../node_modules/three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

let controls, camera, scene, renderer;
let textureEquirec, textureCube;
let sphereMesh, sphereMaterial;

init();
animate();

function init() {
  // CAMERAS
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(0, 0, 1000);

  // SCENE
  scene = new THREE.Scene();

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);

  // initialize texture loader
  const textureLoader = new THREE.TextureLoader();
  // allow cross origin loading
  textureLoader.crossOrigin = "";

  // Equirectangular Image
  // Set array of images
  const imageArray = ["./src/images/miami.jpeg", "./src/images/biscayne.jpeg"];
  var textureToShow = 1;

  // Load image
  textureEquirec = textureLoader.load("./src/images/miami.jpeg");
  //   textureEquirec = textureLoader.load(imageArray[textureToShow]);

  // Set image to map
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.encoding = THREE.sRGBEncoding;
  // Set image as scene background
  scene.background = textureEquirec;

  //
  const geometry = new THREE.IcosahedronGeometry(400, 15);
  sphereMaterial = new THREE.MeshLambertMaterial({
    envMap: textureEquirec,
  });
  sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
  scene.add(sphereMesh);

  //
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  //
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 2500;

  // TODO - Multiple Images
  const params = {
    Miami: function () {
      // TODO set up image swapping
      var textureToShow = 0;

      // scene.background = textureEquirec;
      scene.background = textureLoader.load(imageArray[textureToShow]);
      // console.log(textureEquirec);
      // console.log(imageArray);

      // sphereMaterial.envMap = textureEquirec;
      sphereMaterial.envMap = textureLoader.load(imageArray[textureToShow]);
      sphereMaterial.needsUpdate = true;
    },
    Biscayne: function () {
      // TODO set up image swapping
      var textureToShow = 1;

      // scene.background = textureEquirec;
      scene.background = textureLoader.load(imageArray[textureToShow]);
      // console.log(textureEquirec);
      // console.log(imageArray);

      // sphereMaterial.envMap = textureEquirec;
      sphereMaterial.envMap = textureLoader.load(imageArray[textureToShow]);
      sphereMaterial.needsUpdate = true;
    },
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Button Functions
$(function () {
  $("#js-zoom-in").click(function () {
    controls.zoomOut();
    console.log("zoom in");
  });
  $("#js-zoom-out").click(function () {
    controls.zoomIn();
    console.log("zoom out");
  });
  $("#js-reset-cam").click(function () {
    camera.position.set(0, 0, 1000);
    controls.update();
    console.log("camera reset");
  });
  $("#js-refraction").click(function () {
    if ($(this).is(":checked")) {
      textureEquirec.mapping = THREE.EquirectangularRefractionMapping;
    } else {
      textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    }
    sphereMaterial.needsUpdate = true;
  });
  $("#js-autorotate").click(function () {
    if ($(this).is(":checked")) {
      controls.autoRotate = true;
      console.log("autorotate on");
    } else {
      controls.autoRotate = false;
      console.log("autorotate off");
    }
  });
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
