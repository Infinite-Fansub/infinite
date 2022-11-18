import { InfiniteClient, IClientEvents } from "@infinite-fansub/discord-client/dist";
import { Listeners } from "./typings/listeners";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("@infinite-fansub/logger");

export class LoggerModule {
    readonly #client;
    #listeners: Listeners = {
        ready: true,
        databaseOpen: true,
        // deletedSlash: true,
        loadedSlash: true
    };

    public constructor(client: InfiniteClient) {
        this.#client = client;
    }

    public inject(): void {
        this.#injectListeners();
    }

    #injectListeners(): void {
        (<Array<[keyof Omit<Listeners, "deletedSlash">, boolean]>>Object.entries(this.#listeners)).forEach(([event, listen]) => {
            listen && this.#client.on(<never>event, this[event]);
        });
    }

    protected ready(...[client]: IClientEvents["ready"]): void {
        logger.infinitePrint(`Logged in as: ${client.user.tag} (${client.user.id})`);
    }

    protected databaseOpen(): void {
        logger.log("Successefully connected to the DB");
    }

    // protected deletedSlash(...[type]: IClientEvents["deletedSlash"]): void {
    // Cant implement yet due to some issues related to this event
    // }

    protected loadedSlash(...[commands, type]: IClientEvents["loadedSlash"]): void {
        if (type === "Global") {
            commands.forEach(({ name }) => {
                logger.log(`Loaded Global command: ${name}`);
            });
        } else {
            commands.forEach(({ name }) => {
                logger.log(`Loaded ${name} on: ${type}`);
            });
        }
    }

    public get listeners(): Listeners {
        return this.#listeners;
    }

    public set listeners(value: Listeners) {
        this.listeners = { ...this.#listeners, ...value };
    }
}