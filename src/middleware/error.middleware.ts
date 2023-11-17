import { Request, Response, NextFunction } from 'express'


export default class ErrorMiddleware {
    // routeNotFound(req: Express.Request, res: Express.Response, next: NextFunction) {
    //     const exception = response404(res, 'Route Not Found')
    //     next(exception)
    //     next
    // }

    processErrors(
        err: unknown,
        req: Request,
        res: Response,
        _next: NextFunction
    ) {
        // this.logger.error(JSON.stringify(err))
        const timestamp = new Date()
        const uri = `${req.protocol}://${req.hostname}${req.originalUrl}`
        if (err) {
            return response500(res, 'Internal Server Error')
        }
        res.status(500).send({
            statusCode: 500,
            // message: 'Http Exception',
            // status: 'exception',
            exceptionType: 'Internal Server Error',
            uri,
            timestamp,
        })

    }
}

export const response404 = function (res: Response, msg: string) {
    return res.status(404).json({ status: false, statusCode: 404, message: msg });
}

export const response500 = function (res: Response, msg: string) {
    return res.status(500).json({ status: false, statusCode: 500, message: msg });
}


