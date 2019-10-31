import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAltasComponent } from './admin-altas.component';

describe('AdminAltasComponent', () => {
  let component: AdminAltasComponent;
  let fixture: ComponentFixture<AdminAltasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAltasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
