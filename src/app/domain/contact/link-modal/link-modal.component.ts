import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../../models/contact';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalType } from '../../../models/enums/modal-type';

@Component({
  selector: 'app-link-modal',
  templateUrl: './link-modal.component.html',
  styleUrls: ['./link-modal.component.scss']
})
export class LinkModalComponent implements OnInit {
  @Input() public contact: Contact;
  @Input() public sending: boolean;
  @Input() public linkId: string;
  
  public type: ModalType;

  constructor( public activeModal: NgbActiveModal) { 
    this.type = ModalType.Link;
  }

  ngOnInit(): void {
  }

  getContent(){
    if(this.sending)
      return `Chamada para ${this.contact.name}`;
    else
      return `${this.contact.name} está te ligando`;
  }

  closeModal(response) {
    this.activeModal.close(response);
  }
}
