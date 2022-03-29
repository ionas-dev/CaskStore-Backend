import { CaskFormula, Days } from '../model/CaskFormula';
const fetch = require('node-fetch');

/**
 * Returns the Cask Formula with the given name by the brew api. 
 * If the Cask Formula is not found, null is returned.
 * 
 * @param name - The name of the Cask Formula
 * @returns The Cask Formula or null if not found
 */
export async function getCaskFormulaFromBrew(name: string): Promise<CaskFormula | null> {
    const url = `https://formulae.brew.sh/api/cask/${name}.json`;
    const res: Response = await fetch(url);

    // TODO: Handle every case specifically
    if (!res.ok) {
        console.log("Error: Cask not found");
        return null;
    }

    const obj = await res.json();

    try {
        const caskFormula = CaskFormula.fromJson(obj);
        console.log(`Successfull fetch of '${name}'`)
        return caskFormula;
    } catch (e) {
        console.log(e);
        return null;
    }
}

/**
 * Returns all Cask Formulas by the brew api. 
 * If the Cask Formulas are not found, null is returned.
 * 
 * @returns The Cask Formulas or null if not found
 */
export async function getAllCaskFormulasFromBrew(): Promise<CaskFormula[] | null> {
    const url = "https://formulae.brew.sh/api/cask.json";
    const res: Response = await fetch(url);

    // TODO: Handle every case specifically
    if (!res.ok) {
        console.log("Error: Cask not found");
        return null;
    }

    const objs = await res.json();

    const caskFormulas: CaskFormula[] = objs.map((obj: any) => {
        try {
            const caskFormula = CaskFormula.fromJson(obj);
            return caskFormula;
        } catch (e) {
            console.log(e);
            return null;
        }
    });

    return caskFormulas;
}

/**
 * Returns lightweight Cask Formulas with only the title and a installation count of the given period.
 * The Cask Formulas are fetched by the brew api. 
 * If the Cask Formulas are not found, null is returned.
 * 
 * @param days - The period of time to fetch the Cask Formulas
 * @returns The Cask Formulas or null if not found
 */
export async function getAllCaskFormulasWithOnlyAnalyticsFromBrew(days: Days): Promise<CaskFormula[] | null> {
    const url = `https://formulae.brew.sh/api/analytics/cask-install/homebrew-cask/${days}.json`;
    const res: Response = await fetch(url);

    // TODO: Handle every case specifically
    if (!res.ok) {
        console.log("Error: Cask not found");
        return null;
    }

    const objs = await res.json();
    const caskFormulas: CaskFormula[] = [];

    for (const obj in objs.formulae) {
        try {
            const caskFormula = CaskFormula.fromAnalyticsJson(objs.formulae[obj][0], days);
            caskFormulas.push(caskFormula);
        } catch (e) {
            console.log(e);
        }
    }


    return caskFormulas;
}