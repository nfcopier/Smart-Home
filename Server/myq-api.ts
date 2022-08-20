// noinspection SpellCheckingInspection

import {myQApi as Account, myQDevice as Device} from "@koush/myq";
import * as crypto from "node:crypto";
import NoopLogger from "./noop-logger";
import BasicCredentials from "./basic-credentials";

const SECRET = 'gnhkjshe3ltn0tnhne4j5grg4njk';

export default class MyqApi {

    private static accounts: {[token: string]: Account} = {};

    public async getStatus(creds: BasicCredentials): Promise<string> {
        const account = await this.getAccount(creds);
        const opener = this.getDoorOpener(account);
        return opener.state.door_state;
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

    private async login(email: string, password: string) {
        const account = new Account(() => {}, new NoopLogger(), email, password);
        await account.refreshDevices();
        return account;
    }

    private encrypt(str: string): string {
        return crypto.createHmac('sha256', SECRET).update(str).digest('hex');
    }

    private getDoorOpener (account: Account): Device {
        // noinspection SpellCheckingInspection
        return account.devices.find(d => d.device_type === "virtualgaragedooropener");
    }

}
