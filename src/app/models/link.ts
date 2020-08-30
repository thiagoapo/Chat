import { Guid } from "guid-typescript";
import { Message } from "./mesage";

export class Link {
    public id: string;
    public origin: string;
    public destiny: string;
    public accept: boolean;
    public messages: Message[];

    constructor(origin = null, destiny = null){
        this.origin = origin;
        this.destiny = destiny;
        this.id = Guid.create().toString();
        this.accept = null;
        this.messages = new Array<Message>();
    }
}
