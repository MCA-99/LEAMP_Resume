import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CannonTestComponent } from './cannon-test.component';

describe('CannonTestComponent', () => {
  let component: CannonTestComponent;
  let fixture: ComponentFixture<CannonTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CannonTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannonTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
