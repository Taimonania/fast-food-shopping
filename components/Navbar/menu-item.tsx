import Link from "next/link";

interface MenuItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function MenuItem({
  href,
  children,
  className = "",
}: MenuItemProps) {
  return (
    <Link
      href={href}
      className={`flex justify-center items-center text-muted-foreground hover:text-foreground hover:bg-accent px-4 font-medium transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
