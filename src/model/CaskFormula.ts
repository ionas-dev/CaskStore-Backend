
export class CaskFormula {
    title: string;
    name: string;
    allNames: [string];
    desc: string;
    homepage: string;
    url: string;
    install30: number;
    install90: number;
    install365: number;

    static fromJson(json: any): CaskFormula {
        let cask = new CaskFormula();
        cask.title = json.token;
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