import { User } from '@omninote/shared';

const colors = ['#6366f1', '#A06B3E', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];
const names = ['Sarah', 'Alex Chen', 'Jordan P.', 'Taylor', 'Morgan', 'Casey', 'Riley'];

export const getRandomUser = (): User => ({
  name: names[Math.floor(Math.random() * names.length)],
  color: colors[Math.floor(Math.random() * colors.length)],
});