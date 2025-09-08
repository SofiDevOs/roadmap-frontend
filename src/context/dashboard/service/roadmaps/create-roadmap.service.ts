import type { Roadmap } from "src/types/roadmap.type";
import { roadmapData as data, roadmapData } from "@data/roadmapMockData";


async function createRoadmap(roadmap: Roadmap): Promise<void> {
    data.push(roadmap)
}
