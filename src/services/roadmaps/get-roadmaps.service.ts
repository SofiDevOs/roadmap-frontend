import type { Roadmap } from "src/types/roadmap.type";

import { roadmapData as data } from "@data/roadmapMockData";


async function getRoadmaps(): Promise<Roadmap[] | null>{
    return data as unknown as Roadmap[];

}
