import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import MenuItem from "./menu-item";

export default function Navbar() {
  return (
    <nav className="flex items-stretch justify-between px-4 border-b h-12">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        <ShoppingBasket className="text-primary" />
        <span className="text-xl font-semibold text-primary">
          Fast Food Shopping
        </span>
      </Link>

      <div className="flex items-stretch">
        <MenuItem href="/supermarkets">Supermarkets</MenuItem>
      </div>
    </nav>
  );
}
