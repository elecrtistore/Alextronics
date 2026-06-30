export type UserRole = 'Buyer' | 'Seller' | 'Admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
}
