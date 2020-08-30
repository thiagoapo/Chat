import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { Observable, Subject, BehaviorSubject, interval, Subscription } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Link } from '../models/link';
import { Message } from '../models/mesage';
import { finalize, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private subject: Subject<Link[]>;
  private subjectSend: Subject<Link[]>;
  private subjectMessage: Subject<Message[]>;
  private subjectLink: Subject<Link>;

  public subjectInterval: Subscription;
  public subjectSendInterval: Subscription;
  public subjectMessageInterval: Subscription;
  public subjectLinkInterval: Subscription;

  public path: string;

  constructor(private localStorage: LocalStorageService) {
    this.path = `Links`;
  }

  send(link: Link) {
    var links = this.localStorage.get(this.path) as Link[];
    if(links == null){
      links = new Array<Link>();
    }
    links.push(link);
    this.localStorage.set(this.path, links);
  }

  sendMessage(linkId: string, message: Message){
    var links = this.localStorage.get(this.path) as Link[];
    links.forEach(p=> { if(p.id == linkId) p.messages.push(message); });
    this.localStorage.set(this.path, links);
  }

  getMessagesForLink(linkId: string): Array<Message>{
    var links = this.localStorage.get(this.path) as Link[];
    const link = links.find(p=>p.id == linkId);
    if(link){
      return link.messages;
    }
    return new Array<Message>();
  }

  getLink(linkId: string): Subject<Link>{
    this.subjectLink = new Subject<Link>();

    this.subjectLinkInterval = interval(1000).subscribe(() => {
      const links = this.localStorage.get(this.path) as Link[];
      const link = links.find(p=>p.id == linkId);
      this.subjectLink.next(link);
    });

    return this.subjectLink;
  }

  getMessages(linkId: string): Subject<Message[]>{
    this.subjectMessage = new Subject<Message[]>();

    this.subjectMessageInterval = interval(1000).subscribe(() => {
      this.subjectMessage.next(this.getMessagesForLink(linkId));
    });

    return this.subjectMessage;
  }

  reject(linkId: string) {
    var links = this.localStorage.get(this.path) as Link[];
    links = links.filter(p=>p.id != linkId);
    this.localStorage.set(this.path, links);
  }

  accept(linkId: string) {
    var links = this.localStorage.get(this.path) as Link[];
    links.forEach(p=> { if(p.id == linkId) p.accept = true; });
    this.localStorage.set(this.path, links);
  }

  getForMe(meId: string, sending: boolean = false): Link[] {
    let links = this.localStorage.get(this.path) as Link[];
    let linksForMe = new Array<Link>();

    if(links) {
      linksForMe = links.filter(p=> (!sending && p.destiny == meId) || (sending && p.origin == meId));
    }

    return linksForMe;
  }

  get(meId: string): Subject<Link[]> {
      if(!this.subject)
        this.subject = new Subject<Link[]>();

        this.subjectInterval = interval(1000).subscribe(() => {
          this.subject.next(this.getForMe(meId));
        });

      return this.subject;
  }

  getSend(meId: string): Subject<Link[]> {
    if(!this.subjectSend)
      this.subjectSend = new Subject<Link[]>();

      this.subjectSendInterval = interval(1000).subscribe(() => {
        this.subjectSend.next(this.getForMe(meId, true));
      });

    return this.subjectSend;
  }
}
