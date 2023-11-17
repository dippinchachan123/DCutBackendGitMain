import { randomUUID } from "crypto";
import { Diamonds } from "../abstractModels/Diamonds";
import { ERROR } from "../enums/DiamondError";
import { PRE_PROCESS_TYPES } from "../enums/processTypes";
import { error, Cut as CutInterface, Cart as CartInterface } from "../Types/Types";
import { Cart } from "./Cart";

export class Cut extends Diamonds implements CutInterface {
    constructor({diamondContainerId,id,name,weight,pieces,remarks}){
        super({diamondContainerId,id,name,weight,pieces,remarks})
        this.initCarts()
    }
    name: string;
    carts: { [key: string]: { pending: Cart; processed: Cart; }; } = {};
    initCarts(){
        const processes = Object.values(PRE_PROCESS_TYPES);
        for(var process of processes){
            this.carts[process] = {
                pending : new Cart("CART-" + randomUUID(),process),
                processed : new Cart("CART-" + randomUUID(),process)
            }
        }    
    }
}