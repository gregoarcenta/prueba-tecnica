import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';

const mockData = [
  {
    id: 'abc',
    name: 'Tarjetas d credito',
    description: 'Tarjetas de consumo bajo la modalidad de credito',
    logo: 'logoUrl',
    date_release: '2023-02-01T00:00:00.000+00:00',
    date_revision: '2024-02-01T00:00:00.000+00:00',
  },
  {
    id: 'abc1',
    name: 'Tarjetas d credito',
    description: 'Tarjetas de consumo bajo la modalidad de credito',
    logo: 'logoUrl',
    date_release: '2023-02-01T00:00:00.000+00:00',
    date_revision: '2024-02-01T00:00:00.000+00:00',
  },
];

describe('TableComponent', () => {
  let fixture: ComponentFixture<TableComponent>;
  let component: TableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    component.products = jest.fn(() => mockData) as any;
    fixture.detectChanges();
  });

  it('Debe de existir el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe de disminuir la pagina actual', () => {
    // default pag 1

    component.nextPage(); // pag 2
    component.nextPage(); // pag 3
    component.nextPage(); // pag 4

    component.previusPage(); // pag 3

    expect(component.page()).toBe(3);
  });

  it('Debe de aumentar la pagina actual', () => {
    // default pag 1

    component.nextPage(); // pag 2
    component.previusPage(); // pag 1
    component.nextPage(); // pag 2

    expect(component.page()).toBe(2);
  });

  it('Debe de cambiar el limite de la tabla', () => {
    const currentLimit = component.limit();
    const lastPage = component.lastPage(currentLimit);
    const newLimit = '20';

    // Aumenta hasta la pagina 3
    component.nextPage();
    component.nextPage();

    component.changeLimitPage(newLimit);

    // si page() es mayor a lastPage se setea el lastPage en page()
    expect(component.page()).toBe(lastPage);
    expect(component.limit()).toBe(Number(newLimit));
  });
});
