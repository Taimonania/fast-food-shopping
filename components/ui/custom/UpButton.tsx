import { ChevronUp } from "lucide-react";
import { Button } from "../button";

interface UpButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function UpButton({
  onClick,
  disabled = false,
  className,
}: UpButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer w-6 p-0 ${className || ""}`}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
}
