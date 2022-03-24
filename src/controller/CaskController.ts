import { Cask } from "@prisma/client";
import { CaskFormula } from "../model/CaskFormula";
import { CaskRepository } from "../repository/CaskRepository";
const fetch = require('node-fetch');

export class CaskController {
    static instance = new CaskController();
    private caskRepository = CaskRepository.instance;

    async fetchCaskFormula(name: string): Promise<CaskFormula | null> {
        const url = `https://formulae.brew.sh/api/cask/${name}.json`;
        const res = await fetch(url);


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

    async getCask(name: string): Promise<Cask | null> {
        const cask = await this.caskRepository.getCask(name);
        
        if (cask != null) {
            console.log(`Successfull got cask '${name}' from db`);
            return cask;
        }

        const formula = await this.fetchCaskFormula(name);

        if (formula == null) {
            return null;
        }

        console.log(`Create new cask '${name}'`);
        return this.caskRepository.newCask(formula);
    }
}