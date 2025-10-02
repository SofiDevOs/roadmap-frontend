import type { Roadmap } from "src/types/roadmap.type";

import { roadmapData as data } from "@data/roadmapMockData";


async function getRoadmaps(id:string): Promise<Roadmap | null>{
    const roadmaps =  data as unknown as Roadmap[];
    const result =  roadmaps.find(roadmap => id === roadmap.id);
    return result || null;
}
