import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiResponse, Login } from '../shared/models/Models';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  login: Login = {
    login: "",
    password: ""
  }

  constructor(private authService: AuthService, private toastService: ToastrService, private router: Router, private route: ActivatedRoute){

  }

  onLogin(){
    this.authService.login(this.login).subscribe({
      next:(res:any)=>{
        localStorage.setItem("token_angular", res.token)

        const router = this.route.snapshot.queryParamMap.get('stateUrl') || 'products'

        this.router.navigateByUrl(router)
      },
      error: (error: ApiResponse<null>)=>{
        error.errors.forEach(error => this.toastService.error(error))
      }
    })
  }

}
