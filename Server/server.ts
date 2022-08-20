import * as Express from "express";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import MyqRouter from "./myq-router";

const certRoot = process.env.CERTIFICATE_ROOT;

const app = Express();
app.use(Express.json());

app.get("healthcheck", (_, response: Express.Response) => {
    response.status(200).send("true");
});

app.use(MyqRouter());

if (certRoot == null) {
    app.listen(3000, () => {
        console.log("Listening on Port 3000");
    });
} else {
    const credentials = {
        key: fs.readFileSync(path.join(certRoot, "privkey.pem")),
        certificate: fs.readFileSync(path.join(certRoot, "cert.pem")),
        ca: fs.readFileSync(path.join(certRoot, "chain.pem"))
    };
    const server = https.createServer(credentials, app);
    server.listen(443, () => {
        console.log("Listening on Port 443");
    });
}
