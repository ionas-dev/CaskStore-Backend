import { Cask } from "@prisma/client";
import { getCaskFromDB, newCask, updateCaskAndIgnoreIfNotFound, updateCaskWithImages, updateOrNewCask } from "../repository/CaskRepository";
import { getAllCaskFormulasFromBrew, getAllCaskFormulasWithOnlyAnalyticsFromBrew, getCaskFormulaFromBrew } from "../repository/CaskFormulaRepository";
import { Days } from "../model/CaskFormula";
import { getCaskImageFromWikipedia } from "../repository/ImageRepositry";
const pLimit = require("p-limit");
const limit = pLimit(7);

/**
 * Returns a cask by its name. If the cask is not found in the database, it is fetched from the formula. 
 * If the no cask formula with the given name is found, null is returned.
 * 
 * @param name - The name of the cask.
 * @returns The cask or null if not found.
 */
export async function getCask(name: string): Promise<Cask | null> {
    const cask = await getCaskFromDB(name);

    if (cask != null) {
        console.log(`Successfull got cask '${name}' from db`);
        return cask;
    }

    const formula = await getCaskFormulaFromBrew(name);
    if (formula == null) {
        return null;
    }

    console.log(`Create new cask '${name}'`);
    return newCask(formula);
}

/**
 * Tries to find images for the given Cask. 
 * If the images are found, the cask is updated with the images.
 * 
 * @param cask - The title of the cask update.
 * @param searchQuerys - More querys to search for images.
 * @returns true if the cask was updated, false if not.
 */
export async function addCaskImage(cask: string, searchQuerys: string[]): Promise<Boolean> {
    const image = await getCaskImageFromWikipedia([cask].concat(searchQuerys));
    if (image == null) {
        return false;
    }

    updateCaskWithImages(cask, [image]);
    console.log("moin");
    return true;
}

/**
 * Fetches all casks all cask analytics by the brew api and saves them to the database.
 * 
 * @returns True if the database is built, false otherwise.
 */
export async function buildDatabase(): Promise<Boolean> {
    const caskFormulas_ = getAllCaskFormulasFromBrew();
    const caskFormulasWith30DayAnalytics_ = getAllCaskFormulasWithOnlyAnalyticsFromBrew(Days.THIRTY_DAYS);
    const caskFormulasWith90DayAnalytics_ = getAllCaskFormulasWithOnlyAnalyticsFromBrew(Days.NINETY_DAYS);
    const caskFormulasWith365DayAnalytics_ = getAllCaskFormulasWithOnlyAnalyticsFromBrew(Days.YEAR);

    const caskFormulas = await caskFormulas_;
    if (caskFormulas == null) {
        return false;
    }

    await Promise.all(caskFormulas.map(caskFormula => {
        return limit(() => addCaskImage(caskFormula.title, caskFormula.allNames));
    }));

    console.log(`Fetched: ${caskFormulas?.length} casks`);
    await Promise.all(caskFormulas.map(caskFormula => {
        return limit(() => updateOrNewCask(caskFormula))
    }));
    console.log(`Successfull created or updated casks`);

    const caskFormulasWith30DayAnalytics = await caskFormulasWith30DayAnalytics_;
    console.log(`Count of casks with 30 Day analytics: ${caskFormulasWith30DayAnalytics?.length}`);
    if (caskFormulasWith30DayAnalytics != null) {
        await Promise.all(caskFormulasWith30DayAnalytics.map(caskFormula => {
            return limit(() => updateCaskAndIgnoreIfNotFound(caskFormula))
        }));
    }
    console.log(`Successfull added 30 days analytics`);

    const caskFormulasWith90DayAnalytics = await caskFormulasWith90DayAnalytics_;
    console.log(`Count of casks with 90 Day analytics: ${caskFormulasWith90DayAnalytics?.length}`);
    if (caskFormulasWith90DayAnalytics != null) {
        await Promise.all(caskFormulasWith90DayAnalytics.map(caskFormula => {
            return limit(() => updateCaskAndIgnoreIfNotFound(caskFormula))
        }));
    }
    console.log(`Successfull added 90 days analytics`);

    const caskFormulasWith365DayAnalytics = await caskFormulasWith365DayAnalytics_;
    console.log(`Count of casks with 365 Day analytics: ${caskFormulasWith365DayAnalytics?.length}`);
    if (caskFormulasWith365DayAnalytics != null) {
        await Promise.all(caskFormulasWith365DayAnalytics.map(caskFormula => {
            return limit(() => updateCaskAndIgnoreIfNotFound(caskFormula))
        }));
    }
    console.log(`Successfull added 365 days analytics`);

    return true;
}