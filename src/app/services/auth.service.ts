import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiCalled } from '../models/api-called.models';
import { FootballPlayers, FootballSquads, FootballTeams } from '../models/football.models';
import { Session } from '../models/login.models';
import { Users } from '../models/users.models';
import { Log } from '../models/log.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public modelSession: Session = {
    token: this.getToken(),
    idUser: this.getIdUser(),
    profile: this.getProfile(),
    email: this.getEmail(),
  };

  public modelLog: Log = {
    logged: this.getLogged(),
  }

  public modelUsers: Users = {
    userList: this.getUsersList(),
  }

  public modelApiCalled: ApiCalled = {
    band: this.getApiCalled(),
  }

  private headers = new HttpHeaders();
  private json: any;

  constructor(private httpClient: HttpClient) { }

  call(data: any, route: any, method: any, status: boolean): Observable<any> {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    // if (route.startsWith('squad') || route.startsWith('player')) {
    //   this.headers = this.headers.set('x-rapidapi-host', 'v3.football.api-sports.io');
    //   this.headers = this.headers.set('x-rapidapi-key', '2a6ba7f0f274a12f31b69e85b7a28db3');
    // }
    switch (method.toUpperCase()) {
      case 'GET':
        if (status === true) {
          this.headers = this.headers.set('auth-token', this.modelSession.token);
          return this.httpClient.get(environment.apiUrl + route, { headers: this.headers });
        } else {
          return this.httpClient.get(environment.apiUrl + route, { headers: this.headers });
        }
      case 'POST':
        if (data != null) {
          if (status === true) {
            this.headers = this.headers.set('auth-token', this.modelSession.token);
            this.json = JSON.stringify(data);
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          } else {
            this.json = JSON.stringify(data);
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          }
        } else {
          if (status === true) {
            this.headers = this.headers.set('auth-token', this.modelSession.token);
            this.json = {};
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          } else {
            this.json = {};
            return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
          }
        }
      case 'PATCH':
        if (data != null) {
          if (status === true) {
            this.headers = this.headers.set('auth-token', this.modelSession.token);
            this.json = JSON.stringify(data);
            return this.httpClient.patch(environment.apiUrl + route, this.json, { headers: this.headers });
          } else {
            this.json = JSON.stringify(data);
            return this.httpClient.patch(environment.apiUrl + route, this.json, { headers: this.headers });
          }
        } else {
          if (status === true) {
            this.headers = this.headers.set('auth-token', this.modelSession.token);
            this.json = {};
            return this.httpClient.patch(environment.apiUrl + route, this.json, { headers: this.headers });
          } else {
            this.json = {};
            return this.httpClient.patch(environment.apiUrl + route, this.json, { headers: this.headers });
          }
        }
      case 'DELETE':
        if (status === true) {
          this.headers = this.headers.set('auth-token', this.modelSession.token);
          return this.httpClient.delete(environment.apiUrl + route, { headers: this.headers });
        } else {
          return this.httpClient.delete(environment.apiUrl + route, { headers: this.headers });
        }

    }

    return this.httpClient.post(environment.apiUrl + route, this.json, { headers: this.headers });
  }

  setModelSesionInSession(modelSession: Session) {
    localStorage.setItem('modelSession', JSON.stringify(modelSession));
  }
  setModelUsers(modelUsers: Users) {
    sessionStorage.setItem('modelUsers', JSON.stringify(modelUsers));
  }
  setModelLog(modelLog: Log) {
    localStorage.setItem('modelLog', JSON.stringify(modelLog));
  }
  setModelApiCalled(modelApiCalled: ApiCalled) {
    sessionStorage.setItem('modelApiCalled', JSON.stringify(modelApiCalled))
  }



  getModelSesion() {
    return localStorage.getItem('modelSession') === null ? null : JSON.parse(localStorage.getItem('modelSession') || '')
  }
  getModelLog() {
    return localStorage.getItem('modelLog') === null ? null : JSON.parse(localStorage.getItem('modelLog') || '')
  }
  getModelUsers() {
    return sessionStorage.getItem('modelUsers') === null ? null : JSON.parse(sessionStorage.getItem('modelUsers') || '')
  }
  getModelApiCalled() {
    return sessionStorage.getItem('modelApiCalled') === null ? null : JSON.parse(sessionStorage.getItem('modelApiCalled') || '');
  }


  setToken(token: any) { this.modelSession.token = token }
  setIdUser(idUser: number) { this.modelSession.idUser = idUser }
  setProfile(profile: any) { this.modelSession.profile = profile }
  setEmail(email: string) { this.modelSession.email = email }
  setLogged(logged: boolean) { this.modelLog.logged = logged }
  setUsersList(list: object[]) { this.modelUsers.userList = list }
  setApiCalled(band: Boolean) { this.modelApiCalled.band = band }

  getToken() { return this.getModelSesion() === null || this.getModelSesion() === undefined ? null : this.getModelSesion().token }
  getIdUser() { return this.getModelSesion() === null || this.getModelSesion() === undefined ? null : this.getModelSesion().idUser }
  getProfile() { return this.getModelSesion() === null || this.getModelSesion() === undefined ? null : this.getModelSesion().profile }
  getEmail() { return this.getModelSesion() === null || this.getModelSesion() === undefined ? null : this.getModelSesion().email }
  getLogged() { return this.getModelLog() === null || this.getModelLog() === undefined ? null : this.getModelLog().logged }
  getUsersList() { return this.getModelUsers() === null || this.getModelUsers() === undefined ? null : this.getModelUsers().userList }
  getApiCalled() { return this.getModelApiCalled() === null || this.getModelApiCalled() === undefined ? null : this.getModelApiCalled().band }
}