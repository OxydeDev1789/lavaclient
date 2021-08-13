// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../@lavaclient/types
//   ../events

import type * as Lavalink from "@lavaclient/types";
import type { EventEmitter } from "events";

export class Player<N extends Node = Node> extends Emitter<PlayerEvents> {
    static USE_FILTERS: boolean;
    readonly node: N;
    readonly guildId: Snowflake;
    channelId?: string;
    track?: string;
    playing: boolean;
    playingSince?: number;
    paused: boolean;
    position?: number;
    connected: boolean;
    filters: Partial<Lavalink.FilterData>;
    constructor(node: N, guild: Snowflake | DiscordResource);
    get volume(): number;
    connect(channel: Snowflake | DiscordResource | null, options?: ConnectOptions): this;
    disconnect(): this;
    play(track: string | {
        track: string;
    }, options: PlayOptions): Promise<this>;
    stop(): Promise<this>;
    pause(state?: boolean): Promise<this>;
    resume(): Promise<this>;
    seek(position: number): Promise<this>;
    destroy(): Promise<this>;
    setVolume(volume: number): Promise<this>;
    setEqualizer(gains: number[]): Promise<this>;
    setEqualizer(...gains: number[]): Promise<this>;
    setEqualizer(bands: Lavalink.EqualizerBand[]): Promise<this>;
    setEqualizer(...bands: Lavalink.EqualizerBand[]): Promise<this>;
    setFilters(): Promise<this>;
    setFilters(filters: Partial<Lavalink.FilterData>): Promise<this>;
    setFilters<F extends Lavalink.Filter>(filter: F, data: Lavalink.FilterData[F]): Promise<this>;
    handleVoiceUpdate(update: VoiceStateUpdate | VoiceServerUpdate): Promise<this>;
    handleEvent(event: Lavalink.PlayerEvent): void;
}
export type PlayOptions = Omit<Lavalink.PlayData, "track">;
export type PlayerEvents = {
    trackStart: (track: string) => void;
    trackEnd: (track: string | null, reason: Lavalink.TrackEndReason) => void;
    trackException: (track: string | null, error: Error) => void;
    trackStuck: (track: string | null, thresholdMs: number) => void;
    channelLeave: (code: number, reason: string, byRemote: boolean) => void;
    channelMove: (from?: Snowflake, to?: Snowflake) => void;
};
export interface ConnectOptions {
    deafened?: boolean;
    muted?: boolean;
}
export interface VoiceServerUpdate {
    token: string;
    endpoint: string;
    guild_id: `${bigint}`;
}
export interface VoiceStateUpdate {
    session_id: string;
    channel_id: `${bigint}` | null;
    guild_id: `${bigint}`;
    user_id: `${bigint}`;
}

export class Node extends Emitter<NodeEvents> {
    static DEFAULT_STATS: Lavalink.StatsData;
    readonly players: Map<Snowflake, Player<this>>;
    readonly sendGatewayPayload: SendGatewayPayload;
    state: NodeState;
    stats: Lavalink.StatsData;
    constructor(options: NodeOptions);
    get conn(): Connection;
    get connected(): boolean;
    get userId(): Snowflake | undefined;
    set userId(user: Snowflake | {
        id: Snowflake;
    } | undefined);
    get penalties(): number;
    connect(user: Snowflake | {
        id: Snowflake;
    }): void;
    createPlayer(guild: Snowflake | DiscordResource): Player<this>;
    destroyPlayer(guild: Snowflake | DiscordResource): boolean;
    handleVoiceUpdate(update: VoiceStateUpdate | VoiceServerUpdate): void;
}
export type SendGatewayPayload = (id: Snowflake, payload: {
    op: 4;
    d: Dictionary;
}) => void;
export type NodeEvents = {
    connect: (event: ConnectEvent) => void;
    disconnect: (event: DisconnectEvent) => void;
    error: (error: Error) => void;
    debug: (message: string) => void;
};
export interface ConnectEvent {
    took: number;
    reconnect: boolean;
}
export interface DisconnectEvent {
    code: number;
    reason: string;
    reconnecting: boolean;
    wasClean: boolean;
}
export interface NodeOptions {
    connection: ConnectionInfo;
    sendGatewayPayload: SendGatewayPayload;
    user?: Snowflake | {
        id: Snowflake;
    };
}


export enum NodeState {
    Idle = 0,
    Connecting = 1,
    Connected = 2,
    Disconnecting = 3,
    Disconnected = 4,
    Reconnecting = 5
}

export class Emitter<E extends Listeners> extends EventEmitter {
}
type Listener<A extends Array<any> = any[]> = (...args: A) => void;
type Listeners = Dictionary<Listener, string | symbol>;
export interface Emitter<E extends Listeners> extends EventEmitter {
    on<K extends keyof E>(eventName: K, listener: E[K]): this;
    emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): boolean;
}
export function sleep(duration: number): Promise<void>;
export function getId(value: Snowflake | DiscordResource): Snowflake;


export class Cluster extends Emitter<ClusterEvents> {
    readonly nodes: Map<String, ClusterNode>;
    readonly sendGatewayPayload: SendGatewayPayload;
    userId?: Snowflake;
    constructor(options: ClusterOptions);
    static createNodes(cluster: Cluster, options: ClusterOptions): Map<string, ClusterNode>;
    get players(): Map<Snowflake, Player<ClusterNode>>;
    get idealNodes(): ClusterNode[];
    createPlayer(guild: Snowflake | DiscordResource, nodeId?: string): Player<ClusterNode>;
    destroyPlayer(guild: Snowflake | DiscordResource): boolean;
    handleVoiceUpdate(update: VoiceServerUpdate | VoiceStateUpdate): void;
}
export type ClusterEvents = {
    nodeConnect(node: ClusterNode, event: ConnectEvent): void;
    nodeDisconnect(node: ClusterNode, event: DisconnectEvent): void;
    nodeError(node: ClusterNode, error: Error): void;
    nodeDebug(node: ClusterNode, message: string): void;
};
export interface ClusterOptions {
    nodes: ClusterNodeOptions[];
    sendGatewayPayload: SendGatewayPayload;
    user?: Snowflake | DiscordResource;
}
export interface ClusterNodeOptions extends ConnectionInfo {
    id: string;
}


export class Connection {
    static CLIENT_NAME: string;
    readonly node: Node;
    readonly info: ConnectionInfo;
    reconnectTry: number;
    payloadQueue: QueuedPayload[];
    constructor(node: Node, info: ConnectionInfo);
    get active(): boolean;
    get address(): string;
    send(important: boolean, data: Lavalink.OutgoingMessage): Promise<void>;
    connect(): void;
    disconnect(code?: number, reason?: string): void;
    configureResuming(): Promise<void>;
    flushQueue(): void;
    reconnect(): boolean;
}
export type ReconnectDelay = (current: number) => number | Promise<number>;
export interface ConnectionInfo {
    host: string;
    port: number;
    password: string;
    secure?: boolean;
    resuming?: ResumingOptions;
    reconnect?: ReconnectOptions;
}
export interface ResumingOptions {
    key: string;
    timeout?: number;
}
export interface ReconnectOptions {
    delay?: number | ReconnectDelay;
    tries?: number;
}
export interface QueuedPayload {
    resolve: () => void;
    reject: (error: Error) => void;
    data: Lavalink.OutgoingMessage;
}


export type Snowflake = string;
export type DiscordResource = {
    id: Snowflake;
};
export type Dictionary<V = any, K extends string | number | symbol = string> = Record<K, V>;

export class ClusterNode extends Node {
    readonly cluster: Cluster;
    readonly id: string;
    constructor(cluster: Cluster, id: string, info: ConnectionInfo);
}

