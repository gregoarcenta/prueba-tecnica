import { ComponentFixture, TestBed } from '@angular/core/testing';
import NotFoundPageComponent from './404.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('404Component', () => {
  let fixture: ComponentFixture<NotFoundPageComponent>;
  let component: NotFoundPageComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe de reenderizar "Pagina no encontrada"', () => {
    const element = compiled.querySelector('p');
    expect(element?.textContent).toBe('Página no encontrada');
  });
});
