import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../../models/contact';
import { ContactService } from '../../../services/contact.service';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { Guid } from 'guid-typescript';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LinkModalComponent } from '../link-modal/link-modal.component';
import { LinkService } from '../../../services/link.service';
import { Link } from '../../../models/link';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';
import { ModalType } from '../../../models/enums/modal-type';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnDestroy  {

  list: Contact[];
  links: Link[];
  linksSend: Link[];
  modals = new Array<NgbModalRef>();

  subscriptionContact: Subscription;
  subscriptionLinkReveice: Subscription;
  subscriptionLinkSend: Subscription;

  meId: string;
  meName: string;
  
  constructor(private router: Router,
    private service: ContactService,
    private linkService: LinkService,
    private modalService: NgbModal) { 
  }

  ngOnInit(): void {
    this.meId = Guid.create().toString();
    this.list = new Array<Contact>();
    this.links = new Array<Link>();
    this.linksSend = new Array<Link>();

    this.subscriptionContact = this.service.getAll().subscribe(result => {
      var newList = this.list.filter(p=>p.isNew);
      this.list = result;
      if(newList && newList.length > 0)
        newList.forEach(p => this.list.push(p));
    });

    //receive
    this.subscriptionLinkReveice = this.linkService.get(this.meId).subscribe(result => {
      if(result && result.length > 0){
        const link = result[result.length - 1];
        if(!this.links.find(p=> p.id ==link.id )){
          this.links.push(link);
          var contact = this.list.find(p=>p.me == link.origin);
          this.openModal(link.id, false, contact);
        }
      }

      this.links.forEach(l => {
        if(!result.find(p=> p.id == l.id)){
          const modal = this.modals.find(p=>  p.componentInstance &&  p.componentInstance.type == ModalType.Link   &&   p.componentInstance.contact.me == l.origin );
          if(modal) {
            modal.close(false);
          }
        }
      });
    });

    //send
    this.subscriptionLinkSend = this.linkService.getSend(this.meId).subscribe(result => {
      this.linksSend.forEach(l => {
        if(!result.find(p=> p.id == l.id)){
          const modal = this.modals.find(p=>  p.componentInstance && p.componentInstance.type == ModalType.Link && p.componentInstance.linkId == l.id );
          if(modal) {
            modal.close(false);
          }
        }else{
          let link = result.find(p=> p.id == l.id);
          if(link.accept){
            const modal = this.modals.find(p=>  p.componentInstance &&  p.componentInstance.type == ModalType.Link && p.componentInstance.linkId == l.id );
            if(modal) {
              modal.close(true);
            }
          }
        }
      });    
      

    }); 

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.list.filter(p=> p.me == this.meId).forEach(p=> p.me = null);
    this.service.save(this.list);
    
    this.subscriptionContact.unsubscribe();
    this.subscriptionLinkReveice.unsubscribe();
    this.subscriptionLinkSend.unsubscribe();

    this.service.subjectInterval.unsubscribe();
    this.linkService.subjectInterval.unsubscribe();
    this.linkService.subjectSendInterval.unsubscribe();
  } 

  add(){
    this.list.push(new Contact(true, true));
  }

  edit(item){
    item.isEdit = true;
  }

  cancel(item){
    item.isEdit = false;
    if(item.isNew){
      this.list = this.list.filter(p => p.id != item.id);
    }
  }

  remove(item){
    this.list = this.list.filter(p => p.id != item.id);
    this.service.save(this.list);
  }

  save(item) {
    item.isNew = false;
    item.isEdit = false;
    this.service.save(this.list);
  }

  me(item) {

    this.list.filter(p=> p.me == this.meId).forEach(p=> p.me = null);

    item.me = this.meId;
    this.meName = item.name;

    this.service.save(this.list);
  }

  
  hasContactMe() {
    return this.list.find(p=> p.me == this.meId) != null;
  }

  getStatusMe(item){
    return item && item.me == this.meId;
  }

  getStatusOnline(item){
    return item && item.me && item.me != "" && item.me != this.meId;
  }

  link(item) {
    const link = new Link(this.meId, item.me);
    this.linkService.send(link);
    this.linksSend.push(link);
    this.openModal(link.id, true, item);
  }

  openModal(linkId: string, sending: boolean, contact: Contact){
    const modalRef = this.modalService.open(LinkModalComponent, { });
    this.modals.push(modalRef);

    modalRef.componentInstance.sending = sending;
    modalRef.componentInstance.contact = contact;
    modalRef.componentInstance.linkId = linkId;

    modalRef.result.then((result) => {
      this.modals = this.modals.filter(p=>  p.componentInstance && p.componentInstance.type == ModalType.Link && p.componentInstance.linkId != linkId );
      if(!result){
        if(!sending && this.links && this.links.length > 0) {
          this.links = this.links.filter(p=> p.id != linkId);
        }
        this.linkService.reject(linkId);
      }else{
        this.linkService.accept(linkId);
        this.openChat(linkId);
      }
    });
  }

  openChat(linkId: string){
    const modalRef = this.modalService.open(ChatModalComponent, { });
    modalRef.componentInstance.linkId = linkId;
    modalRef.componentInstance.meId = this.meId;
    modalRef.componentInstance.meName = this.meName;
    modalRef.result.then((result) => {
      if(this.links && this.links.length > 0) {
        this.links = this.links.filter(p=> p.id != linkId);
      }
      if(this.linksSend && this.linksSend.length > 0) {
        this.linksSend = this.linksSend.filter(p=> p.id != linkId);
      }
      this.linkService.reject(linkId);
    });
  }
}
