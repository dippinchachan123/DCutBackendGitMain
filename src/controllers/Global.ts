import { randomUUID } from "crypto"
import LogModel from '../DBModels/Logs'
import express from 'express';
import { DATA_ALREADY_EXISTS, DATA_FEATCHED, DATA_NOT_FOUND, DATA_NOT_SAVED, DATA_REMOVED_SUCCESSFULLY, DATA_SAVED, DATA_UPDATED, ERROR_WHILE_FEATCHING_DATA } from "../utils/constants/global.constants";
import { PROCESS_IDS } from "../Data/Processes";
import { PRE_PROCESS_TYPES } from "../enums/processTypes";

export class Global {   
    static addLog = async (data: any) => {
        LogModel.aggregate([
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
            const newLog = {
                id: (result[0]?.maxField || 0) + 1,
                user: data.user,
                operation: data.operation,
                dataType: data.dataType,
                path: data.path,
                data: data.data
        }
            return new LogModel(newLog).save()
        }
        )
        .catch(err => console.log(err))
    }

    static getLogs = async (req: express.Request, res: express.Response) => {
        LogModel.find()
        .then((result: any) => {
            res.json({ err: false, data: result })
        })
        .catch((error) => {
            res.status(500).json({ err: true, data: error }); // Send a 500 response in case of an error
        });
    }
}
