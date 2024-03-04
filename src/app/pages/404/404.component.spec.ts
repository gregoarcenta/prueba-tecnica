import { ComponentFixture, TestBed } from '@angular/core/testing';
import NotFoundPageComponent from './404.component';

describe('404Component', () => {
  let fixture: ComponentFixture<NotFoundPageComponent>;
  let component: NotFoundPageComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
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
    const element = compiled.querySelector('div')
    expect(element?.textContent).toBe("Página no encontrada");
  });
});
