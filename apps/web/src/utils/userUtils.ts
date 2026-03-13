import { User } from '@omninote/shared';

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];
const names = ['Тарас', 'Олена', 'Андрій', 'Марія', 'Іван', 'Юлія', 'Богдан'];


export const getRandomUser = (): User => ({
  name: names[Math.floor(Math.random() * names.length)],
  color: colors[Math.floor(Math.random() * colors.length)],
});