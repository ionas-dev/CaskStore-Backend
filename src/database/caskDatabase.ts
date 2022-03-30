import { Cask, CaskCategory, CaskImage, Category, Prisma, PrismaClient } from '@prisma/client';
import { CaskFormula } from 'src/model/CaskFormula';
const prisma = new PrismaClient();

/**
 * Creates and returns a new Cask from the given Cask Formula. The Cask is saved to the database.
 * 
 * @param caskFormula - The cask formula to create a new Cask from
 * @returns The new cask
 */
export async function newCask(caskFormula: CaskFormula): Promise<Cask> {
    return prisma.cask.create({
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
export async function updateOrNewCask(caskFormula: CaskFormula): Promise<Cask> {
    return prisma.cask.upsert({
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
export async function updateCask(caskFormula: CaskFormula): Promise<Cask> {
    return prisma.cask.update({
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

/**
 * Adds images to a Cask. The Cask is saved to the database.
 * 
 * @param cask - The title of the cask to add the images to
 * @param imgs - The urls of the images to add
 * @returns The updated Cask
 */
export async function updateCaskWithImages(cask: string, imgs: string[]): Promise<Cask> {
    return prisma.cask.update({
        data: {
            cask_image: {
                createMany: {
                    data: imgs.map((img, i) => ({ url: img, title: `${cask} - Image: ${i}` }))
                }
            }
        },
        where: {
            title: cask
        }
    });
}

/**
 * Tries to update a Cask from the given Cask Formula. The Cask is saved to the database. 
 * If The Cask is not fond, it is ignored.
 * 
 * @param caskFormula - The Cask Formula to create a new Cask from
 * @returns The Prisma batch payload which holds the count of updated images
 */
export async function updateCaskAndIgnoreIfNotFound(caskFormula: CaskFormula): Promise<Prisma.BatchPayload> {
    return prisma.cask.updateMany({
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
export async function getCaskFromDB(title: string): Promise<Cask | null> {
    return prisma.cask.findFirst({
        where: {
            title: title
        },
        include: {
            cask_names: true
        }
    })
}

/**
 * Increments the upvote count of the given category to the given cask. If this is the first upvote of the category 
 * for this cast, a new entry in the CaskCategory schema is created.
 * @param caskID - Id of the cask
 * @param categoryID - Id of the category
 * @returns True if the upvote was successfull and false if the cask or category does not exist
 */
export async function upvoteCaskCategory(caskID: number, categoryID: number): Promise<Boolean> {
    const cask: Cask | null = await prisma.cask.findUnique({
        where: {
            id: caskID
        }
    });
    const category: Category | null = await prisma.category.findUnique({
        where: {
            id: categoryID
        }
    });
    if (cask == null || category == null) return false;

    prisma.caskCategory.upsert({
        create: {
            title: category.title,
            categoryId: categoryID,
            caskId: caskID,
            upvotes: 1
        },
        update: {
            upvotes: { increment: 1 }
        },
        where: {
            categoryId_caskId: {
                categoryId: categoryID,
                caskId: caskID
            }
        }
    });
    return true;
}

/**
 * Increments the upvote count of the given image.
 * @param imageID - Id of the image
 * @returns The Prisma batch payload which holds the count of updated images
 */
export async function upvoteCaskImage(imageID: number): Promise<Prisma.BatchPayload> {
    return prisma.caskImage.updateMany({
        data: {
            upvotes: { increment: 1 }
        },
        where: {
            id: imageID
        }
    });
}
