import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputMaskModule } from '@ngneat/input-mask';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ApiResponse, Category, Product } from '../shared/models/Models';

const API_URL = 'http://localhost:8080';

interface ProductFormData {
  name: string;
  unitPrice: number;
  unitsInStock: number;
  categories: Category[];
  imageUrl: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputMaskModule,
    FontAwesomeModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class productFormComponent implements OnChanges, OnInit {
  @Output() onCloseModel = new EventEmitter<boolean>();
  @Input() data: Product | null = null;

  public productForm: FormGroup;
  public categories: Category[] = [];
  public selectedCategories: Category[] = [];
  public selectedFile: File | null = null;
  public imagePreview: string | null = null;
  public priceValue = '';
  public readonly icons = { close: faX };
  private value = "";
  private indicador = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly toastrService: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(70)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      unitsInStock: ['', [Validators.required, Validators.min(1)]],
      categories: [this.selectedCategories],
      imageUrl: [null]
    });
  }

  public ngOnInit(): void {
    this.getAllCategories();
  }

  public ngOnChanges(): void {
    if (!this.data) return;
    
    this.updateFormWithData();
  }

  public onClose(): void {
    this.resetForm();
    this.onCloseModel.emit(false);
  }

  public async getAllCategories(): Promise<void> {
    try {
      const response = await this.categoryService.getAllCategories().toPromise();
      this.categories = response?.data || [];
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    this.previewImage(this.selectedFile);
  }

  public clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.resetFileInput();
  }

  public isCategorySelected(category: Category): boolean {
    return this.selectedCategories.some(
      selectedCategory => selectedCategory.id === category.id
    );
  }

  public onCategoryChange(event: Event, category: Category): void {
    const checkbox = event.target as HTMLInputElement;
    
    this.selectedCategories = checkbox.checked
      ? [...this.selectedCategories, category]
      : this.selectedCategories.filter(cat => cat.id !== category.id);

    this.productForm.patchValue({ categories: this.selectedCategories });
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    let value = input.value.replace(/\D/g, '');
  
    input.value = this.formatPrice(value)

     const valueArray = [...value]; 

     if (value.length <= 1) {
       value = "00" + value;

     } else {
       if (value.length === 4 && valueArray[0] === '0' && this.indicador === 0) {
         value = valueArray[1] + valueArray[2] + valueArray[3];
       }
     }
    
     const integerPart = value.slice(0, -2); 
     const decimalPart = value.slice(-2); 
     input.value = `R$ ${this.formatWithSeparators(integerPart)},${decimalPart}`;

     this.value = input.value;
  
     setTimeout(() => {
       input.selectionStart = input.value.length;
       input.selectionEnd = input.value.length;
     }, 0);
  }

  private formatWithSeparators(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  public async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    try {
      const submitData = this.prepareFormData();
      
      if (this.data) {
        await this.updateProduct(submitData);
      } else {
        await this.createProduct(submitData);
      }
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  private updateFormWithData(): void {
    this.productForm.patchValue(this.data!);
    
    const formattedPrice = this.formatPrice(this.data!.unitPrice.toString());
    this.priceValue = formattedPrice;
    
    this.updatePriceInput(formattedPrice);
    this.updateImagePreview();
    this.updateSelectedCategories();
  }

  private updatePriceInput(price: string): void {
    setTimeout(() => {
      const input = document.getElementById('unitPrice') as HTMLInputElement;
      if (input) input.value = price;
    });
  }

  private updateImagePreview(): void {
    if (this.data?.imageUrl) {
      this.imagePreview = `${API_URL}${this.data.imageUrl}`;
    }
  }

  private updateSelectedCategories(): void {
    if (this.data?.categories?.length) {
      this.selectedCategories = [...this.data.categories];
      this.productForm.patchValue({ categories: this.selectedCategories });
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private resetFileInput(): void {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  private resetForm(): void {
    this.data = null;
    this.productForm.reset();
    this.selectedCategories = [];
    this.imagePreview = '';
    this.selectedFile = null;
  }

  private formatPrice(value: string): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
    return formatter.format(Number(value)).replace('R$', 'R$ ').trim();
  }

  private convertPriceToNumber(price: string): number {
    if (!price) return 0;
    
    const cleanPrice = price.trim().replace('R$ ', '');
    const [integerPart, decimalPart = '00'] = cleanPrice.split(',');
    
    return parseFloat(`${integerPart.replace(/\./g, '')}.${decimalPart}`);
  }

  private prepareFormData(): FormData {
    const formData = {
      ...this.productForm.value,
      unitPrice: this.convertPriceToNumber(this.value),
      imageUrl: this.imagePreview || ''
    };

    const submitData = new FormData();
    submitData.append('productData', JSON.stringify(formData));
    
    if (this.selectedFile) {
      submitData.append('image', this.selectedFile);
    }

    return submitData;
  }

  private async createProduct(submitData: FormData): Promise<void> {
    await this.productService.createProduct(submitData).toPromise();
    this.toastrService.success('Produto criado com sucesso');
    this.onClose();
  }

  private async updateProduct(submitData: FormData): Promise<void> {
    await this.productService.updateProduct(this.data!.id!, submitData).toPromise();
    this.toastrService.success('Produto atualizado com sucesso!');
    this.onClose();
  }

  private handleError(error: ApiResponse<null>): void {
    error.errors.forEach(errorMessage => {
      this.toastrService.error(errorMessage);
    });
  }
}