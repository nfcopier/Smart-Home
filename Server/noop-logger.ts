// noinspection JSUnusedGlobalSymbols
export default class NoopLogger {
    info(_: string): void {
    }

    warn(message: string): void {
        console.warn(message);
    }

    error(message: string): void {
        console.error(message);
    }

    debug(_: string): void {
    }
}