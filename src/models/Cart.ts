import { ERROR } from "../enums/DiamondError";
import { PRE_PROCESS_TYPES } from "../enums/processTypes";
import { error, Cart as CartInterface, Packet, message } from "../Types/Types";

export class Cart implements CartInterface{
    diamondContainerId: string;
    totalWeight: number;
    totalPieces: number;
    slot: PRE_PROCESS_TYPES;
    remarks: number;
    lastModified : Date =  new Date();
    lastModifiedBy: { userId: string; userName: string; };

    packetContainer : {[key:string] : Packet} = {}
    size = 0

    constructor(diamondContainerId,slot){
        this.diamondContainerId = diamondContainerId;
        this.slot = slot;
    }

    isEmpty(): boolean | error {
        return this.size == 0;
    }
    getPacket(diamondContainerId: string): error | Packet {
        if(this.packetContainer[diamondContainerId]){
            return this.packetContainer[diamondContainerId]
        }else{
            return {
                error : {
                    message : "Key Not Found!!"
                }
            }
        }
    }
    getPackets(): error | Packet[] {
        const packets : Packet[]  = []
        for(var key in this.packetContainer){
            if(this.packetContainer[key]){
                packets.push(this.packetContainer[key])
            }
        }
        return packets;
    }
    removePacket(diamondContainerId: string): message {
        if(!this.packetContainer[diamondContainerId]){
            return {
                error : {
                    message : "Packet not found!!"
                },
                success : null
            }
        }
        delete this.packetContainer[diamondContainerId]
        this.size --;
        return {
            error : null,
            success : {
                message : "Packet removed successfully!!"
            }
        }
    }
    addPacket(Packet: any): message {
        this.packetContainer[Packet.diamondContainerId] = Packet
        this.size++;
        return {
            error  : null,
            success : {
                message : "Packet added Successfully!!"
            }
        }
    }
    history: any;
}