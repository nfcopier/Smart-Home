// noinspection SpellCheckingInspection

import {myQApi as Account, myQDevice as Device} from "@koush/myq";
import * as crypto from "crypto";
import NoopLogger from "./noop-logger";
import BasicCredentials from "./basic-credentials";
import LoginError from "./login-error";

const SECRET = 'gnhkjshe3ltn0tnhne4j5grg4njk';

interface DeviceStatus {
    status: string
}

export default class MyqApi {

    private static accounts: {[token: string]: Account} = {};

    public async getStatus(creds: BasicCredentials): Promise<DeviceStatus> {
        const account = await this.getAccount(creds);
        const opener = this.getDoorOpener(account);
        return {status: opener.state.door_state};
    }

    public async openDoor(creds: BasicCredentials): Promise<void> {
        const account = await this.getAccount(creds);
        const opener = this.getDoorOpener(account);
        await account.execute(opener, "Open");
    }

    public async closeDoor(creds: BasicCredentials): Promise<void> {
        const account = await this.getAccount(creds);
        const opener = this.getDoorOpener(account);
        await account.execute(opener, "Close");
    }

    private async getAccount({email, password}: BasicCredentials): Promise<Account> {
        const token = this.encrypt(`${email}-${password}`);
        if (MyqApi.accounts[token] == null)
            MyqApi.accounts[token] = await this.login(email, password);
        return MyqApi.accounts[token];
    }

    private async login(email: string, password: string, attempt = 0) {
        const account = new Account(() => {}, new NoopLogger(), email, password);
        await account.refreshDevices();
        if (account.devices == null) {
            if (attempt === 3) throw new LoginError();
            await this.time(500);
            await this.login(email, password, attempt + 1)
        }
        return account;
    }

    private encrypt(str: string): string {
        return crypto.createHmac('sha256', SECRET).update(str).digest('hex');
    }

    private getDoorOpener (account: Account): Device {
        // noinspection SpellCheckingInspection
        return account.devices.find(d => d.device_type === "virtualgaragedooropener");
    }

    private time(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

}
