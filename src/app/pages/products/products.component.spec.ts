import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import ProductsComponent from './products.component';
import { FinancialProductsService } from '../../services/financial-products.service';
import { of } from 'rxjs';

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

describe('ProductsComponentPage', () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let component: ProductsComponent;
  let compiled: HTMLElement;

  const financialProductsMock = {
    getProducts: jest.fn(() => of(mockData)),
    products$: of(mockData),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterTestingModule],
      providers: [
        { provide: FinancialProductsService, useValue: financialProductsMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('debe de existir el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe de setear el product$ observable con la data', () => {
    expect(component.products$.getValue()).toEqual(mockData);
  });

  it('Debe de filtrar el item abc1', fakeAsync(() => {
    const term = 'abc1';
    const filteredData = [mockData[1]];

    component.searchProduct(term).subscribe((products) => {
      expect(products).toEqual(filteredData);
    });

    tick();
  }));

  it('Debe guardar los filtrados en products$ al cambiar el control', fakeAsync(() => {
    const term = 'abc1';
    const filteredData = [mockData[1]];
    component.searchProduct = jest.fn().mockReturnValue(of(filteredData));

    //act
    component.searchControl.setValue(term);

    tick(300);

    //assert
    expect(component.searchProduct).toHaveBeenCalledWith(term);
    expect(component.products$.getValue()).toEqual(filteredData);
  }));
});
