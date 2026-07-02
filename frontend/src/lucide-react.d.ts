declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';

  type LucideProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    [key: string]: any;
  };

  export const ArrowRight: FC<LucideProps>;
  export const Bolt: FC<LucideProps>;
  export const Shield: FC<LucideProps>;
  export const MessageCircle: FC<LucideProps>;
  export const ChevronRight: FC<LucideProps>;
  export const Star: FC<LucideProps>;
  export const Package: FC<LucideProps>;
  export const CheckCircle: FC<LucideProps>;
  export const Check: FC<LucideProps>;
  export const ClipboardList: FC<LucideProps>;
  export const ChevronDown: FC<LucideProps>;
  export const Send: FC<LucideProps>;
  export const Trash2: FC<LucideProps>;
  export const Plus: FC<LucideProps>;
  export const ChevronLeft: FC<LucideProps>;
  export const ShoppingCart: FC<LucideProps>;
  export const Phone: FC<LucideProps>;
  export const Truck: FC<LucideProps>;
  export const Clock: FC<LucideProps>;
  export const Mail: FC<LucideProps>;
  export const LogIn: FC<LucideProps>;
  export const Lock: FC<LucideProps>;
  export const Eye: FC<LucideProps>;
  export const EyeOff: FC<LucideProps>;
  export const Menu: FC<LucideProps>;
  export const X: FC<LucideProps>;
  export const MapPin: FC<LucideProps>;
  export const AlertTriangle: FC<LucideProps>;
  export const MoreHorizontal: FC<LucideProps>;
  export const Search: FC<LucideProps>;
  export const SlidersHorizontal: FC<LucideProps>;
  export const Minus: FC<LucideProps>;
  export const ShoppingBag: FC<LucideProps>;
  export const User: FC<LucideProps>;
  export const ArrowLeft: FC<LucideProps>;
  export const UserPlus: FC<LucideProps>;
}
