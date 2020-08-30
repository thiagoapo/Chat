import { Guid } from "guid-typescript";

export class Contact {
    public id: string;
    public name: string;

    public isEdit: boolean;
    public isNew: boolean;
    public me: string;

    constructor(isEdit = false, isNew = false, name =  ''){
        this.isEdit = isEdit;
        this.isNew = isNew;
        this.id = Guid.create().toString();
        this.name = name;
    }
}
