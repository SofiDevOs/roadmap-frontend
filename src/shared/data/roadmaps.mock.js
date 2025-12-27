import { faker } from '@faker-js/faker';

const generateMockRoadmap = () => {
  return {
    // id: faker.datatype.uuid(),
    slug: faker.lorem.slug(),
    title: faker.lorem.sentence(3),
    description: faker.lorem.paragraphs(2),
    level: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']), // si estaba bien asi xD siempre devuelve random
    banner:`https://picsum.photos/300/20${faker.helpers.rangeToNumber({min:1, max: 10})}`,
    modules: faker.helpers.rangeToNumber({min: 1, max:10})
  };
};

const generateMockRoadmaps = (count = 4) => {
  return Array.from({ length: count }, generateMockRoadmap);
};

export { generateMockRoadmaps };
