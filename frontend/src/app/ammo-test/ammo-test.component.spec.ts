import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmmoTestComponent } from './ammo-test.component';

describe('AmmoTestComponent', () => {
  let component: AmmoTestComponent;
  let fixture: ComponentFixture<AmmoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmmoTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmmoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
