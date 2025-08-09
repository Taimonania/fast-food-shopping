import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import MenuItem from "./MenuItem";
import { SUPERMARKET_PAGE_URL } from "@/lib/constants";

export default function Navbar() {
  return (
    <nav className="flex items-stretch justify-between border-b h-12">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-70 px-4 transition-opacity"
      >
        <ShoppingBasket className="text-primary" />
        <span className="text-xl font-semibold text-primary">
          Fast Food Shopping
        </span>
      </Link>

      <div className="flex items-stretch">
        <MenuItem href={SUPERMARKET_PAGE_URL}>Supermarkets</MenuItem>
      </div>
    </nav>
  );
}
