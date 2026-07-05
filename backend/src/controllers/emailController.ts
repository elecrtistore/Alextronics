import Subscriber from '../models/Subscriber';
import Product from '../models/Product';
import nodemailer from 'nodemailer';
import xss from 'xss';

export function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return null;
}

function sanitize(str: string): string {
  return xss(str, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
  });
}

const BRAND = {
  name: 'ALEXTRONICS',
  primary: '#1E3A5F',
  primaryLight: '#e8edf3',
  accent: '#059669',
  bg: '#f8fafc',
  textDark: '#111827',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
};

const headerBlock = `
  <div style="text-align:center;padding-bottom:24px;border-bottom:2px solid ${BRAND.primaryLight};margin-bottom:24px">
    <div style="display:inline-block;background:${BRAND.primary};color:#fff;padding:10px 28px;border-radius:12px;font-size:20px;font-weight:800;letter-spacing:1px">${BRAND.name}</div>
    <p style="margin:8px 0 0;font-size:12px;color:${BRAND.textMuted};letter-spacing:2px;text-transform:uppercase">Premium Electronics Marketplace</p>
  </div>
`;

const footerBlock = `
  <div style="text-align:center;padding-top:24px;border-top:2px solid ${BRAND.primaryLight};margin-top:24px">
    <p style="font-size:12px;color:${BRAND.textMuted};margin:0 0 4px">${BRAND.name} &mdash; Premium Electronics Marketplace</p>
    <p style="font-size:12px;color:${BRAND.textMuted};margin:0">Nairobi, Kenya</p>
    <p style="font-size:11px;color:${BRAND.textLight};margin:12px 0 0">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color:${BRAND.primary};text-decoration:underline">Visit our store</a>
      &nbsp;&middot;&nbsp;
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contacts" style="color:${BRAND.primary};text-decoration:underline">Contact us</a>
    </p>
    <p style="font-size:11px;color:${BRAND.textLight};margin:8px 0 0">You received this email because you subscribed to ${BRAND.name} updates.</p>
    <p style="font-size:11px;color:${BRAND.textLight};margin:4px 0 0">Unsubscribe anytime by replying to this email.</p>
  </div>
`;

function productCard(p: any): string {
  const price = p.discount
    ? `<p style="margin:0 0 2px;font-size:20px;font-weight:700;color:${BRAND.textDark}">KSh ${Math.round(p.price * (1 - p.discount / 100)).toLocaleString()}</p><p style="margin:0;font-size:13px;color:${BRAND.textMuted}"><del>KSh ${p.price.toLocaleString()}</del> <span style="color:${BRAND.accent};font-weight:600">${sanitize(String(p.discount))}% OFF</span></p>`
    : `<p style="margin:0;font-size:20px;font-weight:700;color:${BRAND.textDark}">KSh ${p.price.toLocaleString()}</p>`;

  return `
    <div style="border:1px solid #e5e7eb;border-radius:16px;padding:20px;margin-bottom:16px;background:#fff">
      <img src="${sanitize(p.images?.[0] || '')}" alt="${sanitize(p.name)}" style="width:100%;height:200px;object-fit:contain;border-radius:12px;background:${BRAND.bg};margin-bottom:14px" />
      <h3 style="margin:0 0 4px;font-size:16px;font-weight:600;color:${BRAND.textDark}">${sanitize(p.name)}</h3>
      <p style="margin:0 0 10px;font-size:13px;color:${BRAND.textMuted}">${sanitize(p.brand || '')}</p>
      ${price}
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/products/${p._id}" style="display:inline-block;margin-top:14px;padding:10px 28px;background:${BRAND.primary};color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">View Product</a>
    </div>
  `;
}

function wrap(body: string): string {
  return `
    <div style="font-family:'Inter',system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:${BRAND.bg}">
      <div style="background:#fff;border-radius:24px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
        ${headerBlock}
        ${body}
        ${footerBlock}
      </div>
    </div>
  `;
}

function buildTemplate(template: string, data: any): string {
  const safeBody = sanitize(data.body || '');
  const safeSubject = sanitize(data.subject || 'News from ALEXTRONICS');

  const ctaButton = (url: string, label: string) => `
    <a href="${sanitize(url)}" style="display:inline-block;padding:14px 36px;background:${BRAND.primary};color:#fff;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.3px">${sanitize(label)}</a>
  `;

  const templates: Record<string, string> = {
    'new-arrival': wrap(`
      <h1 style="font-size:26px;font-weight:800;color:${BRAND.textDark};margin:0 0 6px;line-height:1.2">New Arrivals Just Landed</h1>
      <p style="font-size:14px;color:${BRAND.textMuted};margin:0 0 24px;line-height:1.6">Check out the latest products added to our catalog. Fresh arrivals in electronics, gadgets, and accessories.</p>
      ${(data.products || []).map(productCard).join('')}
      <div style="text-align:center;margin-top:8px">${ctaButton(process.env.FRONTEND_URL || 'http://localhost:5173', 'Browse All New Arrivals')}</div>
    `),
    'discount': wrap(`
      <h1 style="font-size:26px;font-weight:800;color:${BRAND.textDark};margin:0 0 6px;line-height:1.2">Price Drop Alert!</h1>
      <p style="font-size:14px;color:${BRAND.textMuted};margin:0 0 24px;line-height:1.6">Great news! Some of your favorite items now have discounts. Grab them before they're gone.</p>
      ${(data.products || []).map(productCard).join('')}
      <div style="text-align:center;margin-top:8px">${ctaButton(process.env.FRONTEND_URL || 'http://localhost:5173', 'Shop Deals')}</div>
    `),
    'product-spotlight': wrap(`
      <h1 style="font-size:26px;font-weight:800;color:${BRAND.textDark};margin:0 0 6px;line-height:1.2">Product Spotlight</h1>
      <p style="font-size:14px;color:${BRAND.textMuted};margin:0 0 24px;line-height:1.6">We're featuring a curated selection of top-quality products just for you.</p>
      ${(data.products || []).map(productCard).join('')}
      <div style="text-align:center;margin-top:8px">${ctaButton(process.env.FRONTEND_URL || 'http://localhost:5173', 'View Full Collection')}</div>
    `),
    'custom': wrap(`
      <h1 style="font-size:26px;font-weight:800;color:${BRAND.textDark};margin:0 0 6px;line-height:1.2">${safeSubject}</h1>
      <div style="font-size:14px;color:${BRAND.textMuted};line-height:1.7">${safeBody}</div>
      ${(data.products || []).length ? `<div style="margin-top:24px">${(data.products || []).map(productCard).join('')}</div>` : ''}
      ${data.ctaUrl && data.ctaLabel ? `<div style="text-align:center;margin-top:20px">${ctaButton(data.ctaUrl, data.ctaLabel)}</div>` : ''}
    `),
    'password-reset': wrap(`
      <div style="text-align:center">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:16px;background:${BRAND.primaryLight};margin-bottom:16px">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${BRAND.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
      </div>
      <h1 style="font-size:24px;font-weight:800;color:${BRAND.textDark};margin:0 0 8px;text-align:center">Reset Your Password</h1>
      <p style="font-size:14px;color:${BRAND.textMuted};margin:0 0 24px;text-align:center;line-height:1.6">We received a request to reset the password for your <strong>${BRAND.name}</strong> account associated with <strong style="color:${BRAND.textDark}">${sanitize(data.email || '')}</strong>.</p>
      <div style="text-align:center;margin:24px 0">${ctaButton(data.resetLink, 'Reset Password')}</div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin:20px 0">
        <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.5">
          <strong>Security notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
      <p style="font-size:13px;color:${BRAND.textMuted};text-align:center;margin:0">If the button above doesn't work, copy and paste this URL into your browser:</p>
      <p style="font-size:12px;color:${BRAND.primary};text-align:center;margin:6px 0 0;word-break:break-all">${sanitize(data.resetLink || '')}</p>
    `),
  };

  return templates[template] || templates.custom;
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`Password reset email would send to ${email} (SMTP not configured)`);
    return;
  }
  const from = process.env.EMAIL_FROM || 'noreply@electristore.com';
  const html = buildTemplate('password-reset', { resetLink, email });
  await transporter.sendMail({
    from,
    to: email,
    subject: 'Reset your ALEXTRONICS password',
    html,
  });
}

export async function subscribe(req: any, res: any) {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        if (name) existing.name = name;
        await existing.save();
      }
      return res.json({ message: 'Already subscribed', subscriber: existing });
    }
    const subscriber = await Subscriber.create({ email, name });
    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (err: any) {
    if (err.code === 11000) return res.json({ message: 'Already subscribed' });
    res.status(500).json({ message: 'Failed to subscribe' });
  }
}

export async function getSubscribers(req: any, res: any) {
  try {
    const subscribers = await Subscriber.find({ active: true }).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch {
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
}

export async function deleteSubscriber(req: any, res: any) {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch {
    res.status(500).json({ message: 'Failed to remove subscriber' });
  }
}

export async function sendEmail(req: any, res: any) {
  try {
    const { template, subject, body, productIds } = req.body;
    const subscriberFilter = req.body.subscriberIds?.length
      ? { _id: { $in: req.body.subscriberIds }, active: true }
      : { active: true };
    const subscribers = await Subscriber.find(subscriberFilter);
    if (!subscribers.length) return res.status(400).json({ message: 'No active subscribers' });

    let products: any[] = [];
    if (productIds?.length) {
      products = await Product.find({ _id: { $in: productIds } });
    }

    const transporter = getTransporter();
    if (!transporter) {
      console.log(`Email would send to ${subscribers.length} subscribers (SMTP not configured)`);
      return res.json({ message: `Email queued for ${subscribers.length} subscribers (SMTP not configured, logged only)`, sent: subscribers.length });
    }

    const from = process.env.EMAIL_FROM || 'noreply@electristore.com';
    const html = buildTemplate(template || 'custom', { subject, body, products });
    const text = `Email from ALEXTRONICS\n\n${body || ''}`;

    let sent = 0;
    const errors: string[] = [];
    for (const sub of subscribers) {
      try {
        await transporter.sendMail({ from, to: sub.email, subject: subject || 'News from ALEXTRONICS', text, html });
        sent++;
      } catch (e: any) {
        errors.push(`${sub.email}: ${e.message}`);
      }
    }

    res.json({ message: `Sent to ${sent} of ${subscribers.length} subscribers`, sent, total: subscribers.length, errors: errors.length ? errors : undefined });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to send email' });
  }
}
