export type AppUserRole = 'Admin' | 'Seller' | 'Buyer';

function parseEmailList(value?: string) {
  return (value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getRoleForEmail(email?: string): AppUserRole {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) return 'Buyer';

  const adminEmails = parseEmailList(process.env.ADMIN_EMAILS);
  if (adminEmails.includes(normalizedEmail)) return 'Admin';

  const sellerEmails = parseEmailList(process.env.SELLER_EMAILS);
  if (sellerEmails.includes(normalizedEmail)) return 'Seller';

  return 'Buyer';
}
