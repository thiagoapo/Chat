import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatListComponent } from './domain/chat/chat-list/chat-list.component';

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: './domain/chat/chat.module#ChatModule'
  },
  {
    path: 'contact',
    loadChildren: './domain/contact/contact.module#ContactModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
