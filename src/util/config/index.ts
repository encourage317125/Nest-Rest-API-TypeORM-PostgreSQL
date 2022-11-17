export class Config {
    public static param(key: string, def: string): string {
        return Config.string(key, def);
    }
    public static string(key: string, def: any): string {
        return process.env[key] || def;
    }

    public static number(key: string, def: number): number {
        return parseInt(Config.string(key, def));
    }
}