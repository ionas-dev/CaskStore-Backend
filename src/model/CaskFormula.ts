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
        cask.url = json.url;
        cask.homepage = json.homepage;
        cask.install30 = json.analytics.install["30d"][cask.title!];
        cask.install90 = json.analytics.install["90d"][cask.title!];
        cask.install365 = json.analytics.install["365d"][cask.title!];

        return cask;
    }

     /**
     * Returns the cask formula created from the given json object without analytics.
     * 
     * @param json - The json object
     * @returns The cask formula
     */
      static fromJsonWithoutAnalytics(json: any): CaskFormula {
        let cask = new CaskFormula(json.token);
        cask.name = json.name[0];
        cask.allNames = json.name;
        cask.desc = json.desc;
        cask.url = json.url;
        cask.homepage = json.homepage;

        return cask;
    }

    /**
     * Returns the cask formula created from the given json object wiht only analytics.
     * 
     * @param json - The json object
     * @returns The cask formula
     */
     static fromJsonJustAnalytics(json: any, days: Days): CaskFormula {
        let cask = new CaskFormula(json.cask);
        let count = +(json.count as string).replace(",", "");
        switch (days) {
            case Days.THIRTY_DAYS: 
                cask.install30 = count;
                break;
            case Days.NINETY_DAYS:
                cask.install90 = count;
                break;
            case Days.YEAR:
                cask.install365 = count;
                break;
        }
        
        return cask;
    }
}

export enum Days {
    THIRTY_DAYS = "30d",
    NINETY_DAYS = "90d",
    YEAR = "365d"
}