export default class LoginError extends Error {

    public constructor() {
        super("Could not login");
    }

}
