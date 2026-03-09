import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

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
    '10Seconds',
    'ResonanceBreathing',
    'BoxBreathing',
    'Breathing478',
] as const;

const messageCache = new Map<string, Record<string, unknown>>();

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const [key, sourceValue] of Object.entries(source)) {
        const targetValue = target[key];

        if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
            deepMerge(targetValue, sourceValue);
            continue;
        }

        target[key] = sourceValue;
    }
}

async function loadMessages(locale: string) {
    const cachedMessages = messageCache.get(locale);
    if (cachedMessages) {
        return cachedMessages;
    }

    const modules = await Promise.all(
        I18N_MODULES.map(async (module) => {
            try {
                return (await import(`../messages/${locale}/${module}.json`)).default as Record<string, unknown>;
            } catch {
                console.warn(`i18n module not found: ${locale}/${module}.json`);
                return null;
            }
        })
    );

    const messages = modules.reduce<Record<string, unknown>>((accumulator, moduleMessages) => {
        if (moduleMessages) {
            deepMerge(accumulator, moduleMessages);
        }
        return accumulator;
    }, {});

    messageCache.set(locale, messages);
    return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: await loadMessages(locale),
    };
});
