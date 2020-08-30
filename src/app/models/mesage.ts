import { Guid } from "guid-typescript";

export class Message {
    public id: string;
    public origin: string;
    public originName: string;
    public content: string;
    constructor(origin =  '', originName = '', content: string){
        this.id = Guid.create().toString();
        this.origin = origin;
        this.originName = originName;
        this.content = content;
    }
}
