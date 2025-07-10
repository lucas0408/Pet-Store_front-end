import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { 
  faTrash, 
  faPen, 
  faBasketShopping, 
  faUpLong, 
  faPlusCircle,
  faUser,
  faSignOut,
  faBox,
  faLitecoinSign,
  faSignal
} from '@fortawesome/free-solid-svg-icons';
import { ApiResponse, User } from '../shared/models/Models';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { InputMaskModule } from '@ngneat/input-mask';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, InputMaskModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnChanges{

  public userForm: FormGroup;
  public users: User[] = [];
  public user: User | null = null;
  public registerNewPassword: boolean = false;
  public localStorage = localStorage

  constructor(
      private readonly fb: FormBuilder,
      private readonly userService: UserService,
      private readonly toastService: ToastrService,
      private router: Router
  ){
    this.userForm = this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(70)]],
          password: ['', [Validators.required, Validators.maxLength(70)]],
          role: ['user', [Validators.required]],
          login: ['', [Validators.required, Validators.email]]
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

    public readonly icons = {
      plus: faPlusCircle,
      upLong: faUpLong,
      basket: faBasketShopping,
      trash: faTrash,
      pen: faPen,
      users: faUser,
      logout: faSignOut,
      box: faBox
    };

    goProducts(){
      this.router.navigateByUrl("/products")
    }

    public toggleNewPassword(): void {
      this.registerNewPassword = !this.registerNewPassword;
      const passwordControl = this.userForm.get('password');
      
      if (this.registerNewPassword) {
        passwordControl?.setValue('');
      } else {
        passwordControl?.setValue('any');
      }
    }
    
    private updateFormWithData(): void {
      this.userForm.patchValue(this.user!);
      this.userForm.get('password')?.setValue('any')
    }

    logout(){
      this.router.navigateByUrl("login")
      localStorage.removeItem("token_angular")
      localStorage.removeItem("role")
      localStorage.removeItem("login")
    }

    ngOnInit(): void {
      this.getAllUsers()
    }

    private async getAllUsers(){
      try {
        const response = await firstValueFrom(this.userService.getAllUsers());
        this.users = response || [];
        console.log(this.users)
      } catch (error) {
        this.handleError(error as ApiResponse<null>);
      }
    }

    private handleError(error: ApiResponse<null>): void {
      if (error && error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => this.toastService.error(err));
      } else {
        this.toastService.error('An error occurred');
        console.error('Error details:', error);
      }
    
    }

    public editUser(user: User){
      if(!this.localStorage.getItem('login')){
        this.logout()
      }
      this.user = user;
      this.updateFormWithData()
    }

    public async onSubmit() {
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
      }

      try {
        if (this.user) {
          await this.updateUser();
        } else {
          await this.createUser();
        }
      } catch (error) {
        this.handleError(error as ApiResponse<null>);
      }
      
      await this.getAllUsers();
      this.resetForm()
    }

    private async updateUser(){
      try{
        const response = await firstValueFrom(
          this.userService.updateUser(this.user!.id!, this.userForm.value)
        );
        this.toastService.success("Usuário atualizado com sucesso")
        this.user = null
      } catch (error) {
        this.handleError(error as ApiResponse<null>);
      }
    }

    private async createUser(){
      try {
        const response = await firstValueFrom(
          this.userService.createUser(this.userForm.value)
        );
        this.toastService.success("Usuario criado com sucesso");
      } catch (error) {
        this.handleError(error as ApiResponse<null>);
      }
    }

    public resetForm(){
      this.userForm.reset({ role: 'user' });
      this.user = null
      this.registerNewPassword = false;
    }

    public async deleteUser(id: string) {
      if (!id) {
        this.toastService.error("ID do usuário inválido");
        return;
      }
      
      try {
        await firstValueFrom(this.userService.deleteUserById(id));
        this.toastService.success("Usuário deletado com sucesso");
        await this.getAllUsers();
      } catch (error) {
        this.toastService.error("Erro ao deletar usuário");
      }
    } 

}
