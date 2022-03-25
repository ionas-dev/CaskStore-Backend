import { CaskFormula } from 'src/model/CaskFormula';
const fetch = require('node-fetch');

/**
 * The CaskFormula Repository provides methods to fetch cask formulas by the brew api.
 */
export class CaskFormulaRepository {
    static instance = new CaskFormulaRepository();

    /**
     * Retruns the cask formula with the given name by the brew api. 
     * If the cask formula is not found, null is returned.
     * 
     * @param name - The name of the cask formula
     * @returns The cask formula or null if not found
     */
     async getCaskFormula(name: string): Promise<CaskFormula | null> {
        const url = `https://formulae.brew.sh/api/cask/${name}.json`;
        const res: Response = await fetch(url);

        // TODO: Handle every case specifically
        if (!res.ok) {
            console.log("Error: Cask not found");
            return null;
        }

        const obj = await res.json();

        try {
            const cask = CaskFormula.fromJson(obj);
            console.log(`Successfull fetch of '${name}'`)
            return cask;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}