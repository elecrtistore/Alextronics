import Inquiry from '../models/Inquiry';
import Product from '../models/Product';

export async function getStats(req: any, res: any) {
  const totalProducts = await Product.countDocuments();
  const totalInquiries = await Inquiry.countDocuments();
  const newInquiries = await Inquiry.countDocuments({ status: 'New' });
  const soldItems = await Inquiry.countDocuments({ status: 'Sold' });

  const inquiriesPerDay = await Inquiry.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({ totalProducts, totalInquiries, newInquiries, soldItems, inquiriesPerDay });
}
