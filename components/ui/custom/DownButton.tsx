import { ChevronDown } from "lucide-react";
import { Button } from "../button";

interface DownButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function DownButton({
  onClick,
  disabled = false,
  className,
}: DownButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer w-6 p-0 ${className || ""}`}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}
