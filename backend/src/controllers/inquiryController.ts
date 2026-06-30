import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import Product from '../models/Product';

export async function createInquiry(req: Request, res: Response) {
  const inquiry = new Inquiry(req.body);
  await inquiry.save();
  res.status(201).json(inquiry);
}

export async function getInquiries(req: Request, res: Response) {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
}

export async function getInquiryById(req: Request, res: Response) {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json(inquiry);
}

export async function updateInquiryStatus(req: Request, res: Response) {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json(inquiry);
}
