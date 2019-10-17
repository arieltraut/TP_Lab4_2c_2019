import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';




const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {animation: 'Fade2Page'}},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'register', component: RegisterComponent}


];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
