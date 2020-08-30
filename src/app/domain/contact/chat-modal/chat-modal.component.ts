import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Contact } from '../../../models/contact';
import { LinkService } from '../../../services/link.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '../../../models/mesage';
import { Subscription } from 'rxjs';
import { ModalType } from '../../../models/enums/modal-type';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit, AfterViewChecked  {
  @Input() public meId: string;
  @Input() public meName: string;
  @Input() public linkId: string;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  
  public type: ModalType;

  message: string;
  messages: Message[];

  subscription: Subscription;
  subscriptionLink: Subscription;

  constructor( 
    private service: LinkService,
    public activeModal: NgbActiveModal) { 
      this.type = ModalType.Chat;
  }

  ngOnInit(): void {       
    this.messages = new Array<Message>();

    this.subscription = this.service.getMessages(this.linkId).subscribe(result => {
      let toBottom = false;

      if(this.messages.length != result.length)
        toBottom = true;

      this.messages = result;

      if(toBottom)
        setTimeout(()=> this.scrollToBottom(), 100);
    });

    this.subscriptionLink = this.service.getLink(this.linkId).subscribe(result => {
      if(!result){
        this.closeModal();
      }
    });
  }

  ngAfterViewChecked() {        
    //this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  sendMessage(){
    let message = new Message(this.meId, this.meName, this.message);
    this.service.sendMessage(this.linkId, message);
    this.message = '';
  }

  isMe(message: Message) {
    return message.origin == this.meId;
  }
  getName(message: Message) {
    return this.isMe(message) ? "Você" : message.originName;
  }

  closeModal() {
    this.subscription.unsubscribe();
    this.subscriptionLink.unsubscribe();
    this.service.subjectMessageInterval.unsubscribe();
    this.service.subjectLinkInterval.unsubscribe();
    this.activeModal.close(false);
  }
}
