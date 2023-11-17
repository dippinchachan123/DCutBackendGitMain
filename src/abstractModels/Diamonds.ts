import { Diamonds as DiamondsInterface, error } from "../Types/Types"
import {ERROR} from '../enums/DiamondError'

export class Diamonds implements DiamondsInterface {
    diamondContainerId: string;
    id: string;
    name? : string;
    weight: number;
    pieces: number;
    size : number;
    remarks: number;
    createdAt: Date;
    lastModified: Date;
    lastModifiedBy: { userId: string; userName: string; };

    constructor({diamondContainerId,id,name,weight,pieces,remarks}){
        this.diamondContainerId = diamondContainerId;this.id = id;this.name = name;
        this.weight = weight;this.pieces = pieces;this.remarks = remarks;
        this.size = this.weight/this.pieces;
        this.createdAt = new Date();this.lastModified = this.createdAt;
        this.lastModifiedBy = { userId: "1" , userName: "Dippin Chachan" };
    }
    
    history: any;

    returnWeight(weight: number): { weight: number; pieces: number }  | error{
        if(weight > this.weight){
            return {
                error : {
                    message : ERROR.WEIGHT_EXCEEDS,
                    details : {}
                } 
            };
        }else{
            this.weight -= weight;
            return {weight : weight,pieces : (weight/this.size)};
        }
    }

    isEmpty(): boolean {
        return this.weight == 0;
    }
}
