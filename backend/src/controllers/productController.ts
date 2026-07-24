import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Product, { generateShareId } from '../models/Product';
import Category from '../models/Category';

const ALLOWED_FIELDS = ['name', 'description', 'images', 'brand', 'category', 'price', 'discount', 'stock', 'sellerName', 'sellerPhone', 'sellerWhatsapp', 'featured', 'specifications'];
const SENSITIVE_FIELDS = ['sellerPhone', 'sellerWhatsapp'];
const DEFAULT_IMAGE_URL = 'https://placehold.co/600x400?text=Imported+Product';
const HEADER_ALIASES: Record<string, string> = {
  product: 'name',
  productname: 'name',
  title: 'name',
  item: 'name',
  brand: 'brand',
  category: 'category',
  categoryname: 'category',
  description: 'description',
  details: 'description',
  summary: 'description',
  price: 'price',
  unitprice: 'price',
  stock: 'stock',
  quantity: 'stock',
  image: 'images',
  imageurl: 'images',
  image_url: 'images',
  images: 'images',
  imageurls: 'images',
  image_urls: 'images',
  photo: 'images',
  photos: 'images',
  seller: 'sellerName',
  sellername: 'sellerName',
  sellerphone: 'sellerPhone',
  phone: 'sellerPhone',
  phoneno: 'sellerPhone',
  sellerwhatsapp: 'sellerWhatsapp',
  whatsapp: 'sellerWhatsapp',
  whatsappnumber: 'sellerWhatsapp',
};

function pickAllowed(body: any) {
  const result: any = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*').isString().isURL().withMessage('Each image must be a valid URL'),
];

function sanitizeProduct(doc: any) {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  for (const field of SENSITIVE_FIELDS) {
    delete obj[field];
  }
  return obj;
}

function normalizeHeader(header: string) {
  return header
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function resolveField(header: string) {
  const normalized = normalizeHeader(header);
  return HEADER_ALIASES[normalized] || normalized;
}

function parseCsv(content: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    if (char === '"') {
      if (inQuotes && content[index + 1] === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && content[index + 1] === '\n') {
        index += 1;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function cleanString(value?: string) {
  return typeof value === 'string' ? value.trim() : '';
}

function parsePrice(value?: string) {
  if (!value) return 0;
  const numeric = Number(cleanString(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseStock(value?: string) {
  if (!value) return 1;
  const numeric = Number(cleanString(value));
  return Number.isFinite(numeric) && numeric >= 0 ? Math.floor(numeric) : 1;
}

function parseImages(value?: string) {
  const raw = cleanString(value);
  if (!raw) return [];
  return raw
    .split(/\||;|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildProductPayload(row: Record<string, string>, index: number) {
  const name = cleanString(row.name) || cleanString(row.product_name) || `Imported Product ${index + 1}`;
  const brand = cleanString(row.brand) || 'Unbranded';
  const category = cleanString(row.category) || 'Accessories';
  const description = cleanString(row.description) || 'Imported product. Edit details and images after review.';
  const price = parsePrice(row.price);
  const stock = parseStock(row.stock);
  const images = parseImages(row.images || row.imageurl || row.image_url || row.image || '');
  const sellerName = cleanString(row.sellername) || 'Admin';
  const sellerPhone = cleanString(row.sellerphone) || 'Not provided';
  const sellerWhatsapp = cleanString(row.sellerwhatsapp) || 'Not provided';

  return {
    name,
    description,
    images: images.length ? images : [DEFAULT_IMAGE_URL],
    brand,
    category,
    price,
    discount: 0,
    stock,
    sellerName,
    sellerPhone,
    sellerWhatsapp,
    featured: false,
    specifications: {},
  };
}

export async function getProducts(req: Request, res: Response) {
  const products = await Product.find().sort({ createdAt: -1 });
  const needsBackfill = products.filter((p) => !p.shareId);
  if (needsBackfill.length > 0) {
    for (const p of needsBackfill) {
      p.shareId = generateShareId();
      await p.save();
    }
  }
  res.json(products.map(sanitizeProduct));
}

export async function normalizeExistingProductStock(req: Request, res: Response) {
  const result = await Product.updateMany(
    { $or: [{ stock: { $exists: false } }, { stock: null }, { stock: 0 }] },
    { $set: { stock: 1 } }
  );

  res.json({ updated: result.modifiedCount || result.matchedCount || 0 });
}

export async function getProductById(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!product.shareId) {
    product.shareId = generateShareId();
    await product.save();
  }
  res.json(sanitizeProduct(product));
}

export async function createProduct(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const data = pickAllowed(req.body);
  const product = await Product.create(data);
  res.status(201).json(product);
}

export async function importProducts(req: Request, res: Response) {
  const { csvText } = req.body || {};
  if (typeof csvText !== 'string' || !csvText.trim()) {
    return res.status(400).json({ message: 'CSV content is required' });
  }

  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    return res.status(400).json({ message: 'CSV file appears to be empty' });
  }

  const [headers, ...dataRows] = rows;
  if (dataRows.length > 100) {
    return res.status(400).json({ message: 'Please upload 100 products or fewer per batch for safer imports.' });
  }

  const headerKeys = headers.map((header) => resolveField(header));
  const createdProducts: any[] = [];
  const errors: Array<{ row: number; field?: string; message: string }> = [];

  const existingCategories = new Set((await Category.find({}, { name: 1 }).lean()).map((c: any) => c.name.toLowerCase()));
  const existingNames = new Set((await Product.find({}, { name: 1, brand: 1 }).lean()).map((p: any) => `${p.brand || ''}::${p.name || ''}`.toLowerCase()));

  for (const [index, rowValues] of dataRows.entries()) {
    const rowData: Record<string, string> = {};
    const hasContent = rowValues.some((cell) => cleanString(cell));
    if (!hasContent) continue;

    headerKeys.forEach((key, headerIndex) => {
      rowData[key] = cleanString(rowValues[headerIndex]);
    });

    const rowNumber = index + 2;
    const payload = buildProductPayload(rowData, index);
    const rowKey = `${payload.brand}::${payload.name}`.toLowerCase();

    if (!payload.name || payload.name.length < 3 || payload.name.length > 120) {
      errors.push({ row: rowNumber, field: 'name', message: 'Name is required and must be 3-120 characters.' });
      continue;
    }

    if (!payload.brand || payload.brand.trim().length < 1) {
      errors.push({ row: rowNumber, field: 'brand', message: 'Brand is required.' });
      continue;
    }

    if (!payload.description || payload.description.trim().length < 5) {
      errors.push({ row: rowNumber, field: 'description', message: 'Description is required.' });
      continue;
    }

    if (!payload.category || payload.category.trim().length < 1) {
      errors.push({ row: rowNumber, field: 'category', message: 'Category is required.' });
      continue;
    }

    const normalizedCategory = payload.category.trim().toLowerCase();
    if (!existingCategories.has(normalizedCategory)) {
      await Category.findOneAndUpdate(
        { name: payload.category.trim() },
        { name: payload.category.trim(), icon: '', image: '' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      existingCategories.add(normalizedCategory);
    }

    if (existingNames.has(rowKey)) {
      errors.push({ row: rowNumber, field: 'name', message: 'Duplicate product detected by brand + name.' });
      continue;
    }

    if (payload.price < 0) {
      errors.push({ row: rowNumber, field: 'price', message: 'Price must be zero or greater.' });
      continue;
    }

    if (payload.stock < 1) {
      payload.stock = 1;
    }

    if (payload.images.length === 0) {
      payload.images = [DEFAULT_IMAGE_URL];
    }

    try {
      const product = await Product.create(payload);
      createdProducts.push(product);
      existingNames.add(rowKey);
    } catch (error) {
      errors.push({ row: rowNumber, field: 'general', message: 'Could not be imported.' });
    }
  }

  res.status(200).json({
    created: createdProducts.length,
    skipped: Math.max(0, dataRows.length - createdProducts.length - errors.length),
    errors,
    products: createdProducts.map(sanitizeProduct),
  });
}

export async function updateProduct(req: Request, res: Response) {
  const data = pickAllowed(req.body);
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).end();
}

function htmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function getProductByShareId(req: Request, res: Response) {
  try {
    const { shareId } = req.params;
    let product = await Product.findOne({ shareId: shareId.toUpperCase() });
    if (!product) {
      const fallbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop`;
      return res.status(404).send(`<!DOCTYPE html><html><head><title>Product not found | ALEXTRONICS</title><meta property="og:title" content="Product not found"><meta name="twitter:card" content="summary"><meta http-equiv="refresh" content="0;url=${htmlEscape(fallbackUrl)}"></head><body><script>window.location.href="${htmlEscape(fallbackUrl)}"</script></body></html>`);
    }

    if (!product.shareId) {
      product.shareId = generateShareId();
      await product.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const productUrl = `${frontendUrl}/#/products/${product._id}`;
    const imageUrl = product.images?.[0] || '';
    const displayPrice = product.discount
      ? `KSh ${Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}`
      : `KSh ${product.price.toLocaleString()}`;
    const ogTitle = `${product.name} - ${displayPrice}`;
    const ogDesc = product.brand ? `${product.brand} — ${(product.description || '').slice(0, 120)}`.trim() : (product.description || '').slice(0, 140);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${htmlEscape(ogTitle)} | ALEXTRONICS</title>
  <meta property="og:site_name" content="ALEXTRONICS">
  <meta property="og:title" content="${htmlEscape(ogTitle)}">
  <meta property="og:description" content="${htmlEscape(ogDesc)}">
  <meta property="og:image" content="${htmlEscape(imageUrl)}">
  <meta property="og:url" content="${htmlEscape(productUrl)}">
  <meta property="og:type" content="product">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${htmlEscape(ogTitle)}">
  <meta name="twitter:description" content="${htmlEscape(ogDesc)}">
  <meta name="twitter:image" content="${htmlEscape(imageUrl)}">
  <meta http-equiv="refresh" content="0;url=${htmlEscape(productUrl)}">
  <style>
    body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .card{background:#fff;border-radius:24px;padding:40px;max-width:420px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)}
    .card img{width:100%;max-height:240px;object-fit:contain;border-radius:16px;background:#f8fafc;margin-bottom:20px}
    .card h1{font-size:20px;font-weight:700;color:#111827;margin:0 0 4px}
    .card .price{font-size:24px;font-weight:800;color:#111827;margin:8px 0}
    .card .brand{font-size:14px;color:#6b7280;margin:0 0 16px}
    .card a{display:inline-block;padding:12px 32px;background:#1E3A5F;color:#fff;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;margin-top:8px}
  </style>
</head>
<body>
  <div class="card">
    <img src="${htmlEscape(imageUrl)}" alt="${htmlEscape(product.name)}">
    <p class="brand">${htmlEscape(product.brand)}</p>
    <h1>${htmlEscape(product.name)}</h1>
    <p class="price">${htmlEscape(displayPrice)}</p>
    <a href="${htmlEscape(productUrl)}">View Product</a>
  </div>
  <script>window.location.href="${htmlEscape(productUrl)}"</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('share endpoint error:', err);
    res.status(500).send('Server error');
  }
}
