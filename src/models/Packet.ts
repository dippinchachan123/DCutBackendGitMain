import { randomUUID } from "crypto";
import { Diamonds } from "../abstractModels/Diamonds";
import { ERROR,SUCCESS } from "../enums/DiamondError";
import { PRE_PROCESS_TYPES } from "../enums/processTypes";
import { Cart, Cut, error, message, Packet as PacketInterface } from "../Types/Types";

export class Packet extends Diamonds implements PacketInterface {
    constructor({diamondContainerId,id,name,weight,pieces,remarks,cart,cut,slot}){
        super({diamondContainerId,id,name,weight,pieces,remarks})
        this.cart = cart;
        this.cut = cut
        this.slot = slot
    }
    cut: Cut;
    cart : Cart;
    slot : string;
    status: "PENDING" | "PROCESSED";
    splitPacket(slots: { slot: PRE_PROCESS_TYPES; weight: number; }[]): message {
        if(!this.validateSpliting(slots)){
            return {
                error : {
                    message : ERROR.WEIGHT_EXCEEDS
                },
                success : null
            }
        }else{
            const packets = []
            for(var obj of slots){
                let rObj  : {weight : number,pieces : number} =  this.returnWeight(obj.weight) as { weight: number, pieces: number };
                const packetDetails = {
                    diamondContainerId :  "PKT-"+ randomUUID(),
                    id : 0,
                    name : "",
                    weight : rObj.weight,
                    pieces : rObj.pieces,
                    remarks : `New packet created from ${this.diamondContainerId} id packet`,
                    cart : this.cut.carts[obj.slot].pending,
                    cut : this.cut,
                    slot : obj.slot
                } 
                this.cut.carts[obj.slot].pending.addPacket(new Packet(packetDetails).setConfig({status : "PENDING"}))
            }
            return {
                success : {
                    message : "Successfully Splited!!"
                },
                error : null
            }
        }
    }

    validateSpliting(slots: { slot: PRE_PROCESS_TYPES; weight: number; }[]) : boolean{
        let totalWeight = 0;
        for(var obj of slots){
            totalWeight += obj.weight;
        }
        if(totalWeight > this.weight){
            return false
        }
        return true;
    }

    setConfig({status}) : Packet{
        this.status = status
        return this;
    }
    history: any;
}