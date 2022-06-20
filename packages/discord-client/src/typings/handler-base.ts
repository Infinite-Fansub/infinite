export interface Handler {
    loadCommands: () => void;
    loadSlashCommands: () => void;
    loadEvents: () => void;
}