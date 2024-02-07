export enum     Operation {
    A = "Added" ,
    D =  "Deleted" ,
    U = "Updated" ,
    WT = "Weight-Transfered" ,
    I = "Issued" ,
    R = "Returned" ,
    UI = "Un-Issued" ,
    UR = "Un-Returned", 
    UL = "Un-Locked",
}
export enum DataType {
   K =  "Kapan" ,
   C = "Cut" ,
   P = "Packet",
   SP = "Sub-Packet",
   PP_K = "PostProcess_Kapan",
   PP_P = "PostProcess_Packet",
   S = "Staff",
   U = "User"
}