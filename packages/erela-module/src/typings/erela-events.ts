import { IClientEvents } from "@infinite-fansub/discord-client";
import { Player, Track, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, UnresolvedTrack, WebSocketClosedEvent, Node } from "erela.js";

export interface ErelaEvents extends IClientEvents {
    nodeCreate: [node: Node];
    nodeDestroy: [node: Node];
    nodeConnect: [node: Node];
    nodeReconnect: [node: Node];
    nodeDisconnect: [node: Node, reason: {
        code?: number,
        reason?: string
    }];
    nodeError: [node: Node, error: Error];
    nodeRaw: [payload: unknown];
    playerCreate: [player: Player];
    playerDestroy: [player: Player];
    queueEnd: [player: Player, track: Track | UnresolvedTrack, payload: TrackEndEvent];
    playerMove: [player: Player, initChannel: string, newChannel: string];
    playerDisconnect: [player: Player, oldChannel: string];
    trackStart: [player: Player, track: Track, payload: TrackStartEvent];
    trackEnd: [player: Player, track: Track, payload: TrackEndEvent];
    trackStuck: [player: Player, track: Track, payload: TrackStuckEvent];
    trackError: [player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent];
    socketClosed: [player: Player, payload: WebSocketClosedEvent];
}