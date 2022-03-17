import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-cube3d',
  templateUrl: './cube3d.component.html',
  styleUrls: ['./cube3d.component.css']
})
export class Cube3dComponent implements OnInit, AfterViewInit {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


  constructor() { }

  ngOnInit(): void {
    this.scene.background = new THREE.Color(0xffffff);
    this.camera.position.set(0, 0, 10);
  }

  ngAfterViewInit() {
  }

}
