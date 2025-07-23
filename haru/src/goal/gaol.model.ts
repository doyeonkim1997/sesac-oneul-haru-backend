import { GoalCategory } from './goal-category.enum';

export interface Goal {
  goalId: number;
  userId: number;
  title: string;
  content: string;
  category: GoalCategory;
  isCompleted: boolean;
  isDeleted: boolean;
  cheerCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export class BoardModule {}
