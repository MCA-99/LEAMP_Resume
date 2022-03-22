import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';


@Component({
  selector: 'app-cannon-test',
  templateUrl: './cannon-test.component.html',
  styleUrls: ['./cannon-test.component.css']
})
export class CannonTestComponent implements OnInit {

  constructor() { }

  ngOnInit() {

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
    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 20, -30);
    orbit.update();

    /*
    * Create a ground plane to latter add physics to it
    */
    const groundGeo = new THREE.BoxGeometry(30, 0, 30);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: true
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


    /*************/
    /* CANNON.js */
    /*************/
    /*
    * Create world
    * The world defines the physics of the simulation
    */
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0) // simulate earth gravity m/s²
    });
    const timeStep = 1.0 / 60.0; // simulate time in seconds

    /*
    * Add physics to the ground
    */
    const groundBody = new CANNON.Body({
      shape: new CANNON.Plane(),
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(0, 0, 0)
    });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

    /*
    * Add physics to the box
    */
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      position: new CANNON.Vec3(0, 20, 0)
    });
    world.addBody(boxBody);








    /*
    * Start the simulation loop
    */
    function animate() {
      world.step(timeStep);

      // groundMesh.position.copy(groundBody.position); // update the ground position
      // groundMesh.quaternion.copy(groundBody.quaternion); // update the ground rotation
      groundMesh.position.x = groundBody.position.x;
      groundMesh.position.y = groundBody.position.y;
      groundMesh.position.z = groundBody.position.z;

      boxMesh.position.x = boxBody.position.x;
      boxMesh.position.y = boxBody.position.y;
      boxMesh.position.z = boxBody.position.z;

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
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
