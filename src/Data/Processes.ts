import {PRE_PROCESS_TYPES as pre,POST_PROCESS_TYPES as post} from '../enums/processTypes'

const PreMfgProcess = {
    processDetails : [
        {
            processName : pre.MARKING_LOTING,
            returnSlots : [pre.LASER_LOTING,pre.POLISH_LOTING]
        },
        {
            processName : pre.LASER_LOTING,
            returnSlots : [pre.GHAT_LOTING,pre.POLISH_LOTING,pre.MARKING_LOTING]
        },
        {
            processName : pre.BOIL_LOTING,
            returnSlots : [pre.LASER_LOTING,pre.POLISH_LOTING]
        },
        {
            processName : pre.GHAT_LOTING,
            returnSlots : [pre.LASER_LOTING,pre.POLISH_LOTING]
        },
        {
            processName : pre.SHAPE_LOTING,
            returnSlots : [pre.LASER_LOTING,pre.POLISH_LOTING]
        },
        {
            processName : pre.POLISH_LOTING,
            returnSlots : [pre.LASER_LOTING,pre.POLISH_LOTING]
        },
        {
            processName : pre.POLISH_TABLE_LOTING,
            returnSlots : [pre.LASER_LOTING,pre.POLISH_LOTING]
        }
    ]
}

export const PROCESS_IDS : any = {
    ORIGINAL_CUT : "OC",
    MARKING_LOTING: "ML",
    LASER_LOTING: "LL",
    BOIL_LOTING: "BL",
    GHAT_LOTING: "GL",
    SHAPE_LOTING: "SL",
    POLISH_LOTING: "PL",
    POLISH_TABLELOTING: "PLT_",
    POLISHED : "P",
    NATS_PROCESS: "NP",
    LAL_ACIDPROCESS: "LAP",
    LUSTER_PROCESS: "LP",
    PROPONEL_PROCESS: "PP",
    FILLING_PROCESS: "FP",
    ORIGINAL_RC : "ORC",
    RC : "RC",
    REJECTION : "RJC"
}

