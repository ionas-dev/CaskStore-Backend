/**
 * The CaskFormula represents a cask formula defined by the brew api.
 */
export class CaskFormula {
    title: string;
    name: string | undefined = undefined;
    allNames: string[] = [];
    desc: string | undefined = undefined;
    homepage: string | undefined = undefined;
    url: string | undefined = undefined;
    install30: number | undefined = undefined;
    install90: number | undefined = undefined;
    install365: number | undefined = undefined;

    constructor(title: string) {
        this.title = title;
    }

    /**
     * Returns the cask formula created from the given json object.
     * 
     * @param json - The json object
     * @returns The cask formula
     */
    static fromJson(json: any): CaskFormula {
        let cask = new CaskFormula(json.token);
        cask.name = json.name[0];
        cask.allNames = json.name;
        cask.desc = json.desc;
        cask.install30 = json.analytics.install["30d"][cask.title!];
        cask.install90 = json.analytics.install["90d"][cask.title!];
        cask.install365 = json.analytics.install["365d"][cask.title!];
        cask.url = json.url;
        cask.homepage = json.homepage;

        return cask;
    }
}