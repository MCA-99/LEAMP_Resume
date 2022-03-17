import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cube3dComponent } from './cube3d.component';

describe('Cube3dComponent', () => {
  let component: Cube3dComponent;
  let fixture: ComponentFixture<Cube3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cube3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cube3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
