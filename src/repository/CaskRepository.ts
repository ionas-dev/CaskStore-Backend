import { Cask, cask_names, PrismaClient } from '@prisma/client';
import { CaskFormula } from 'src/model/CaskFormula';

export class CaskRepository {
    static instance = new CaskRepository();
    private prisma = new PrismaClient();

    async newCask(caskFormula: CaskFormula): Promise<Cask> {
        const cask = await this.prisma.cask.create({
            data: {
                title: caskFormula.title,
                name: caskFormula.name,
                description: caskFormula.desc,
                url: caskFormula.url,
                homepage: caskFormula.homepage,
                install30: caskFormula.install30,
                install90: caskFormula.install90,
                install365: caskFormula.install365,
                cask_names: {
                    createMany: {
                        data: caskFormula.allNames.map(name => { return { title : name } })
                    }
                }
            }
        })

        return cask
    }

    async getCask(title: string): Promise<Cask | null> {
        return this.prisma.cask.findFirst({
            where: {
                title: title
            }
        })
    }
}