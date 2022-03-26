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
     * Analytics are optional.
     * 
     * @param json - The json object
     * @returns The cask formula
     */
    static fromJson({ token, name, desc, url, homepage, analytics = undefined }:
        {
            token: string,
            name: string[],
            desc: string,
            url: string,
            homepage: string,
            analytics?: {
                install: {
                    "30d": any,
                    "90d": any,
                    "365d": any
                }
            } | undefined
        }
    ): CaskFormula {
        let caskFormula = new CaskFormula(token);
        caskFormula.name = name[0];
        caskFormula.allNames = name;
        caskFormula.desc = desc;
        caskFormula.url = url;
        caskFormula.homepage = homepage;

        if (analytics === undefined) {
            return caskFormula;
        }
        caskFormula.install30 = analytics.install["30d"][token];
        caskFormula.install90 = analytics.install["90d"][token];
        caskFormula.install365 = analytics.install["365d"][token];

        return caskFormula;
    }

    /**
     * Returns the cask formula created from the given json object with only analytics.
     * 
     * @param json - The json object
     * @returns The cask formula
     */
    static fromAnalyticsJson({ cask, count }: { cask: string, count: string }, days: Days): CaskFormula {
        let caskFormula = new CaskFormula(cask);
        let countNum = +count.replace(",", "");
        switch (days) {
            case Days.THIRTY_DAYS:
                caskFormula.install30 = countNum;
                break;
            case Days.NINETY_DAYS:
                caskFormula.install90 = countNum;
                break;
            case Days.YEAR:
                caskFormula.install365 = countNum;
                break;
        }

        return caskFormula;
    }
}

export enum Days {
    THIRTY_DAYS = "30d",
    NINETY_DAYS = "90d",
    YEAR = "365d"
}