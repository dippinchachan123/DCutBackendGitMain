import { randomUUID } from "crypto";
import { Diamonds } from "../abstractModels/Diamonds";
import { ERROR } from "../enums/DiamondError";
import { Kapan as KapanInterface, Cut, message } from "../Types/Types";

export class Kapan extends Diamonds implements KapanInterface {
    constructor({diamondContainerId,id,name,weight,pieces,remarks,status}){
        super({diamondContainerId,id,name,weight,pieces,remarks})
        this.status = status
    }
    size : number = 0
    cuts: {[key: string]: Cut} = {};
    status: "PENDING" | "IN-PROCESS" | "PROCESSED";
    addCut(cut : Cut): message {
        this.cuts["Cut-"+randomUUID()] = cut;
        this.size++;
        return {
            error : null,
            success : {
                message : "Added Cut Successfully!!"
            }
        }
    }
    deleteCut(diamondContainerId: string): message {
        if(!this.cuts[diamondContainerId]){
            return {
                error : {
                    message : "Cut not found!!"
                },
                success : null
            }
        }
        delete this.cuts[diamondContainerId];
        this.size --;
        return {
            error : null,
            success : {
                message : "Packet removed successfully!!"
            }
        }
    }
    editCut(diamondContainerId: string): message {
        throw new Error("Method not implemented.");
    }
}