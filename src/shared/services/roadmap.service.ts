import { api } from "src/consts";
import { ROAMAPS_EXAMPLE } from "./_examples/roadmaps.example";
const { DEV } = import.meta.env;

export async function getRoadmaps(accessToken: string | null) {

  const [roadmaps] = await api("roadmaps")()({
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if(!roadmaps && DEV) return ROAMAPS_EXAMPLE;

  return roadmaps;

}
