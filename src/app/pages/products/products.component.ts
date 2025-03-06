import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTrash, 
  faPen, 
  faBasketShopping, 
  faUpLong, 
  faPlusCircle,
  faUser,
  faSignOut,
  faBox
} from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ModelComponent } from '../shared/ui/model/model.component';
import { productFormComponent } from '../product-form/product-form.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ApiResponse, Category, Product } from '../shared/models/Models';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ModelComponent,
    productFormComponent,
    CategoryFormComponent,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public product!: Product;
  public allProducts: Product[] = [];
  public filterProducts: Product[] = [];
  public filterCategoriesIds: string[] = [];
  public isProductModelOpen = false;
  public isCategoryModelOpen = false;
  public categories: Category[] = [];
  public api_url = 'http://44.211.143.190:8080';
  public localStorage = localStorage

  public readonly icons = {
    upLong: faUpLong,
    basket: faBasketShopping,
    trash: faTrash,
    pen: faPen,
    users: faUser,
    logout: faSignOut
  };

  constructor(
    private readonly productService: ProductService,
    private readonly toastService: ToastrService,
    private readonly categoryService: CategoryService,
    private router: Router
  ) {}

  public async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getAllCategories(),
      this.getAllProducts()
    ]);
    this.filterProducts = this.allProducts;
  }

  goUser(){
    this.router.navigateByUrl("/users")
  }

  logout(){
    this.router.navigateByUrl("login")
    localStorage.removeItem("token_angular")
    localStorage.removeItem("role")
    localStorage.removeItem("login")
  }

  public async getAllProducts(): Promise<void> {
    try {
      const response = await firstValueFrom(this.productService.getAllProducts());
      this.allProducts = response.data || [];
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  public filterProductByName(event: Event): void {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
  
  this.filterProducts = this.allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm)
  );
}

  public async getAllCategories(): Promise<void> {
    try {
      const response = await firstValueFrom(this.categoryService.getAllCategories());
      this.categories = response.data || [];
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  public async onDelete(id: string | undefined): Promise<void> {
    if (!id) return;

    try {
      await firstValueFrom(this.productService.deleteProductById(id));
      this.removeProductFromLists(id);
      this.toastService.success('Produto deletado com sucesso');
    } catch (error) {
      this.handleError(error as ApiResponse<null>);
    }
  }

  public removeStockUnit(
    value: number, 
    product: Product, 
    inputElement: HTMLInputElement
  ): void {
    if(value > product.unitsInStock){
      this.toastService.error("Valor passado maior que a quantidade em estoque")
      return
    }
    product.unitsInStock = product.unitsInStock - value;
    this.resetInputValue(inputElement);
  }

  public addStockUnit(
    value: number, 
    product: Product, 
    inputElement: HTMLInputElement
  ): void {
    if(value < 1){
      this.resetInputValue(inputElement);
      return;
    }
    product.unitsInStock = product.unitsInStock + value;
    this.resetInputValue(inputElement);
  }

  public isSelected(categoryId: string): boolean {
    return this.filterCategoriesIds.includes(categoryId);
  }

  public selectCategory(categoryId: string): void {
    this.filterCategoriesIds = this.isSelected(categoryId)
      ? this.filterCategoriesIds.filter(id => id !== categoryId)
      : [...this.filterCategoriesIds, categoryId];
    
    this.filterProduct();
  }

  public loadProduct(product: Product): void {
    this.product = product;
    this.openProductModel();
  }

  public openProductModel(): void {
    this.isProductModelOpen = true;
  }

  public openCategoryModel(): void {
    this.isCategoryModelOpen = true;
  }

  public async closeProductModel(): Promise<void> {
    this.isProductModelOpen = false;
    await this.getAllProducts();
    this.filterProduct();
  }

  public async closeCategoryModel(): Promise<void> {
    this.isCategoryModelOpen = false;
    await this.getAllCategories();
  }

  private filterProduct(): void {
    this.filterProducts = this.allProducts.filter(product =>
      this.filterCategoriesIds.every(categoryId =>
        product.categories.some(category => category.id === categoryId)
      )
    );
  }

  private removeProductFromLists(id: string): void {
    this.filterProducts = this.filterProducts.filter(product => product.id !== id);
    this.allProducts = this.allProducts.filter(product => product.id !== id);
  }

  private updateProductInList(id: string, updatedProduct: Product): void {
    this.filterProducts = this.filterProducts.map(product =>
      product.id === id ? product = updatedProduct : product
    );
  }

  private resetInputValue(inputElement: HTMLInputElement): void {
    inputElement.value = '1';
  }

  private handleError(error: ApiResponse<null>): void {
    error.errors.forEach(errorMessage => {
      this.toastService.error(errorMessage);
    });
  }
}