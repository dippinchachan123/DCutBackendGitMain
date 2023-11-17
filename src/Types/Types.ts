import {PRE_PROCESS_TYPES ,POST_PROCESS_TYPES } from '../enums/processTypes'

export interface Diamonds {
    diamondContainerId : string,
    id? : string,
    name? : string,
    weight : number,
    pieces : number,
    size : number,
    remarks : number,
    createdAt : Date,
    lastModified : Date,
    lastModifiedBy : {
        userId : string,
        userName : string
    },
    returnWeight(weight : number) : {weight : number,pieces : number} | error,
    isEmpty() : boolean | error,
    history : any
}

export interface Kapan extends Diamonds {
    status : "PENDING" | "IN-PROCESS" | "PROCESSED" 
    cuts : {
        [key : string] : Cut
    },
    addCut(cut : Cut) : message,
    deleteCut(diamondContainerId : string) : message,
    editCut(diamondContainerId : string) : message
}

export interface Packet extends Diamonds {
    cut : Cut,
    cart : Cart, 
    slot : string,
    status : "PENDING" | "PROCESSED",
    splitPacket(slots : {slot : PRE_PROCESS_TYPES,weight : number}[]) : message,
}

export interface Cut extends Diamonds {
    carts : {
        [key : string] : {
            pending : Cart,
            processed : Cart
        }
    },
}

export interface Cart {
    diamondContainerId : string,
    totalWeight : number,
    totalPieces : number,
    slot : PRE_PROCESS_TYPES,
    remarks : number,
    lastModified : Date,
    lastModifiedBy : {
        userId : string,
        userName : string
    },
    isEmpty() : boolean | error,
    getPacket(diamondContainerId : string) : Packet | error,
    getPackets() : Packet[] | error,
    removePacket(diamondContainerId : string) : message,
    addPacket(Packet) : message,
    history : any
}

export interface message{
    error : {
        message : string,
        details? : object
    } | null,
    success : {
        message : string,
        details? : object
    } | null
}

export interface error{
    error : {
        message : string,
        details? : object
    }
}