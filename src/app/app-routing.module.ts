import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AdminAltasComponent } from './pages/admin-altas/admin-altas.component';




const routes: Routes = [

  // no layout routes
    { path: 'login', component: LoginComponent, data: {animation: 'isRight'}},
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'register', component: RegisterComponent, data: {animation: 'isLeft'}},

  // dashboard layout routes
    { path: '', component: DashboardComponent,
      children: [
        {path: 'profile' , component: UserProfileComponent},
        {path: 'altas' , component: AdminAltasComponent},
      ]
    }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
