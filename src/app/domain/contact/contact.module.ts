import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LinkModalComponent } from './link-modal/link-modal.component';
import { ChatModalComponent } from './chat-modal/chat-modal.component';

@NgModule({
  declarations: [
    ContactListComponent,
    LinkModalComponent,
    ChatModalComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ContactRoutingModule
  ],
  exports: [
    LinkModalComponent,
    ChatModalComponent
  ],
  providers: [],
  entryComponents:[
    LinkModalComponent
  ],
  bootstrap: [ContactListComponent]
})
export class ContactModule { }
