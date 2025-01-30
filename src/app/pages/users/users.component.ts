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
  faLitecoinSign
} from '@fortawesome/free-solid-svg-icons';
import { ApiResponse, User } from '../shared/models/Models';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { InputMaskModule } from '@ngneat/input-mask';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, InputMaskModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  public string: string = "";

  public userForm: FormGroup;
  public users: User[] = [];
  public user: User | null = null;
  public registerNewPassword: boolean = false;

  constructor(
      private readonly fb: FormBuilder,
      private readonly userService: UserService,
      private readonly toastService: ToastrService
  ){
    this.userForm = this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(70)]],
          password: ['', [Validators.required, Validators.maxLength(70)]],
          role: ['user', [Validators.required]],
          login: ['', [Validators.required, Validators.email]]
    })
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

    }

    ngOnInit(): void {
      this.getAllUsers()
    }

    private async getAllUsers(){
      try {
        const response = await firstValueFrom(this.userService.getAllUsers());
        this.users = response.data || [];
        console.log(this.users)
      } catch (error) {
        this.handleError(error as ApiResponse<null>);
      }
    }

    private handleError(error: ApiResponse<null>): void {
      error.errors.forEach(errorMessage => {
        this.toastService.error(errorMessage);
      });
    }

    public editUser(user: User){
      this.user = user;
      console.log(this.user)
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
        this.string = this.userForm.value
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
        console.error('Erro ao deletar:', error);
        this.toastService.error("Erro ao deletar usuário");
      }
    } 

}
