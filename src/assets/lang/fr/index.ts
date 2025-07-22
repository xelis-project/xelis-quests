import type { LocalizationMap } from "../map";

import settings from "./settings";
import quest_1 from "./quest_1";
import intro from "./intro";

export default {
    ...intro,
    ...settings,
    ...quest_1
} as LocalizationMap;
