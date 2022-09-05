// Work here i will do the changes to the client
import { InfiniteClient, recursiveRead, Event } from "@infinite-fansub/discord-client/dist";
import { Manager, Payload } from "erela.js";
import { ErelaOptions } from "./typings";

export class ErelaModule {

    readonly #client: InfiniteClient<ErelaOptions>;
    public readonly manager: Manager;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public erelaEvents = new Map<string, Event<any>>();

    public constructor(client: InfiniteClient<ErelaOptions>) {
        this.#client = client;
        this.manager = new Manager({
            nodes: client.options.nodes,
            send(id: string, payload: Payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });

        this.#client.dirs.erela && this.#loadErelaEvents();
    }

    #loadErelaEvents(): void {
        if (!this.#client.dirs.erela) return;
        recursiveRead(this.#client.dirs.erela)
            .forEach(async (path) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const event: Event<any> = (await import(path)).default;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.erelaEvents.set(event.event, event);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.manager[event.type](event.event, (...args) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    if (event.enabled ?? true) event.run(...args);
                });
            });
    }

    public addErelaEvents(path: string): void {
        this.#client.addDirs({ erela: path });
        this.#loadErelaEvents();
    }
}