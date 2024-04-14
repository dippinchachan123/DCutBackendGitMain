import { randomUUID } from "crypto"
import kapanModel from "../DBModels/Kapan"
import StaffModel from "../DBModels/Staff"
import express from 'express';
import { DATA_ALREADY_EXISTS, DATA_FEATCHED, DATA_NOT_FOUND, DATA_NOT_SAVED, DATA_REMOVED_SUCCESSFULLY, DATA_SAVED, DATA_UPDATED, ERROR_WHILE_FEATCHING_DATA } from "../utils/constants/global.constants";
import { PROCESS_IDS } from "../Data/Processes";
import FieldsModel from "../DBModels/Fields";
import { PRE_PROCESS_TYPES } from "../enums/processTypes";
import UserModel from "../DBModels/Users";
import bcrypt from "bcrypt";
import { Global } from "./Global";
import { DataType, Operation } from "../enums/Logs";

class Main {
    //Kapan
    getKapans = async (req: express.Request, res: express.Response) => {
        kapanModel.aggregate([
            {
                $addFields: {
                    cutsWeight: {
                        $reduce: {
                            input: "$cuts",
                            initialValue: 0,
                            in: { $add: ["$$this.weight", "$$value"] }
                        }
                    }
                }
            },
            {
                $project: { "cuts": 0 }
            }
        ])
            .exec()
            .then((result: any) => {
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }

    getKapanByID = async (req: express.Request, res: express.Response) => {
        const id: any = req.query.id;
        console.log("Id : ", id)
        kapanModel.aggregate([
            {
                $addFields: {
                    cutsWeight: {
                        $reduce: {
                            input: "$cuts",
                            initialValue: 0,
                            in: { $add: ["$$this.weight", "$$value"] }
                        }
                    }
                }
            },
            {
                $project: { "cuts": 0 }
            },
            {
                $match: { id: parseInt(id) }
            },
            {
                $project: { cuts: 0 }
            }
        ])
            .exec()
            .then((result: any) => {
                console.log("Result : ", result)
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }

    addKapan = async (req: express.Request, res: express.Response) => {
        kapanModel.aggregate([
            {
                $group: {
                    _id: null, // Use null to group all documents together
                    maxField: { $max: "$id" } // $max accumulator to find the maximum value of fieldName
                }
            }
        ])
            .exec()
            .then(result => {
                console.log(result)
                const newKapan = {
                    diamondContainerId: "KAPAN-" + randomUUID(),
                    id: (result[0]?.maxField || 0) + 1,
                    name: req.body.name,
                    weight: req.body.weight,
                    pieces: req.body.pieces,
                    size: req.body.size,
                    remarks: req.body.remarks,
                    status: req.body.status || "PENDING",
                }
                const kapan = new kapanModel(newKapan).save()
                    .then((savedKapan) => {
                        console.log('Kapan instance saved successfully:' + JSON.stringify(savedKapan));
                        res.json({ err: false, data: savedKapan });
                        Global.addLog({
                            user: req.body.user,
                            operation: Operation.A,
                            dataType: DataType.K,
                            path: `/kapans?id=${newKapan.id}`,
                            data: { remarks: "Kapan Added", name: newKapan.name, weight: newKapan.weight, pieces: newKapan.pieces }
                        })
                            .then(logResponse => {
                                console.log("Log Added!!")
                            })
                            .catch(err => {
                                console.log("Error in Adding Log!!")
                            })
                    })
                    .catch((error) => {
                        console.log("Error : ", error)
                        res.status(500).json({ err: true, data: error })
                    });
            }
            )
            .catch(err => console.log(err))
    }

    updateKapan = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };

        // Define the fields you want to update and their new values

        const update = {
            $set: req.body
        };
        kapanModel.updateOne(filter, update, { new: true })
            .then((result: any) => {
                if (result.modifiedCount) {
                    this.getKapanByID(req, res)
                    Global.addLog({
                        user: req.body.user,
                        operation: Operation.U,
                        dataType: DataType.K,
                        path: `/kapans?id=${filter.id}`,
                        data: {
                            old: { id: filter.id, name: req.body.name, weight: null, pieces: null },
                            new: { remarks: "Kapan Updated", id: filter.id, name: req.body.name, weight: req.body.weight, pieces: req.body.pieces }
                        }
                    })
                        .then(logResponse => {
                            console.log("Log Added!!")
                        })
                        .catch(err => {
                            console.log("Error in Adding Log!!")
                        })

                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }

    updateKapanByField = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };
        const field = req.query.field.toString();


        // Define the fields you want to update and their new values
        const update = {
            $set: {
                [field]: req.body[field],
            }
        };
        console.log(update)

        kapanModel.updateOne(filter, update, { new: true })
            .then((result: any) => {
                if (result.modifiedCount) {
                    Global.addLog({
                        user: req.body.user,
                        operation: field == 'lock' ? Operation.UL : Operation.U,
                        dataType: DataType.K,
                        path: `/kapans?id=${filter.id}`,
                        data: { remarks: "Kapan Un-locked", id: filter.id, name: req.body.name, weight: req.body.weight, pieces: req.body.pieces }
                    })
                        .then(logResponse => {
                            console.log("Log Added!!")
                        })
                        .catch(err => {
                            console.log("Error in Adding Log!!")
                        })
                    if (field == 'lock' && req.body.lock.status == false) {
                        const timerId = setInterval(() => {
                            kapanModel.updateOne(filter, { $set: { "lock": { status: true } } })
                                .then(res => {
                                    console.log(res, "Kapan Locked!!")
                                })
                                .catch(err => {
                                    console.log("Error in locking Kapan: ", err)
                                })
                            clearInterval(timerId)
                        }, parseInt(process.env.Unlock_TIMER || "86400000"))
                    }
                    this.getKapanByID(req, res)
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }

    deleteKapan = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };
        kapanModel.deleteOne(filter)
            .then((result: any) => {
                console.log(result)
                if (result.deletedCount) {
                    res.json({ err: false, data: result })
                    Global.addLog({
                        user: req.body.user,
                        operation: Operation.D,
                        dataType: DataType.K,
                        path: `/kapans?id=${filter.id}`,
                        data: {
                            remarks: "Kapan Deleted",
                            id: filter.id
                        }
                    })
                        .then(logResponse => {
                            console.log("Log Added!!")
                        })
                        .catch(err => {
                            console.log("Error in Adding Log!!")
                        })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }

    deleteAllKapans = async (req: express.Request, res: express.Response) => {
        kapanModel.deleteMany({})
            .then((result: any) => {
                console.log(result)
                if (result.deletedCount) {
                    res.json({ err: false, data: result })
                    Global.addLog({
                        user: req.body.user,
                        operation: Operation.D,
                        dataType: DataType.K,
                        path: `/kapans`,
                        data: {
                            remarks: "All Kapans Deleted",
                        }
                    })
                        .then(logResponse => {
                            console.log("Log Added!!")
                        })
                        .catch(err => {
                            console.log("Error in Adding Log!!")
                        })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }

    //Cuts
    getCuts = async (req: express.Request, res: express.Response) => {

        kapanModel.aggregate([
            {
                $match: { id: parseInt(req.query.id.toString()) }
            },
            {
                $project: { "cuts": 1, id: 1 }
            },
            {
                $project: { "cuts.carts": 0 }
            }
        ])
            .exec()
            .then((result: any) => {
                console.log(result)
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }

    getCutById = async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.query.id.toString())
        const kapanId = parseInt(req.query.kapanId.toString())
        kapanModel.aggregate([
            {
                $match: { id: kapanId },
            },
            {
                $project: {
                    cuts: {
                        $filter: {
                            input: "$cuts",
                            as: "element",
                            cond: { $eq: ["$$element.id", id] }
                        }
                    }
                }
            },
            {
                $project: { "cuts.carts": 0 }
            }
        ])
            .exec()
            .then((result: any) => {
                console.log(result)
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }

    getCutByIdUseIn = async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.query.id.toString())
        const kapanId = parseInt(req.query.kapanId.toString())
        return new Promise((resolve, reject) => {
            kapanModel.aggregate([
                {
                    $match: { id: kapanId },
                },
                {
                    $project: {
                        cuts: {
                            $filter: {
                                input: "$cuts",
                                as: "element",
                                cond: { $eq: ["$$element.id", id] }
                            }
                        }
                    }
                },
                {
                    $project: { "cuts.carts": 0 }
                }
            ])
                .exec()
                .then((result: any) => {
                    console.log("Heres cut", result[0].cuts)
                    resolve(result)
                })
                .catch(err => {
                    console.log(ERROR_WHILE_FEATCHING_DATA)
                    reject(err)
                })
        })
    }

    addCut = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.id.toString())
        kapanModel.aggregate([
            {
                $match: { id: kapanId }
            },
            {
                $project: {
                    maxField: {
                        $reduce: {
                            input: "$cuts",
                            initialValue: 0,
                            in: { $max: ['$$value', "$$this.id"] }
                        }
                    },
                    id: 1,
                    cuts: 1
                }
            }
        ])
            .exec()
            .then(result => {
                console.log(result)
                const newCut = {
                    diamondContainerId: "Cut-" + randomUUID(),
                    id: (result[0]?.maxField || 0) + 1,
                    weight: req.body.weight,
                    pieces: req.body.pieces,
                    size: req.body.size,
                    remarks: req.body.remarks,
                    status: req.body.status || "PENDING",
                    carts: req.body.carts
                }
                const filter = { id: kapanId };
                const update = { $push: { "cuts": newCut } };
                const cut = kapanModel.updateOne(filter, update)
                    .then((result2) => {
                        if (result2.modifiedCount) {
                            res.json({ err: false, data: { id: result[0].maxField + 1 }, msg: DATA_SAVED });
                            Global.addLog({
                                user: req.body.user,
                                operation: Operation.A,
                                dataType: DataType.C,
                                path: `/kapans/${kapanId}?id=${newCut.id}`,
                                data: { remarks: "Cut Added", weight: newCut.weight, pieces: newCut.pieces }
                            })
                                .then(logResponse => {
                                    console.log("Log Added!!")
                                })
                                .catch(err => {
                                    console.log("Error in Adding Log!!")
                                })
                        }
                        else {

                            res.json({ err: true, data: null, msg: DATA_NOT_SAVED });
                        }
                    })
                    .catch((error) => {

                        res.status(500).json({ err: true, data: error })
                    });
            })
            .catch(err => console.log(err))
    }

    deleteCut = async (req: express.Request, res: express.Response) => {

        const filter = { id: parseInt(req.query.kapanId.toString()) }; // Replace with the actual document _id
        const update = { $pull: { cuts: { id: parseInt(req.query.id.toString()) } } };
        const cuts = kapanModel.updateOne(filter, update)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_REMOVED_SUCCESSFULLY });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }

    updateCut = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString())
        const id = parseInt(req.query.id.toString())
        const filter = { id: kapanId, "cuts.id": id }; // Replace with the actual document _id
        const update = {
            $set: {
                "cuts.$.weight": req.body.weight,
                "cuts.$.pieces": req.body.pieces,
                "cuts.$.size": req.body.size,
                "cuts.$.status": req.body.status,
                "cuts.$.remarks": req.body.remarks,
            }
        };


        this.getCutByIdUseIn(req, res)
            .then((result1: any) => {
                console.log("Resul1 : ", result1)
                const weightChanged = req.body.weight - result1[0].cuts[0].weight;
                this.WeightTransferInProcess(kapanId, id, PRE_PROCESS_TYPES.MARKING_LOTING, weightChanged)
                    .then((result2: any) => {
                        console.log("Resul2 : ", result2)
                        if (!result2.err) {
                            kapanModel.updateOne(filter, update)
                                .then((result) => {
                                    if (result.modifiedCount) {
                                        res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                                    }
                                    else {
                                        res.json({ err: true, data: null, msg: DATA_NOT_FOUND });
                                    }
                                })
                                .catch((error) => {
                                    res.status(500).json({ err: true, data: error })
                                });
                        } else {
                            res.status(500).json({ err: true, data: result2.err })
                        }
                    })
            })
            .catch(err => {
                console.log("Error : ", err)
                res.status(500).json({ err: true, data: err })
            })

    }
    
    //Carts
    getCarts = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const id = parseInt(req.query.id.toString());
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": id } },
            {
                $project: {
                    cart: { $objectToArray: "$cuts.carts" },
                },
            },
            { $unwind: "$cart" },
            {
                $addFields: {
                    "cart.v.packetsDetails": {
                        $reduce: {
                            input: "$cart.v.process.packets",
                            initialValue: {
                                totalWeightIn: 0,
                                totalWeightInActual: 0,
                                totalLoss: 0,
                                totalReturnWeights: {
                                    MARKING_LOTING: 0,
                                    LASER_LOTING: 0,
                                    BOIL_LOTING: 0,
                                    GHAT_LOTING: 0,
                                    SHAPE_LOTING: 0,
                                    POLISH_LOTING: 0,
                                    POLISH_TABLE_LOTING: 0,
                                    POLISHED: 0,
                                    ORIGINAL_RC: 0,
                                    RC: 0,
                                    REJECTION: 0,
                                },
                            },
                            in: {
                                totalWeightIn: {
                                    $add: [
                                        "$$value.totalWeightIn",
                                        "$$this.weight"
                                    ],
                                },
                                totalWeightInActual: {
                                    $add: [
                                        "$$value.totalWeightInActual",
                                        {
                                            $cond: [
                                                {
                                                    $ne: [
                                                        {
                                                            $ifNull: ["$$this.return.returnWeight", 0]
                                                        }
                                                        , 0]
                                                },
                                                0,
                                                "$$this.weight",]
                                        }
                                    ],
                                },
                                totalLoss: {
                                    $add: [
                                        "$$value.totalLoss",
                                        "$$this.loss"
                                    ],
                                },
                                totalReturnWeights: {
                                    MARKING_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.MARKING_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.MARKING_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    LASER_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.LASER_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.LASER_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    BOIL_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.BOIL_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.BOIL_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    GHAT_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.GHAT_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.GHAT_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    SHAPE_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.SHAPE_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.SHAPE_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    POLISH_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.POLISH_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.POLISH_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    POLISH_TABLE_LOTING: {
                                        $add: [
                                            "$$value.totalReturnWeights.POLISH_TABLE_LOTING",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.POLISH_TABLE_LOTING.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    POLISHED: {
                                        $add: [
                                            "$$value.totalReturnWeights.POLISHED",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.POLISHED.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    ORIGINAL_RC: {
                                        $add: [
                                            "$$value.totalReturnWeights.ORIGINAL_RC",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.ORIGINAL_RC.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    RC: {
                                        $add: [
                                            "$$value.totalReturnWeights.RC",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.RC.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    REJECTION: {
                                        $add: [
                                            "$$value.totalReturnWeights.REJECTION",
                                            {
                                                $ifNull: [
                                                    "$$this.return.weights.REJECTION.weight",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            { $project: { "cart.v.process": 0, "_id": 0, "cart.v._id": 0 } }
        ])
            .exec()
            .then((result: any) => {
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA, err)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }

    //Packets
    getPackets = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const id = parseInt(req.query.id.toString());
        const process = req.query.process;
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": id } },
            { $project: { "cart": { $objectToArray: "$cuts.carts" } } },
            {
                $project: {
                    packets: {
                        $filter: {
                            input: "$cart",
                            as: "ele",
                            cond: { $eq: ["$$ele.k", process] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    packets: {
                        $arrayElemAt: ["$packets.v.process.packets", 0]
                    }
                }
            },
            {
                $project: {
                    packets: {
                        $map: {
                            input: "$packets",
                            as: "packet",
                            in: {
                                $mergeObjects: [
                                    "$$packet",
                                    {
                                        subPacketsDetails: {
                                            $reduce: {
                                                input: "$$packet.subPackets",
                                                initialValue: {
                                                    totalWeightIn: 0,
                                                    subReturnWeight: 0,
                                                    subReturnPieces: 0,
                                                    isAllReturn: true,
                                                },
                                                in: {
                                                    totalWeightIn: {
                                                        $add: [
                                                            "$$value.totalWeightIn",
                                                            "$$this.weight",
                                                        ],
                                                    },
                                                    subReturnWeight: {
                                                        $add: [
                                                            "$$value.subReturnWeight",
                                                            {
                                                                $ifNull: [
                                                                    "$$this.return.weight",
                                                                    0,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    subReturnPieces: {
                                                        $add: [
                                                            "$$value.subReturnPieces",
                                                            {
                                                                $ifNull: [
                                                                    "$$this.return.pieces",
                                                                    0,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    isAllReturn: {
                                                        $cond: {
                                                            if: {
                                                                $or: [
                                                                    {
                                                                        $eq: [
                                                                            "$$this.return",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $eq: [
                                                                            "$$this.return",
                                                                            NaN,
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            then: false,
                                                            else: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    "packets.subPackets": 0
                }
            }
        ])
            .exec()
            .then((result: any) => {
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }
    getPacket = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());
        const process = req.query.process;
        const id = parseInt(req.query.id.toString());
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": cutId } },
            { $project: { "cart": { $objectToArray: "$cuts.carts" } } },
            {
                $project: {
                    packets: {
                        $filter: {
                            input: "$cart",
                            as: "ele",
                            cond: { $eq: ["$$ele.k", process] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    packets: {
                        $arrayElemAt: ["$packets.v.process.packets", 0]
                    }
                }
            },
            {
                $project: {
                    packet: {
                        $filter: {
                            input: "$packets",
                            as: "packet",
                            cond: { $eq: ["$$packet.id", id] }
                        }
                    }
                }
            },
            {
                $project: {
                    packets: {
                        $map: {
                            input: "$packet",
                            as: "packet",
                            in: {
                                $mergeObjects: [
                                    "$$packet",
                                    {
                                        subPacketsDetails: {
                                            $reduce: {
                                                input: "$$packet.subPackets",
                                                initialValue: {
                                                    totalWeightIn: 0,
                                                    subReturnWeight: 0,
                                                    subReturnPieces: 0,
                                                    isAllReturn: true,
                                                },
                                                in: {
                                                    totalWeightIn: {
                                                        $add: [
                                                            "$$value.totalWeightIn",
                                                            "$$this.weight",
                                                        ],
                                                    },
                                                    subReturnWeight: {
                                                        $add: [
                                                            "$$value.subReturnWeight",
                                                            {
                                                                $ifNull: [
                                                                    "$$this.return.weight",
                                                                    0,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    subReturnPieces: {
                                                        $add: [
                                                            "$$value.subReturnPieces",
                                                            {
                                                                $ifNull: [
                                                                    "$$this.return.pieces",
                                                                    0,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    isAllReturn: {
                                                        $cond: {
                                                            if: {
                                                                $or: [
                                                                    {
                                                                        $eq: [
                                                                            "$$this.return",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $eq: [
                                                                            "$$this.return",
                                                                            NaN,
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            then: false,
                                                            else: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    "packets.subPackets": 0
                }
            },
        ])
            .exec()
            .then((result: any) => {
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }
    addPacket = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const id = parseInt(req.query.id.toString());
        const process = req.query.process;
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": id } },
            { $project: { "cart": { $objectToArray: "$cuts.carts" } } },
            {
                $project: {
                    packets: {
                        $filter: {
                            input: "$cart",
                            as: "ele",
                            cond: { $eq: ["$$ele.k", process] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    packets: {
                        $arrayElemAt: ["$packets.v.process.packets", 0]
                    }
                }
            },
            {
                $project: {
                    maxField: {
                        $reduce: {
                            input: "$packets",
                            initialValue: 0,
                            in: { $max: ["$$value", "$$this.id"] }
                        }
                    }
                }
            }
        ])
            .exec()
            .then((result: any) => {
                console.log(result)
                const newPacket = {
                    diamondContainerId: "Packet-" + randomUUID(),
                    packetId: `${kapanId}S${id}S${PROCESS_IDS[process.toString()]}S${(result[0]?.maxField || 0) + 1}`,
                    id: (result[0]?.maxField || 0) + 1,
                    weight: req.body.weight,
                    pieces: req.body.pieces,
                    size: req.body.size,
                    remarks: req.body.remarks,
                    status: req.body.status || "PENDING",
                    return: null,
                    issue: null,
                    subPackets: [],
                    subReturn: null,
                    charni: req.body.charni,
                    charni2: req.body.charni2,
                    charni3: req.body.charni3,
                    cutting: req.body.cutting,
                    color: req.body.color,
                    color2: req.body.color2,
                    color3: req.body.color3,
                    colorPieces1: req.body.colorPieces1,
                    colorPieces2: req.body.colorPieces2,
                    colorPieces3: req.body.colorPieces3,
                    purityno: req.body.purityno,
                    created: {
                        user: req.body.user,
                        time: `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`,
                    }
                }
                const filter = {
                    id: kapanId, // Replace with the actual document ID
                    "cuts.id": id, // Replace with the cut ID within the "cuts" array
                }

                const update = {
                    $push: {
                        [`cuts.$.carts.${process}.process.packets`]: newPacket, // Replace with the data you want to add
                    },
                };
                const cut = kapanModel.updateOne(filter, update)
                    .then((result2) => {
                        if (result2.modifiedCount) {
                            res.json({ err: false, data: { id: result[0].maxField + 1 }, msg: DATA_SAVED });
                            Global.addLog({
                                user: req.body.user,
                                operation: Operation.A,
                                dataType: DataType.P,
                                path: `/cart/${kapanId}-${id}-${process}?id=${result[0].maxField + 1}`,
                                data: { remarks: "Packet Added", weight: null, pieces: null }
                            })
                                .then(logResponse => {
                                    console.log("Log Added!!")
                                })
                                .catch(err => {
                                    console.log("Error in Adding Log!!")
                                })

                        }
                        else {

                            res.json({ err: true, data: null, msg: DATA_NOT_SAVED });
                        }
                    })
                    .catch((error) => {

                        res.status(500).json({ err: true, data: error })
                    });
            })
            .catch(err => console.log(err))

    }
    deletePacket = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());
        const process = req.query.process
        const id = parseInt(req.query.id.toString());
        const filter = {
            id: kapanId, // Replace with the actual document ID
            "cuts.id": cutId, // Replace with the cut ID within the "cuts" array
        }

        const update = {
            $pull: {
                [`cuts.$.carts.${process}.process.packets`]: { id: id }, // Replace with the data you want to add
            },
        };

        const cuts = kapanModel.updateOne(filter, update)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_REMOVED_SUCCESSFULLY });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }
    updatePacket = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());

        const cutId = parseInt(req.query.cutId.toString());

        const process = req.query.process

        const id = parseInt(req.query.id.toString());

        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        console.log("Body : ", req.body)


        const update = {
            $set: {
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].weight`]: req.body.weight,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].pieces`]: req.body.pieces,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].status`]: req.body.status,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].remarks`]: req.body.remarks,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].size`]: req.body.size,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].color`]: req.body.color,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].color2`]: req.body.color2,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].color3`]: req.body.color3,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].colorPieces1`]: req.body.colorPieces1,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].colorPieces2`]: req.body.colorPieces2,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].colorPieces3`]: req.body.colorPieces3,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].cutting`]: req.body.cutting,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].charni`]: req.body.charni,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].charni2`]: req.body.charni2,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].charni3`]: req.body.charni3,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].purityno`]: req.body.purityno,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].lastModified`]: {
                    time: `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`,
                    user: req.body.user
                },


            }
        };

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
                { "packet.id": id },
            ],
        };

        console.log(filter, update, options)

        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                }
                else if (result.matchedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_ALREADY_EXISTS });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                console.log("Error", error)
                res.status(500).json({ err: true, data: error })
            });
    }
    updatePacketField = async (req: any, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());

        const cutId = parseInt(req.query.cutId.toString());

        const process = req.query.process

        const id = parseInt(req.query.id.toString());

        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const field = req.query.field;

        const update = {
            $set: {
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].${field}`]: !isNaN(req.body[field]) ? parseFloat(req.body[field]) : req.body[field],
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].lastModified`]: {
                    time: `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`,
                    user: req.body.user
                }
            }
        }

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
                { "packet.id": id },
            ],
        };

        console.log(filter, update, options, req.body)

        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                }
                else {
                    console.log("Error", result)
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                console.log("Error", error)
                res.status(500).json({ err: true, data: error })
            });
    }

    //Sub-Packets
    getSPackets = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());
        const id = parseInt(req.query.id.toString());
        const process = req.query.process;
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": cutId } },
            { $project: { "cart": { $objectToArray: "$cuts.carts" } } },
            {
                $project: {
                    packets: {
                        $filter: {
                            input: "$cart",
                            as: "ele",
                            cond: { $eq: ["$$ele.k", process] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    packets: {
                        $arrayElemAt: ["$packets.v.process.packets", 0]
                    }
                }
            },
            {
                $project: {
                    packet: {
                        $filter: {
                            input: "$packets",
                            as: "ele",
                            cond: { $eq: ["$$ele.id", id] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    subPackets: {
                        $arrayElemAt: ["$packet.subPackets", 0]
                    }
                }
            }
        ])
            .exec()
            .then((result: any) => {
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }
    getSPacket = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());
        const packetId = parseInt(req.query.packetId.toString());
        const id = parseInt(req.query.id.toString());
        const process = req.query.process;
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": cutId } },
            { $project: { "cart": { $objectToArray: "$cuts.carts" } } },
            {
                $project: {
                    packets: {
                        $filter: {
                            input: "$cart",
                            as: "ele",
                            cond: { $eq: ["$$ele.k", process] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    packets: {
                        $arrayElemAt: ["$packets.v.process.packets", 0]
                    }
                }
            },
            {
                $project: {
                    packet: {
                        $filter: {
                            input: "$packets",
                            as: "ele",
                            cond: { $eq: ["$$ele.id", packetId] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    subPackets: {
                        $arrayElemAt: ["$packet.subPackets", 0]
                    }
                }
            },
            {
                $project: {
                    subPacket: {
                        $filter: {
                            input: "$subPackets",
                            as: "ele",
                            cond: { $eq: ["$$ele.id", id] }
                        }
                    }
                }
            }
        ])
            .exec()
            .then((result: any) => {
                res.json({ err: false, data: result, msg: DATA_FEATCHED });
            })
            .catch(err => {
                console.log(ERROR_WHILE_FEATCHING_DATA)
                res.json({ err: true, data: err, msg: ERROR_WHILE_FEATCHING_DATA });
            })
    }
    addSPacket = async (req: express.Request, res: express.Response) => {
        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());
        const id = parseInt(req.query.id.toString());
        const process = req.query.process;
        kapanModel.aggregate([
            { $match: { id: kapanId } },
            { $unwind: "$cuts" },
            { $match: { "cuts.id": cutId } },
            { $project: { "cart": { $objectToArray: "$cuts.carts" } } },
            {
                $project: {
                    packets: {
                        $filter: {
                            input: "$cart",
                            as: "ele",
                            cond: { $eq: ["$$ele.k", process] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    packets: {
                        $arrayElemAt: ["$packets.v.process.packets", 0]
                    }
                }
            },
            {
                $project: {
                    packet: {
                        $filter: {
                            input: "$packets",
                            as: "ele",
                            cond: { $eq: ["$$ele.id", id] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    subPackets: {
                        $arrayElemAt: ["$packet.subPackets", 0]
                    }
                }
            },
            {
                $project: {
                    maxField: {
                        $reduce: {
                            input: "$subPackets",
                            initialValue: 0,
                            in: { $max: ["$$value", "$$this.id"] }
                        }
                    }
                }
            }
        ])
            .exec()
            .then((result: any) => {
                console.log(result)
                const newPacket = {
                    diamondContainerId: "Packet-" + randomUUID(),
                    packetId: `${kapanId}S${cutId}S${PROCESS_IDS[process.toString()]}S${id}S${(result[0]?.maxField || 0) + 1}`,
                    id: (result[0]?.maxField || 0) + 1,
                    weight: req.body.weight,
                    pieces: req.body.pieces,
                    size: req.body.size,
                    remarks: req.body.remarks,
                    status: req.body.status || "PENDING",
                    mmvalue: req.body.mmvalue,
                    return: null,
                    created: {
                        time: `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`,
                        user: req.body.user
                    }
                }
                const filter = {
                    id: kapanId, // Replace with the actual document ID
                }

                const update = {
                    $push: {
                        [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets`]: newPacket, // Replace with the data you want to add
                    },
                };
                const options = {
                    arrayFilters: [
                        { "cut.id": cutId },
                        { "packet.id": id },
                    ],
                };
                const cut = kapanModel.updateOne(filter, update, options)
                    .then((result2) => {
                        if (result2.modifiedCount) {
                            res.json({ err: false, data: { id: result[0].maxField + 1 }, msg: DATA_SAVED });
                            Global.addLog({
                                user: req.body.user,
                                operation: Operation.A,
                                dataType: DataType.SP,
                                path: `/Packet/${kapanId}-${cutId}-${"LASER_LOTING"}-${id}?id=${result[0].maxField + 1}`,
                                data: { remarks: "Packet Added", weight: null, pieces: null }
                            })
                                .then(logResponse => {
                                    console.log("Log Added!!")
                                })
                                .catch(err => {
                                    console.log("Error in Adding Log!!")
                                })
                        }
                        else {

                            res.json({ err: true, data: null, msg: DATA_NOT_SAVED });
                        }
                    })
                    .catch((error) => {

                        res.status(500).json({ err: true, data: error })
                    });
            })
            .catch(err => console.log(err))

    }
    deleteSPacket = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());
        const process = req.query.process
        const packetId = parseInt(req.query.packetId.toString());
        const id = parseInt(req.query.id.toString());
        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const update = {
            $pull: {
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets`]: { id: id }, // Replace with the data you want to add
            },
        };

        const options = {
            arrayFilters: [
                {
                    "cut.id": cutId
                },
                {
                    "packet.id": packetId
                }
            ]
        }

        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_REMOVED_SUCCESSFULLY });
                    Global.addLog({
                        user: req.body.user,
                        operation: Operation.A,
                        dataType: DataType.SP,
                        path: `/Packet/${kapanId}-${cutId}-${"LASER_LOTING"}-${id}?id=${result[0].maxField + 1}`,
                        data: { remarks: "Packet Added", weight: null, pieces: null }
                    })
                        .then(logResponse => {
                            console.log("Log Added!!")
                        })
                        .catch(err => {
                            console.log("Error in Adding Log!!")
                        })
                }

                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }
    updateSPacket = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());

        const cutId = parseInt(req.query.cutId.toString());

        const process = req.query.process

        const packetId = parseInt(req.query.packetId.toString());

        const id = parseInt(req.query.id.toString());

        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const update = {
            $set: {
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].weight`]: req.body.weight,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].pieces`]: req.body.pieces,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].status`]: req.body.status,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].remarks`]: req.body.remarks,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].mmvalue`]: req.body.mmvalue,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].size`]: req.body.size,
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].lastModified`]: {
                    time: `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`,
                    user: req.body.user
                }

            },
        };

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
                { "packet.id": packetId },
                { "sPacket.id": id }
            ],
        };


        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                console.log("Error", error)
                res.status(500).json({ err: true, data: error })
            });
    }
    updateSPacketField = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());

        const cutId = parseInt(req.query.cutId.toString());

        const process = req.query.process

        const packetId = parseInt(req.query.packetId.toString());

        const id = parseInt(req.query.id.toString());

        const field = req.query.field;


        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const update = {
            $set: {
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].${field}`]: !isNaN(req.body[field.toString()]) ? parseFloat(req.body[field.toString()]) : req.body[field.toString()],
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].subPackets.$[sPacket].lastModified`]: {
                    time: `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`,
                    user: req.body.user
                }
            },
        };

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
                { "packet.id": packetId },
                { "sPacket.id": id }
            ],
        };


        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                console.log("Error", error)
                res.status(500).json({ err: true, data: error })
            });
    }

    //Staff
    getStaffs = async (req: express.Request, res: express.Response) => {
        const type: string = req.query.type?.toString();
        if (type && ["Pre-Process", "Post-Process"].includes(type)) {
            StaffModel.find({ type: type })
                .then((result: any) => {
                    res.json({ err: false, data: result })
                })
                .catch((error) => {
                    res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
                });
        } else {
            StaffModel.find()
                .then((result: any) => {
                    res.json({ err: false, data: result })
                })
                .catch((error) => {
                    res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
                });
        }
    }
    getStaffByID = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };
        StaffModel.findOne(filter)
            .then((result: any) => {
                console.log(result)

                if (result) {
                    res.json({ err: false, data: result })
                } else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });
    }
    addStaff = async (req: express.Request, res: express.Response) => {
        StaffModel.aggregate([
            {
                $group: {
                    _id: null, // Use null to group all documents together
                    maxField: { $max: "$id" } // $max accumulator to find the maximum value of fieldName
                }
            }
        ])
            .exec()
            .then(result => {
                const newStaff = {
                    id: (result[0]?.maxField || 0) + 1,
                    name: req.body.name,
                    remarks: req.body.remarks,
                    status: req.body.status || "PENDING",
                    type: req.body.type || "Pre-Process",
                    number: req.body.number

                }
                const Staff = new StaffModel(newStaff).save()
                    .then((savedStaff) => {
                        console.log('Staff instance saved successfully:' + JSON.stringify(savedStaff));
                        res.json({ err: false, data: savedStaff });
                        // Global.addLog({
                        //     user: req.body.user,
                        //     operation: Operation.A,
                        //     dataType: DataType.S,
                        //     path: `/cart/${kapanId}-${id}-${process}?id=${result[0].maxField + 1}`,
                        //     data: { remarks: "Packet Added", weight: null, pieces: null }
                        // })
                        //     .then(logResponse => {
                        //         console.log("Log Added!!")
                        //     })
                        //     .catch(err => {
                        //         console.log("Error in Adding Log!!")
                        //     })

                    })
                    .catch((error) => {
                        res.status(500).json({ err: true, data: error })
                    });
            }
            )
            .catch(err => console.log(err))
    }
    updateStaff = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };

        // Define the fields you want to update and their new values

        const update = {
            $set: { ...req.body, lastModified: new Date().toISOString() }
        };
        StaffModel.updateOne(filter, update, { new: true })
            .then((result: any) => {
                if (result.modifiedCount) {
                    StaffModel.findOne(filter)
                        .then((StaffFound) => {
                            res.json({ err: false, data: StaffFound })
                        })
                        .catch(err => {
                            throw Error("Error in fetching Updated Staff!!")
                        })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }
    deleteStaff = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };
        StaffModel.deleteOne(filter)
            .then((result: any) => {
                console.log(result)
                if (result.deletedCount) {
                    res.json({ err: false, data: result })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }

    //User      
    getUsers = async (req: express.Request, res: express.Response) => {
        UserModel.find()
            .then((result: any) => {
                res.json({ err: false, data: result })
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });
    }
    getUserByID = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };
        UserModel.findOne(filter)
            .then((result: any) => {
                console.log(result)

                if (result) {
                    res.json({ err: false, data: result })
                } else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });
    }
    addUser = async (req: express.Request, res: express.Response) => {
        bcrypt.hash(req.body.password, 10)
            .then(hashedPassssword => {
                UserModel.aggregate([
                    {
                        $group: {
                            _id: null, // Use null to group all documents together
                            maxField: { $max: "$id" } // $max accumulator to find the maximum value of fieldName
                        }
                    }
                ])
                    .exec()
                    .then(result => {
                        console.log("Data : ", result, req.body)
                        const newUser = {
                            diamondContainerId: "User-" + randomUUID(),
                            id: (result[0]?.maxField || 0) + 1,
                            name: req.body.name,
                            number: req.body.number,
                            status: req.body.status || "Active",
                            role: req.body.role,
                            password: hashedPassssword,
                            staff: req.body.staff,
                            nonStaff: req.body.nonStaff
                        }
                        const User = new UserModel(newUser).save()
                            .then((savedUser) => {
                                console.log('User instance saved successfully:' + JSON.stringify(savedUser));
                                res.json({ err: false, data: savedUser });
                            })
                            .catch((error) => {
                                console.log(error)
                                res.status(500).json({ err: true, data: error })
                            });
                    }
                    )
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }
    updateUser = async (req: express.Request, res: express.Response) => {
        const filter = { id: parseInt(req.query.id.toString()) };

        // Define the fields you want to update and their new values

        const update: any = {
            $set: {
                name: req.body.name,
                status: req.body.status,
                role: req.body.role,
                number: req.body.number,
                staff: req.body.staff,
                nonStaff: req.body.nonStaff
            }
        };



        UserModel.updateOne(filter, update, { new: true })
            .then((result: any) => {
                console.log("Resut : ", result, update, filter)
                if (result.modifiedCount) {
                    UserModel.findOne(filter)
                        .then((UserFound) => {
                            res.json({ err: false, data: UserFound })
                        })
                        .catch(err => {
                            throw Error("Error in fetching Updated User!!")
                        })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }
    deleteUser = async (req: express.Request, res: express.Response) => {
        const filter = { id: req.query.id };
        UserModel.deleteOne(filter)
            .then((result: any) => {
                console.log(result)
                if (result.deletedCount) {
                    res.json({ err: false, data: result })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }
    getUserStatus = async (req: express.Request, res: express.Response) => {
        const number = parseInt(req.query.number.toString());
        const password: string = req.query.password.toString()
        UserModel.find({ number: number })
            .then((result: any) => {
                if (result.length == 0) {
                    res.json({ err: false, data: { valid: false, data: result }, msg: "Number not found in user Database!!" })
                    return
                }
                bcrypt.compare(password, result[0].password)
                    .then(isPasswordmatch => {
                        if (isPasswordmatch && result[0].status == "Active") {
                            res.json({ err: false, data: { valid: true, data: result }, msg: "Login success!!" })
                        }
                        else {
                            res.json({ err: false, data: { valid: false, data: result }, msg: isPasswordmatch ? "User InActive" : "Invalid Password!!" })

                        }
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ err: true, data: err }); // Send a 500 response in case of an error
                    })

            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });
    }
    getUserStatusByNumber = async (req: express.Request, res: express.Response) => {
        const number = parseInt(req.query.number.toString());
        UserModel.find({ number: number })
            .then((result: any) => {
                if (result.length == 0) {
                    res.json({ err: false, data: { valid: false, data: result }, msg: "Number not found in user Database!!" })
                    return
                }
                if (result[0].status == "Active") {
                    res.json({ err: false, data: { valid: true, data: result }, msg: "Authenticated!!" })
                }
                else {
                    res.json({ err: false, data: { valid: false, data: result }, msg: "Invalid User" })

                }
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });
    }

    //Fields
    getFields = async (req: express.Request, res: express.Response) => {
        FieldsModel.find()
            .then((result: any) => {
                res.json({ err: false, data: result })
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });
    }
    addField = async (req: express.Request, res: express.Response) => {
        FieldsModel.find()
            .then((result: any) => {
                if (result.length == 0) {
                    new FieldsModel().save()
                        .then(() => {
                            FieldsModel.aggregate([
                                {
                                    $project: {
                                        maxId: {
                                            $reduce: {
                                                input: "$" + req.query.key.toString(),
                                                initialValue: 0,
                                                in: { $max: ["$$value", "$$this.id"] }
                                            }
                                        }
                                    }
                                }
                            ]).exec()
                                .then(result => {
                                    const filter = { id: "Kapan" }
                                    req.body.id = result[0]?.maxId + 1;
                                    const update = { $push: { [req.query.key.toString()]: req.body } };
                                    const Field = FieldsModel.updateOne(filter, update)
                                        .then((savedField) => {
                                            console.log('Field instance saved successfully:' + JSON.stringify(savedField));
                                            res.json({ err: false, data: savedField });
                                        })
                                        .catch((error) => {
                                            res.status(500).json({ err: true, data: error })
                                        });
                                })
                        })
                        .catch(err => {
                            res.status(500).json({ err: true, data: err }); // Send a 500 response in case of an error
                        })
                }
                else {
                    FieldsModel.aggregate([
                        {
                            $project: {
                                maxId: {
                                    $reduce: {
                                        input: "$" + req.query.key.toString(),
                                        initialValue: 0,
                                        in: { $max: ["$$value", "$$this.id"] }
                                    }
                                }
                            }
                        }
                    ]).exec()
                        .then((result: any) => {
                            console.log("Result : ", result)
                            const filter = { id: "Kapan" }
                            req.body.id = result[0]?.maxId + 1;
                            const update = { $push: { [req.query.key.toString()]: req.body } };
                            const Field = FieldsModel.updateOne(filter, update)
                                .then((savedField) => {
                                    console.log('Field instance saved successfully:' + JSON.stringify(savedField));
                                    res.json({ err: false, data: savedField, id: result[0]?.maxId + 1 });
                                })
                                .catch((error) => {
                                    res.status(500).json({ err: true, data: error })
                                });
                        })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
            });

    }
    deleteField = async (req: express.Request, res: express.Response) => {
        const filter = { id: "Kapan" };
        const update = { $pull: { [req.query.key.toString()]: { id: parseInt(req.query.id.toString()) } } }
        FieldsModel.updateOne(filter, update)
            .then((result: any) => {
                if (result.deletedCount) {
                    res.json({ err: false, data: result })
                }
                else {
                    res.json({ err: false, data: result, notFound: true })
                }
            })
            .catch((error) => {
                res.status(500).json({ err: true, data: error })
            });
    }
    //Cart weight transfer
    weightTransfer = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());
        const cutId = parseInt(req.query.cutId.toString());

        const source = req.body.source
        const sink = req.body.sink
        const weight = parseFloat(req.body.weight.toString());

        if (source == sink) {
            res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
            return
        }

        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const update = {
            $inc: {
                [`cuts.$[cut].carts.${source}.pending.weight`]: -weight,
                [`cuts.$[cut].carts.${sink}.pending.weight`]: weight
            },
        };

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
            ],
        };

        console.log(filter, update, options)

        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                console.log("bdibdk", error)
                res.status(500).json({ err: true, data: error })
            });
    }
    WeightTransferInProcess = async (kapanId: number, cutId: number, process: string, weight: number) => {
        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const update = {
            $inc: {
                [`cuts.$[cut].carts.${process}.pending.weight`]: weight,
            },
        };

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
            ],
        };

        return kapanModel.updateOne(filter, update, options)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    return { err: false, data: result, msg: "Updated Successfull!" }
                }
                else {
                    return { err: false, data: result, msg: "Not Updated!!" }

                }
            })
            .catch((error) => {
                console.log("Error : ", error)
            });
    }
    ReturnMainPacket = async (req: express.Request, res: express.Response) => {

        const kapanId = parseInt(req.query.kapanId.toString());

        const cutId = parseInt(req.query.cutId.toString());

        const process = req.query.process

        const id = parseInt(req.query.id.toString());

        const filter = {
            id: kapanId, // Replace with the actual document ID
        }

        const update = {
            $set: {
                [`cuts.$[cut].carts.${process}.process.packets.$[packet].return`]: req.body,

            },
        };

        const options = {
            arrayFilters: [
                { "cut.id": cutId },
                { "packet.id": id },
            ],
        };

        console.log(filter, update, options)

        const cuts = kapanModel.updateOne(filter, update, options)
            .then((result) => {
                console.log("Result : ", result, filter, update)
                if (result.modifiedCount) {
                    res.json({ err: false, data: { id: req.query.id }, msg: DATA_UPDATED });
                }
                else {
                    res.json({ err: true, data: null, not: DATA_NOT_FOUND });
                }
            })
            .catch((error) => {
                console.log("Erro : ", error)
                res.status(500).json({ err: true, data: error })
            });
    }
}

export default new Main();




