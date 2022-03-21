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

    /*
    * Create a renderer, a camera and a scene
    * The camera has a orbit controll added
    * THREE.js
    */
    const renderer = new THREE.WebGLRenderer();
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
    * Create world
    * The world defines the physics of the simulation
    * CANNON.js
    */
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0) // simulate earth gravity m/s²
    });
    const timeStep = 1.0 / 60.0; // simulate time in seconds


    /*
    * Create a ground
    */
    const floorGeometry = new THREE.BoxGeometry(30, 30, 0);
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    const floorBody = new CANNON.Body({
      shape: new CANNON.Plane()
    });
    world.addBody(floorBody);











    /*
    * Animates the scene
    */
    function animate() {
      world.step(timeStep);
      groundMesh.position.copy(floorBody.position);
      groundMesh.quaternion.copy(floorBody.quaternion);
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
