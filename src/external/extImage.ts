const wiki = require('wtf_wikipedia');
wiki.extend(require('wtf-plugin-image'));
wiki.extend(require('wtf-plugin-classify'));
import { parseFavicon } from "parse-favicon";
const fs = require("fs");



export async function getCaskImageFromHomepage(pageUrl: string, id:number): Promise<string[]> {

    if (/^https:\/\/github.com.+$/.test(pageUrl)) {
        //console.log("Cask has no homepage");
        return [];
    }
    const result: string[] = [];
    var gotAppleIcon: number = 0;
    try {
        await parseFavicon(pageUrl, textFetcher, bufferFetcher).forEach(async icon => {
            var iconURL = icon.url;
            if (!/^(http|https):\/\/.+/.test(iconURL)) {
                if (/.+apple-touch-icon.+/.test(iconURL)) gotAppleIcon++;
                iconURL = buildURL(pageUrl, icon.url);
            }
            if (/.+apple-touch-icon.+/.test(iconURL) && gotAppleIcon > 1) return;
            if (result.length >= 5) return;
            result.push(iconURL);
        });
    } catch(error) {
        fs.appendFileSync("./external/errorUrls.txt", pageUrl + '-' + id + '\n');
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
