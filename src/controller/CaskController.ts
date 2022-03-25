import { Cask } from "@prisma/client";
import { CaskRepository } from "../repository/CaskRepository";
import { CaskFormulaRepository } from "../repository/CaskFormulaRepository";

/**
 * The CaskController provides methods to handle requests to the different data sources and prepare the data for further use.
 */
export class CaskController {
    static instance = new CaskController();
    private caskRepository = CaskRepository.instance;
    private caskFormulaRepository = CaskFormulaRepository.instance;

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
}