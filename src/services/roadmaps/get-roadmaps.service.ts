import type { Roadmap } from "src/types/roadmap.type";

import { roadmapData as data } from "src/shared/data/roadmapMockData";


async function getRoadmaps(): Promise<Roadmap[] | null>{
    return data as unknown as Roadmap[];

}
