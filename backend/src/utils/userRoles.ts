import Admin from '../models/Admin';

export type AppUserRole = 'Admin' | 'Seller' | 'Buyer';

function parseEmailList(value?: string) {
  return (value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function getRoleForEmail(email?: string, uid?: string): Promise<AppUserRole> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) return 'Buyer';

  if (uid) {
    const adminRecord = await Admin.findOne({ firebaseUID: uid });
    if (adminRecord) return 'Admin';
  }

  const adminEmails = parseEmailList(process.env.ADMIN_EMAILS);
  if (adminEmails.includes(normalizedEmail)) return 'Admin';

  const sellerEmails = parseEmailList(process.env.SELLER_EMAILS);
  if (sellerEmails.includes(normalizedEmail)) return 'Seller';

  return 'Buyer';
}
