import { Component, OnInit } from '@angular/core';
import * as STATS from 'stats.ts';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-cannon-test',
  templateUrl: './cannon-test.component.html',
  styleUrls: ['./cannon-test.component.css']
})
export class CannonTestComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // Show fps
    var stats = new STATS.Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);


    /*************/
    /* THREE.js */
    /*************/
    /*
    * Create a renderer, a camera and a scene
    * The camera has a orbit controll added
    */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // fov
      window.innerWidth / window.innerHeight, // aspect
      0.1, // near
      1000 // far
    );
    // const orbit = new OrbitControls(camera, renderer.domElement);
    // camera.position.set(0, 20, -30);
    // orbit.update();

    /*
    * Add light to the scene
    */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(-5, 25, 8);
    const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
    scene.add(directionalLight);
    scene.add(helper);

    /*
    * Create a ground plane to latter add physics to it
    */
    const groundGeo = new THREE.BoxGeometry(100, 100, 0);
    const groundMat = new THREE.MeshBasicMaterial({
      color: "#757575",
      side: THREE.DoubleSide,
      // wireframe: true
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    scene.add(groundMesh);

    /*
    * Create a box to latter add physics to it
    */

    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    scene.add(boxMesh);

    /*
    * Create a sphere to latter add physics to it
    */
    const sphereGeo = new THREE.SphereGeometry(2, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    /*
    * Create a box with physics to add a custom 3d model to it
    */
    const boxGeo3d = new THREE.BoxGeometry(2, 10, 2);
    const boxMat3d = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true
    });
    const boxMesh3d = new THREE.Mesh(boxGeo3d, boxMat3d);

    const boxModel3d = new GLTFLoader();
    boxModel3d.load('assets/tree.glb', (gltf) => {
      gltf.scene.scale.set(0.008, 0.01, 0.008);
      gltf.scene.position.set(0, -5, 0);
      boxMesh3d.add(gltf.scene);
    });

    scene.add(boxMesh3d);

    /*
    * Create a player to latter add physics to it
    */
    const playerGeo = new THREE.BoxGeometry(2, 2, 3);
    const playerMat = new THREE.MeshBasicMaterial({
      color: '#fffb00',
      wireframe: true,
      // transparent: true,
      // opacity: 0
    });
    const playerMesh = new THREE.Mesh(playerGeo, playerMat);

    const playerModel = new GLTFLoader();
    playerModel.load('assets/car.glb', (gltf) => {
      gltf.scene.scale.set(0.003, 0.003, 0.003);
      gltf.scene.position.set(0, -1, 0);
      playerMesh.add(gltf.scene);
    });

    scene.add(playerMesh);





    /*************/
    /* CANNON.js */
    /*************/
    /*
    * Create world
    * The world defines the physics of the simulation
    */
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0) // simulate earth gravity m/s²
    });

    /*
    * Add physics to the ground
    */
    const groundPhysMat = new CANNON.Material();
    const objectPhysMat = new CANNON.Material();

    const groundBody = new CANNON.Body({
      // shape: new CANNON.Plane(), // (crea un suelo infinito)
      shape: new CANNON.Box(new CANNON.Vec3(50, 50, 0.1)),
      type: CANNON.Body.STATIC,
      material: groundPhysMat
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    /*
    * Add physics to the box
    */
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      position: new CANNON.Vec3(1, 20, 0),
      material: objectPhysMat
    });
    world.addBody(boxBody);
    boxBody.linearDamping = 0.05;
    boxBody.angularDamping = 0.05;
    boxBody.angularVelocity.set(0, 5, 0);

    /*
    * Add physics to the sphere
    */
    const sphereBody = new CANNON.Body({
      mass: 10,
      shape: new CANNON.Sphere(2),
      position: new CANNON.Vec3(0, 15, 0),
      material: objectPhysMat
    });
    world.addBody(sphereBody);
    sphereBody.linearDamping = 0.05;
    sphereBody.angularDamping = 0.05;

    /*
    * Add physics to the box with 3d model
    */
    const boxBody3d = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)),
      position: new CANNON.Vec3(21, 5, 0),
      material: objectPhysMat
    });
    world.addBody(boxBody3d);
    boxBody3d.linearDamping = 0.05;
    boxBody3d.angularDamping = 0.05;

    /*
    * Add physics to the player
    */
    const playerBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1.5)),
      position: new CANNON.Vec3(-20, 2, -20),
      material: objectPhysMat
    });
    world.addBody(playerBody);
    playerBody.linearDamping = 0.99;
    playerBody.angularDamping = 1;
    playerBody.fixedRotation = true;

    /*
    * Define physics properties for created materials
    */
    const contactMat = new CANNON.ContactMaterial(
      groundPhysMat,
      objectPhysMat,
      { friction: 0.005, restitution: 0.2 }
    );
    world.addContactMaterial(contactMat);






    /*******************/
    /* PLAYER MOVEMENT */
    /*******************/
    /*
    * Add keyboard controls to player
    */
    var keysPressed: Array<any> = [];
    keysPressed[37] = false;
    keysPressed[38] = false;
    keysPressed[39] = false;
    keysPressed[40] = false;
    keysPressed[16] = false;
    let speed = 0;
    let maxSpeed = 1.3;
    let maxReverseSpeed = 0.8;
    let minSpeed = 0;
    let turboSpeed = 1.8;
    let rotationSpeed = 0;
    let maxRotationSpeed = 1;
    let maxReverseRotationSpeed = 0.8
    let reverse = false;
    let incline = 0;


    function movePlayer() {
      if (keysPressed[38]) { // up
        if (keysPressed[16] && speed < turboSpeed) { // turbo
          speed = speed + 0.03;
        } else if (speed < maxSpeed) {
          speed = speed + 0.03;
        }
        if (rotationSpeed < maxRotationSpeed) {
          rotationSpeed = rotationSpeed + 0.02;
        }
        reverse = false;
        playerBody.applyLocalImpulse(new CANNON.Vec3(0, 0, speed), new CANNON.Vec3(0, 0, 0));
      }
      if (keysPressed[40]) { // down
        if (speed < maxReverseSpeed) {
          speed = speed + 0.03;
        }
        if (rotationSpeed < maxReverseRotationSpeed) {
          rotationSpeed = rotationSpeed + 0.02;
        }
        reverse = true;
        playerBody.applyLocalImpulse(new CANNON.Vec3(0, 0, -speed), new CANNON.Vec3(0, 0, 0));
      }
      if (keysPressed[37] && speed != minSpeed) { // left
        playerBody.quaternion = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, rotationSpeed, 0), Math.PI / 2 * delta).mult(playerBody.quaternion);
        if (speed > 0.8 && !keysPressed[40]) {
          if (incline <= 0.3) {
            incline = incline + 0.01;
          }
          playerMesh.rotation.z = playerMesh.rotation.z + Math.PI / 2 * delta + incline;
        }
      }
      if (keysPressed[39] && speed != minSpeed) { // right
        playerBody.quaternion = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, -rotationSpeed, 0), Math.PI / 2 * delta).mult(playerBody.quaternion);
        if (speed > 0.8) {
          if (incline <= 0.3) {
            incline = incline + 0.01;
          }
          playerMesh.rotation.z = playerMesh.rotation.z + Math.PI / 2 * delta - incline;
        }
      }

      // detect if player stop pressing up or down key and set speed to 0 progressively
      if (!keysPressed[38] && !keysPressed[40]) {
        if (speed > 0 && reverse == false) {
          speed = speed - 0.025;
          playerBody.applyLocalImpulse(new CANNON.Vec3(0, 0, speed), new CANNON.Vec3(0, 0, 0));
          if (rotationSpeed > 0) {
            rotationSpeed = rotationSpeed - 0.025;
          }
        } else if (speed > 0 && reverse == true) {
          speed = speed - 0.025;
          playerBody.applyLocalImpulse(new CANNON.Vec3(0, 0, -speed), new CANNON.Vec3(0, 0, 0));
          if (rotationSpeed > 0) {
            rotationSpeed = rotationSpeed - 0.025;
          }
        }
      }

      // detect if player stop pressing left or right key and set inclination to 0 progressively
      if (!keysPressed[37] && !keysPressed[39]) {
        if (incline > 0) {
          incline = incline - 0.01;
        }
      }


      // Sanitize speeds values
      if (speed < 0) {
        speed = 0;
      }
      if (rotationSpeed < 0) {
        rotationSpeed = 0;
      }
      if (incline < 0) {
        incline = 0;
      }

      console.log("speed:" + speed + "\nrotationSpeed:" + rotationSpeed + "\nincline:" + incline);
    }

    const detectKeyPress = (e: { keyCode: any; }) => {
      const key = e.keyCode;
      keysPressed[key] = true;
    }
    document.addEventListener('keydown', detectKeyPress);

    const detectKeyUp = (e: { keyCode: any; }) => {
      const key = e.keyCode;
      keysPressed[key] = false;
    }
    document.addEventListener('keyup', detectKeyUp);





    /*
    * Update position of the camera to follow the player
    */
    function updateCameraPosition() {
      const playerPosition = new THREE.Vector3();
      playerMesh.getWorldPosition(playerPosition);
      camera.position.copy(playerPosition).add(new THREE.Vector3(-5, 15, -15));
      camera.lookAt(playerPosition);
    }

    /*
    * Update positions of the meshes with the bodies
    */
    function updatePhysics() {
      const listOfMesh = [groundMesh, boxMesh, sphereMesh, boxMesh3d, playerMesh]; // list of all meshes used in the scene
      const listOfBodies = [groundBody, boxBody, sphereBody, boxBody3d, playerBody]; // list of all bodies used in the scene

      for (let i = 0; i < listOfMesh.length; i++) {
        listOfMesh[i].position.set(listOfBodies[i].position.x, listOfBodies[i].position.y, listOfBodies[i].position.z);
        listOfMesh[i].quaternion.set(listOfBodies[i].quaternion.x, listOfBodies[i].quaternion.y, listOfBodies[i].quaternion.z, listOfBodies[i].quaternion.w);
      }
    }

    /*
    * Start the simulation loop (locked to 60fps)
    */
    let clock = new THREE.Clock();
    let delta = 0; // time since last frame
    let interval = 1 / 60; // 60 fps

    function animate() {
      stats.begin(); // begin measuring fps

      world.fixedStep(1 / 60) // step the world (seconds per frame)

      requestAnimationFrame(animate); // request next frame
      delta += clock.getDelta(); // get time since last frame

      if (delta > interval) { // if enough time has passed
        updatePhysics();
        movePlayer();
        updateCameraPosition();
        renderer.render(scene, camera); // render scene
        delta = delta % interval; // reset delta

        stats.end(); // end measuring fps
      }
    }
    renderer.setAnimationLoop(animate);

    /*
    * Check if the user resizes the window
    * If so, update the camera and the renderer
    */
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

}
