import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesGuard implements CanActivate {
  constructor(
    public navCtrl: NavController,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let profile = this.authService.getProfile()
    console.log(profile);

    if ([1, 2].includes(profile)) {
      // this.navCtrl.navigateRoot('home');
      return true;
    } else {
      return false;
    }
  }

}
