import { Cask } from "@prisma/client";
import { CaskRepository } from "../repository/CaskRepository";
import { CaskFormulaRepository } from "../repository/CaskFormulaRepository";
import { Days } from "../model/CaskFormula";
import { ImageRepository } from "../repository/ImageRepositry";
const pLimit = require("p-limit");
const limit = pLimit(7);

/**
 * The CaskController provides methods to handle requests to the different data sources and prepare the data for further use.
 */
export class CaskController {
    static instance = new CaskController();
    private caskRepository = CaskRepository.instance;
    private caskFormulaRepository = CaskFormulaRepository.instance;
    private imageRepository = ImageRepository.instance;

    /**
     * Returns a cask by its name. If the cask is not found in the database, it is fetched from the formula. 
     * If the no cask formula with the given name is found, null is returned.
     * 
     * @param name - The name of the cask.
     * @returns The cask or null if not found.
     */
    async getCask(name: string): Promise<Cask | null> {
        const cask = await this.caskRepository.getCask(name);

        if (cask != null) {
            console.log(`Successfull got cask '${name}' from db`);
            return cask;
        }

        const formula = await this.caskFormulaRepository.getCaskFormula(name);
        if (formula == null) {
            return null;
        }

        console.log(`Create new cask '${name}'`);
        return this.caskRepository.newCask(formula);
    }

    async addCaskImage(cask: string, names: string[]): Promise<Boolean> {
        const image = await this.imageRepository.getCaskImageFromWikipedia([cask].concat(names));
        if (image == null) {
            return false;
        }

        this.caskRepository.updateCaskWithImages(cask, [image]);
        console.log("moin");
        return true;
    }

    /**
     * Fetches all casks all cask analytics by the brew api and saves them to the database.
     * 
     * @returns True if the database is built, false otherwise.
     */
    async buildDatabase(): Promise<Boolean> {
        const caskFormulas_ = this.caskFormulaRepository.getAllCaskFormulas();
        const caskFormulasWith30DayAnalytics_ = this.caskFormulaRepository.getAllCaskFormulasWithOnlyAnalytics(Days.THIRTY_DAYS);
        const caskFormulasWith90DayAnalytics_ = this.caskFormulaRepository.getAllCaskFormulasWithOnlyAnalytics(Days.NINETY_DAYS);
        const caskFormulasWith365DayAnalytics_ = this.caskFormulaRepository.getAllCaskFormulasWithOnlyAnalytics(Days.YEAR);

        
        const caskFormulas = await caskFormulas_;
        if (caskFormulas == null) {
            return false;
        }

        await Promise.all(caskFormulas.map(caskFormula => {
            return limit(() => this.addCaskImage(caskFormula.title, caskFormula.allNames));
        }));

        
        console.log(`Fetched: ${caskFormulas?.length} casks`);
        await Promise.all(caskFormulas.map(caskFormula => {
            return limit(() => this.caskRepository.updateOrNewCask(caskFormula))
        }));
        console.log(`Successfull created or updated casks`);
        
        
        const caskFormulasWith30DayAnalytics = await caskFormulasWith30DayAnalytics_;
        console.log(`Count of casks with 30 Day analytics: ${caskFormulasWith30DayAnalytics?.length}`);
        if (caskFormulasWith30DayAnalytics != null) {
            await Promise.all(caskFormulasWith30DayAnalytics.map(caskFormula => {
                return limit(() => this.caskRepository.updateCaskAndIgnoreIfNotFound(caskFormula))
            }));
        }
        console.log(`Successfull added 30 days analytics`);

        const caskFormulasWith90DayAnalytics = await caskFormulasWith90DayAnalytics_;
        console.log(`Count of casks with 90 Day analytics: ${caskFormulasWith90DayAnalytics?.length}`);
        if (caskFormulasWith90DayAnalytics != null) {
            await Promise.all(caskFormulasWith90DayAnalytics.map(caskFormula => {
                return limit(() => this.caskRepository.updateCaskAndIgnoreIfNotFound(caskFormula))
            }));
        }
        console.log(`Successfull added 90 days analytics`);

        const caskFormulasWith365DayAnalytics = await caskFormulasWith365DayAnalytics_;
        console.log(`Count of casks with 365 Day analytics: ${caskFormulasWith365DayAnalytics?.length}`);
        if (caskFormulasWith365DayAnalytics != null) {
            await Promise.all(caskFormulasWith365DayAnalytics.map(caskFormula => {
                return limit(() => this.caskRepository.updateCaskAndIgnoreIfNotFound(caskFormula))
            }));
        }
        console.log(`Successfull added 365 days analytics`);

        return true;
    }
}