import { Request, Response } from 'express';
import Category from '../models/Category';

export async function getCategories(req: Request, res: Response) {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
}

export async function createCategory(req: Request, res: Response) {
  const category = new Category(req.body);
  await category.save();
  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
}

export async function deleteCategory(req: Request, res: Response) {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.status(204).end();
}
