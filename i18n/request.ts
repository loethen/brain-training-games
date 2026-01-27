import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// List of all i18n modules (matching the split file names)
const I18N_MODULES = [
    'common',
    'metadata',
    'workingMemoryGuide',
    'home',
    'typesOfGames',
    'adhdAssessment',
    'adultAdhdAssessment',
    'categories',
    'games',
    'buttons',
    'blog',
    'getStarted',
    'about',
    'legal',
    'tests',
    'guides',
    'cpsTest',
] as const;

function deepMerge(target: any, source: any) {
    if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
        return;
    }

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], deepMerge(target[key], source[key]));
            }
        }
    }
    Object.assign(target || {}, source);
    return target;
}

export default getRequestConfig(async ({ requestLocale }) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    // Load and merge all module files
    const messages: Record<string, unknown> = {};

    for (const module of I18N_MODULES) {
        try {
            const moduleMessages = (await import(`../messages/${locale}/${module}.json`)).default;
            deepMerge(messages, moduleMessages);
        } catch {
            // If module file doesn't exist, try loading from the main file as fallback
            console.warn(`i18n module not found: ${locale}/${module}.json`);
        }
    }

    return {
        locale,
        messages,
    };
});
