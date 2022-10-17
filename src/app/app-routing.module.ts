import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    title: 'Login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register',
    title: 'Register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    ...canActivate(redirectLoggedInToHome)

  },
  {
    path: 'home',
    title: 'Home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'my-map',
    title: 'Map',
    loadChildren: () => import('./pages/my-map/my-map.module').then( m => m.MyMapPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'earthquake-list',
    loadChildren: () => import('./pages/earthquake-list/earthquake-list.module').then( m => m.EarthquakeListPageModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
