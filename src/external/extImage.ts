const wiki = require('wtf_wikipedia');
wiki.extend(require('wtf-plugin-image'));
wiki.extend(require('wtf-plugin-classify'));

/**
 * Fetches and returns url of image for the given cask names. 
 * The images are fetched from wikipedia.
 * 
 * @param names - The names of the cask to fetch the image for.
 * @returns Url of the image.
 */
export async function getCaskImageFromWikipedia(names: string[]): Promise<string | null> {
    for (const name of names) {
        console.log("Searching for image for " + name);
        let page = await wiki.fetch(name);

        if (page?.isDisambiguation()) {
            const linkedPages = page.links().map((link: any) => link.page());
            const softwarePages = linkedPages.filter((page: string) => page.indexOf("software") !== -1);

            if (softwarePages.length === 0) {
                return null;
            }

            page = await wiki.fetch(softwarePages[0]);
        }

        const image = page?.mainImage();
        const imgSrc = image?.src();
        if (imgSrc != undefined) {
            return imgSrc;
        }
    }
    return null;
}