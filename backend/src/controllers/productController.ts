import { Request, Response } from 'express';
import Product from '../models/Product';

export async function getProducts(req: Request, res: Response) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

export async function getProductById(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).end();
}
