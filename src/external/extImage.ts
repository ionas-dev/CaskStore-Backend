const wiki = require('wtf_wikipedia');
wiki.extend(require('wtf-plugin-image'));
wiki.extend(require('wtf-plugin-classify'));
import { parseFavicon } from "parse-favicon";
import { PrismaClient } from "../../prisma/generated/client";
const fs = require("fs");


/**
 * Fetches icon URLs of given homepage and returns them in an array
 * 
 * @param pageUrl URL of homepage
 * @param id Cask Id (only for Errors)
 * @param max Maximum number of icons which should be fetched
 * @returns Array of icon URLs
 */
export async function getCaskImageFromHomepage(pageUrl: string, id: number, max: number): Promise<string[]> {
    if (/^https:\/\/github.com.+$/.test(pageUrl)) {
        console.log("Cask has no homepage");
        return [];
    }
    const result: string[] = [];
    try {
        await parseFavicon(pageUrl, textFetcher, bufferFetcher).forEach(async icon => {
            var iconURL = icon.url;
            if (!/^(http|https):\/\/.+/.test(iconURL)) {
                iconURL = buildURL(pageUrl, icon.url);
            }
            if (result.length >= max) return;
            result.push(iconURL);
        });
    } catch(error) {
        fs.appendFileSync("./src/external/errorUrls.txt", pageUrl + '-' + id + '\n');
    }

    async function textFetcher(url: string) {
        return await fetch(resolveUrl(url, pageUrl)).then(res => res.text());
    }
      
    async function bufferFetcher(url: string) {
        return await fetch(resolveUrl(url, pageUrl)).then(res => res.arrayBuffer());
    }
      
    function resolveUrl(url: string , base: string) {
        return new URL(url, base).href;
    }

    return result;
}

/**
 * Helper function to create URL for icon path
 * 
 * @param pageUrl Homepage URL
 * @param icon Icon path
 * @returns URL of icon
 */
function buildURL(pageUrl: string, icon: string): string {
    const realPageUrl = pageUrl.split('/').splice(0,3).join('/');
    const realIcon = (icon.charAt(0) == '/') ? icon.substring(1,icon.length) : icon;
    return realPageUrl + '/' + realIcon;
}


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

/**
 * Script for fetching icons of all casks
 */
async function addIconsToDatabase() {
    const prisma = new PrismaClient();
    var caskCounter = 1;
    const casks = await prisma.cask.findMany({
        select: {
            id: true,
            title: true,
            homepage: true
        },
        take: 100
    }).then(casks => {
        casks.forEach(cask => {
            if (cask.homepage != null) {
                getCaskImageFromHomepage(cask.homepage, cask.id, 5).then(result => {
                    if (caskCounter % 100 == 0) console.log("Cask " + caskCounter + " of " + casks.length);
                    if (caskCounter == casks.length) console.log("Done!")
                    if (result.length > 0) {
                        result.forEach((imageUrl,index) => {
                            const result = prisma.caskImage.upsert({
                                create: {
                                    title: (cask.title + '-Icon:' + index),
                                    type: 'icon',
                                    url: imageUrl,
                                    caskId: cask.id
                                },
                                update: {
                                },
                                where: {
                                    title: (cask.title + '-Icon:' + index)
                                }
                            }).then();
                        });
                    }
                    caskCounter++;
                });
            }
        });
    });
}