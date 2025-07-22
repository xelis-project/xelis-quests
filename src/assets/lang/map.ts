import type { Lang } from '../../localization';
import fr from './fr/index';

export type LocalizationMap = Record<string, string>;
export type LangMap = Record<Lang, LocalizationMap>

export default {
    "fr": fr
} as LangMap;
