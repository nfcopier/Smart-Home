import {Request, Response, Router} from "express";
import MyqApi from "./myq-api";
import BasicCredentials from "./basic-credentials";

export default () => {

    const router = Router();

    const api = new MyqApi();

    router.post("/myq/status", async (request: Request, response: Response) => {
        const credentials = request.body as BasicCredentials;
        const status = await api.getStatus(credentials);
        response.status(200).send(status);
    });

    router.post("/myq/open", async (request: Request, response: Response) => {
        const credentials = request.body as BasicCredentials;
        await api.openDoor(credentials);
        response.sendStatus(200);
    });

    router.post("/myq/close", async (request: Request, response: Response) => {
        const credentials = request.body as BasicCredentials;
        await api.closeDoor(credentials);
        response.sendStatus(200);
    });

    return router;

};
