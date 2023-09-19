import { RequestHandler } from "express";

const notFoundHandler: RequestHandler = (_req, res) => {
    res.send({
        message: "This route was not found"
    })
}

export default notFoundHandler
