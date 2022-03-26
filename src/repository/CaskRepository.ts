import { Cask, PrismaClient } from '@prisma/client';
import { CaskFormula } from 'src/model/CaskFormula';

/**
 * The CaskRepository provides methods to access the cask database.
 */
export class CaskRepository {
    static instance = new CaskRepository();
    private prisma = new PrismaClient();

    /**
     * Creates and returns a new Cask from the given Cask Formula. The Cask is saved to the database.
     * 
     * @param caskFormula - The cask formula to create a new Cask from
     * @returns The new cask
     */
    async newCask(caskFormula: CaskFormula): Promise<Cask> {
        return this.prisma.cask.create({
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
                        data: caskFormula.allNames.map(name => ({ title: name, cask_title: caskFormula.title }))
                    }
                }
            },
            include: {
                cask_names: true
            }
        });
    }

    /**
     * Creates or updates a Cask from the given Cask Formula. The Cask is saved to the database.
     * The Cask gets returned afterwards.
     * 
     * @param caskFormula - The Cask Formula to create a new Cask from
     * @returns The new Cask
     */
    async updateOrNewCask(caskFormula: CaskFormula): Promise<Cask> {
        return this.prisma.cask.upsert({
            create: {
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
                        data: caskFormula.allNames.map(name => ({ title: name, cask_title: caskFormula.title }))
                    }
                }
            },
            update: {
                title: caskFormula.title,
                name: caskFormula.name,
                description: caskFormula.desc,
                url: caskFormula.url,
                homepage: caskFormula.homepage,
                install30: caskFormula.install30,
                install90: caskFormula.install90,
                install365: caskFormula.install365,
                cask_names: {
                    connectOrCreate: caskFormula.allNames.map(name => ({
                        create: { title: name, cask_title: caskFormula.title },
                        where: {
                            title_cask_title: {
                                cask_title: caskFormula.title,
                                title: name
                            }

                        }
                    }))
                }
            },
            where: {
                title: caskFormula.title
            },
            include: {
                cask_names: true
            }
        });
    }

    /**
     * Updates and returns a Cask from the given Cask Formula. The Cask is saved to the database.
     * 
     * @param caskFormula - The Cask Formula to create a new Cask from
     * @returns The updated cask
     */
    async updateCask(caskFormula: CaskFormula): Promise<Cask> {
        return this.prisma.cask.update({
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
                    connectOrCreate: caskFormula.allNames.map(name => ({
                        create: { title: name, cask_title: caskFormula.title },
                        where: {
                            title_cask_title: {
                                cask_title: caskFormula.title,
                                title: name
                            }

                        }
                    }))
                }
            },
            where: {
                title: caskFormula.title
            }
        })
    }

    async updateCaskAndIgnoreIfNotFound(caskFormula: CaskFormula) {
        return this.prisma.cask.updateMany({
            data: {
                title: caskFormula.title,
                name: caskFormula.name,
                description: caskFormula.desc,
                url: caskFormula.url,
                homepage: caskFormula.homepage,
                install30: caskFormula.install30,
                install90: caskFormula.install90,
                install365: caskFormula.install365
            },
            where: {
                title: caskFormula.title
            }
        })
    }



    /**
     * Returns a cask by its name. If the cask is not found in the database, null is returned.
     * 
     * @param title - The title of the cask.
     * @returns The cask or null if not found.
     */
    async getCask(title: string): Promise<Cask | null> {
        return this.prisma.cask.findFirst({
            where: {
                title: title
            },
            include: {
                cask_names: true
            }
        })
    }

    /**
     * Returns the most installed casks of the last 30 days. 
     * The count is limited by the given take parameter.
     * 
     * @param take - The number of casks to return
     * @returns The most installed casks of the last 30 days
     */
    async getTopInstall30Casks(take: number): Promise<Cask[]> {
        return this.prisma.cask.findMany({
            orderBy: {
                install30: 'desc'
            },
            take: take,
            include: {
                cask_names: true
            }
        });
    }

    /**
     * Returns the most installed casks of the last 90 days. 
     * The count is limited by the given take parameter.
     * 
     * @param take - The number of casks to return
     * @returns The most installed casks of the last 90 days
     */
    async getTopInstall90Casks(take: number): Promise<Cask[]> {
        return this.prisma.cask.findMany({
            orderBy: {
                install90: 'desc'
            },
            take: take,
            include: {
                cask_names: true
            }
        });
    }

    /**
     * Returns the most installed casks of the last 365 days. 
     * The count is limited by the given take parameter.
     * 
     * @param take - The number of casks to return
     * @returns The most installed casks of the last 365 days
     */
    async getTopInstall365Casks(take: number): Promise<Cask[]> {
        return this.prisma.cask.findMany({
            orderBy: {
                install365: 'desc'
            },
            take: take,
            include: {
                cask_names: true
            }
        });
    }
}