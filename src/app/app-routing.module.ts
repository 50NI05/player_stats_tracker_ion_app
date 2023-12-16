import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IngresadoGuard } from './guards/ingresado.guard';
import { NoIngresadoGuard } from './guards/no-ingresado.guard';
import { RoutesGuard } from './guards/routes.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./components/registro/registro.module').then(m => m.RegistroPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./components/inicio/inicio.module').then(m => m.InicioPageModule),
    canActivate: [RoutesGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./components/logout/logout.module').then(m => m.LogoutPageModule)
  },
  {
    path: 'statistics',
    loadChildren: () => import('./components/statistics/statistics.module').then(m => m.StatisticsPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'add-team',
    loadChildren: () => import('./components/add-team/add-team.module').then(m => m.AddTeamPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'user-information',
    loadChildren: () => import('./components/user-information/user-information.module').then(m => m.UserInformationPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'add-player',
    loadChildren: () => import('./components/add-player/add-player.module').then(m => m.AddPlayerPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomePageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'chat-bot',
    loadChildren: () => import('./components/chat-bot/chat-bot.module').then(m => m.ChatBotPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./components/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule),
  },
  {
    path: 'table-players',
    loadChildren: () => import('./components/table-players/table-players.module').then(m => m.TablePlayersPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'player-details',
    loadChildren: () => import('./components/player-details/player-details.module').then(m => m.PlayerDetailsPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  },
  {
    path: 'team-details',
    loadChildren: () => import('./components/team-details/team-details.module').then(m => m.TeamDetailsPageModule),
    canActivate: [IngresadoGuard, RoutesGuard]
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
