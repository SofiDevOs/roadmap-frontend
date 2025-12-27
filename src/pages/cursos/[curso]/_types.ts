export interface Lessons {
  [key:string]: Lesson[]
}

type Lesson = {
  slug: string;
  title: string;
  progress: number;
}
