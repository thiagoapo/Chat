import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { Observable, Subject, BehaviorSubject, interval, Subscription } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private subject: BehaviorSubject<Contact[]>;
  public subjectInterval: Subscription;

  public path: string;

  constructor(private localStorage: LocalStorageService) {
    this.path = `Contacts`;
  }

  save(contacts: Contact[]) {
    this.localStorage.set(this.path,  contacts);
    this.subject.next(contacts);
  }

  getAll(): BehaviorSubject<Contact[]> {
      let contacts = this.localStorage.get(this.path);

      if(!contacts) {
        this.localStorage.set(this.path, new Array<Contact>());
        contacts = this.localStorage.get(this.path);
      }

      if(!this.subject)
        this.subject = new BehaviorSubject<Contact[]>(contacts);

        setInterval(()=> {
          this.subject.next(this.localStorage.get(this.path));
        }, 1000);

        this.subjectInterval = interval(1000).subscribe(() => {
          this.subject.next(this.localStorage.get(this.path));
        });
        
      return this.subject;
  }
}
