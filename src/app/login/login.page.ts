import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validatForm: FormGroup;
  errorMessage: string = '';

  constructor(private navCtrl : NavController, private authService : AuthenticationService, private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.validatForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
 }
 validation_messages = {
  'email': [
    { type: 'required', message: 'Email is required.' },
    { type: 'pattern', message: 'Please enter a valid email.' }
  ],
  'password': [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: 'Password must be at least 5 characters long.' }
  ]
};
 loginUser(user) {
  this.authService.loginUser(user)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.navCtrl.navigateForward('/home');
    }, err => {
      this.errorMessage = err.message;
    })
}
goToRegisterPage() {
  this.navCtrl.navigateForward('/register');
}
}
