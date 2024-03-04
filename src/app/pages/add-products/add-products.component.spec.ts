import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import AddProductsComponent from './add-products.component';
import { FinancialProductsService } from '../../services/financial-products.service';
import { of } from 'rxjs';

describe('AddProductsComponent', () => {
  let fixture: ComponentFixture<AddProductsComponent>;
  let component: AddProductsComponent;
  let compiled: HTMLElement;

  const financialProductsMock = {
    verifyProductByID: jest.fn(),
    addProduct: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductsComponent, RouterTestingModule],
      providers: [
        { provide: FinancialProductsService, useValue: financialProductsMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('Debe existir el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe de eviar la peticion -Formulario valido', () => {
    financialProductsMock.verifyProductByID.mockReturnValue(of(false));

    financialProductsMock.addProduct.mockReturnValue(of({}));
    const form = component.productForm;

    component.formReset = jest.fn();

    form.setValue({
      id: 'abc123',
      name: 'Nombre cualquiera',
      description: 'Descripcion',
      logo: 'logo',
      date_release: '2024-12-12',
      date_revision: '2025-12-12',
    });

    //act
    component.formSubmit();

    // asserts
    expect(form.valid).toBeTruthy();
    expect(financialProductsMock.addProduct).toHaveBeenCalledWith(
      form.getRawValue()
    );
    expect(component.formReset).toHaveBeenCalled();
  });

  it('No debe de hacer la peticion - Formulario invalido', () => {
    financialProductsMock.verifyProductByID.mockReturnValue(of(false));

    financialProductsMock.addProduct.mockReturnValue(of({}));
    const form = component.productForm;

    //act
    component.formSubmit();

    // asserts
    expect(form.invalid).toBeTruthy();
    expect(financialProductsMock.addProduct).not.toHaveBeenCalled();
  });

  it('Debe de resetear el formulario al dar click en nel boton', () => {
    const form = component.productForm;
    form.reset = jest.fn();
    //act
    component.formReset();

    // asserts
    expect(form.reset).toHaveBeenCalled();
  });
});
