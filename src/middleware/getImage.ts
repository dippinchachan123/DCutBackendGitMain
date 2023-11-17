import express from "express";
import path from "path";

export const getImage = async (req: express.Request, res: express.Response, next) => {
    try {
        // const host = req.headers.host.split(":")[0];
        let url = req.originalUrl;
        let type = url.split('/')[3];
        let { image } = req.query; 
        let isTypeExist = type!==undefined?type.split("?")[0]:"";
        // console.log("this is host", host.split('/')[0]);
        // console.log("this is host2", type);

        if (isTypeExist === 'getImage') {
            console.log('my static page server');
            return res.sendFile(path.join(__dirname, `../views/uploads/${image}`));
        }
        // else if (host.split('/')[0] === '127.0.0.1' || host.split('/')[0]==="ebdevnodebackend.evervent.in" || host.split('/')[0]==="ebstgnodebackend.evervent.in") {
        //     console.log('my server');
        //     return next()
        // } 
    }catch(err){
        console.log(err);
    }
}