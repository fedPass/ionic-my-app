import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthFireService } from '../services/auth-fire.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user = null;
  positionsList = [];

  constructor(
    private auth: AuthFireService,
    private router: Router
  ) {
    this.user = this.auth.getUserProfile();
  }

  ngOnInit(): void {
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/', {replaceUrl: true });
  }

  addNewPosition(){
    //code
    console.log('click add new position');
  }

}
