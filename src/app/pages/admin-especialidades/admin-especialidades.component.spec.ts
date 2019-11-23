import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEspecialidadesComponent } from './admin-especialidades.component';

describe('AdminEspecialidadesComponent', () => {
  let component: AdminEspecialidadesComponent;
  let fixture: ComponentFixture<AdminEspecialidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEspecialidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
