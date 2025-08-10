import { Check } from "lucide-react";
import { Button } from "../button";

interface CheckButtonProps {
  onClick: () => void;
  className?: string;
}

export function CheckButton({ onClick, className }: CheckButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`cursor-pointer ${className || ""}`}
    >
      <Check className="h-4 w-4" />
    </Button>
  );
}
