import express from "express";
import main from "../../controllers/Main";
import mainPP from "../../controllers/MainPP";

export const mainRouter = express.Router();

const test = (req,res)=>{
    res.json("Server is Up!!")
}

//PREProcess
//Kapans
mainRouter.get("/getKapans",main.getKapans)
mainRouter.post("/addKapan",main.addKapan)
mainRouter.get("/getKapan",main.getKapanByID)
mainRouter.post("/updateKapan",main.updateKapan)
mainRouter.post("/updateKapanByField",main.updateKapanByField)

mainRouter.post("/deleteKapan",main.deleteKapan)
mainRouter.post("/deleteKapans",main.deleteAllKapans)
mainRouter.post("/deleteKapans",main.deleteAllKapans)

//Cuts
mainRouter.get("/getCuts",main.getCuts)
mainRouter.post("/addCut",main.addCut)
mainRouter.get("/getCut",main.getCutById)
mainRouter.post("/updateCut",main.updateCut)
mainRouter.post("/deleteCut",main.deleteCut)

//Carts
mainRouter.get("/getCarts",main.getCarts)
mainRouter.post("/weightTransfer",main.weightTransfer)

//Packets
mainRouter.get("/getPackets",main.getPackets)
mainRouter.get("/getPacket",main.getPacket)
mainRouter.post("/addPacket",main.addPacket)
mainRouter.post("/deletePacket",main.deletePacket)
mainRouter.post("/updatePacket",main.updatePacket)
mainRouter.post("/updatePacketField",main.updatePacketField)


mainRouter.post("/ReturnMainPacket",main.ReturnMainPacket)


//SubPackets
mainRouter.get("/getSPackets",main.getSPackets)
mainRouter.get("/getSPacket",main.getSPacket)
mainRouter.post("/addSPacket",main.addSPacket)
mainRouter.post("/deleteSPacket",main.deleteSPacket)
mainRouter.post("/updateSPacket",main.updateSPacket)
mainRouter.post("/updateSPacketField",main.updateSPacketField)

//Staff
mainRouter.get("/getStaffs",main.getStaffs)
mainRouter.post("/addStaff",main.addStaff)
mainRouter.get("/getStaff",main.getStaffByID)
mainRouter.post("/updateStaff",main.updateStaff)
mainRouter.post("/deleteStaff",main.deleteStaff)


//Users
mainRouter.get("/getUsers",main.getUsers)
mainRouter.post("/addUser",main.addUser)
mainRouter.get("/getUser",main.getUserByID)
mainRouter.post("/updateUser",main.updateUser)
mainRouter.post("/deleteUser",main.deleteUser)

mainRouter.get("/getUserStatus",main.getUserStatus)
mainRouter.get("/getUserStatusByNumber",main.getUserStatusByNumber)



//Fields
mainRouter.get("/getFields",main.getFields)
mainRouter.post("/addField",main.addField)
mainRouter.post("/deleteField",main.deleteField)



//..................................................................................................

//PostProcess
//PPKapans
mainRouter.get("/PPgetKapans",mainPP.getKapans)
mainRouter.post("/PPaddKapan",mainPP.addKapan)
mainRouter.get("/PPgetKapan",mainPP.getKapanByID)
mainRouter.post("/PPupdateKapan",mainPP.updateKapan)
mainRouter.post("/PPdeleteKapan",mainPP.deleteKapan)
mainRouter.post("/PPdeleteKapans",mainPP.deleteAllKapans)
mainRouter.post("/PPupdateKapanByField",mainPP.updateKapanByField)


//PPCuts
mainRouter.get("/PPgetCuts",mainPP.getCuts)
mainRouter.post("/PPaddCut",mainPP.addCut)
mainRouter.get("/PPgetCut",mainPP.getCutById)
mainRouter.post("/PPupdateCut",mainPP.updateCut)
mainRouter.post("/PPdeleteCut",mainPP.deleteCut)

//PPCarts
mainRouter.get("/PPgetCarts",mainPP.getCarts)
mainRouter.post("/PPweightTransfer",mainPP.weightTransfer)

//PPPackets
mainRouter.get("/PPgetPackets",mainPP.getPackets)
mainRouter.get("/PPgetPacket",mainPP.getPacket)
mainRouter.post("/PPaddPacket",mainPP.addPacket)
mainRouter.post("/PPdeletePacket",mainPP.deletePacket)
mainRouter.post("/PPupdatePacket",mainPP.updatePacket)
mainRouter.post("/PPupdatePacketField",mainPP.updatePacketField)


mainRouter.post("/PPReturnMainPacket",mainPP.ReturnMainPacket)


//PPSubPackets
mainRouter.get("/PPgetSPackets",mainPP.getSPackets)
mainRouter.get("/PPgetSPacket",mainPP.getSPacket)
mainRouter.post("/PPaddSPacket",mainPP.addSPacket)
mainRouter.post("/PPdeleteSPacket",mainPP.deleteSPacket)
mainRouter.post("/PPupdateSPacket",mainPP.updateSPacket)
mainRouter.post("/PPupdateSPacketField",mainPP.updateSPacketField)