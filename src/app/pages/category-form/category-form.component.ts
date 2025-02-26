import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

import { CategoryService } from '../../services/category.service';
import { ApiResponse, Category } from '../shared/models/Models';

const API_URL = 'https://pet-store-render.onrender.com';

interface CategoryFormData {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  @Output() onCloseModel = new EventEmitter<boolean>();

  public categoryForm: FormGroup;
  public categoryFound = false;
  public imagePreview?: string;
  public selectedFile: File | null = null;
  public readonly icons = {
    search: faMagnifyingGlass,
    close: faX
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly toastrService: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(70)]],
      imageUrl: [null]
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const submitData = this.prepareFormData();

    try {
      await this.createOrUpdateCategory(submitData);
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
    this.imagePreview = undefined;
    this.resetFileInput();
  }

  public async findCategory(): Promise<void> {
    const categoryName = this.categoryForm.get('name')?.value;
    if (!categoryName) return;

    try {
      const response = await this.categoryService.getCategoryByName(categoryName).toPromise();
      this.handleCategoryFound(response!);
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  public clearInput(): void {
    this.categoryFound = false;
    this.imagePreview = undefined;
    this.selectedFile = null;
  }

  public async deleteCategory(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryName = this.categoryForm.get('name')?.value;
    if (!categoryName) return;

    try {
      const category = await this.categoryService.getCategoryByName(categoryName).toPromise();
      await this.categoryService.deleteCategoryById(category!.data?.id!).toPromise();
      this.toastrService.success('Categoria excluída com sucesso');
      this.onClose();
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  public onClose(): void {
    this.onCloseModel.emit(false);
    this.resetForm();
  }

  private prepareFormData(): FormData {
    const submitData = new FormData();
    const formData: CategoryFormData = {
      ...this.categoryForm.value,
      imageUrl: this.imagePreview || ''
    };

    submitData.append('categoryData', JSON.stringify(formData));
    if (this.selectedFile) {
      submitData.append('image', this.selectedFile);
    }

    return submitData;
  }

  private async createOrUpdateCategory(submitData: FormData): Promise<void> {
    try {
      await this.categoryService.createCategory(submitData).toPromise();
      this.toastrService.success('Categoria criada com sucesso');
      this.onClose();
    } catch {
      if (this.categoryFound) {
        const formData = this.categoryForm.value;
        const existingCategory = await this.categoryService.getCategoryByName(formData.name).toPromise();
        
        await this.categoryService.updateCategory(existingCategory!.data?.id!, submitData).toPromise();
        this.toastrService.success('Categoria atualizada com sucesso');
        this.onClose();

      } else {

        this.findCategory()
      }
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
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private handleCategoryFound(response: ApiResponse<Category>): void {
    if (response.data?.imageUrl) {
      this.imagePreview = `${API_URL}${response.data.imageUrl}`;
    }
    this.categoryFound = true;
    this.toastrService.success('Categoria encontrada');
  }

  private handleError(error: ApiResponse<null>): void {
    error.errors.forEach(errorMessage => {
      this.toastrService.error(errorMessage);
    });
    this.categoryFound = false;
  }

  private resetForm(): void {
    this.categoryForm.reset();
    this.imagePreview = undefined;
    this.selectedFile = null;
  }
}