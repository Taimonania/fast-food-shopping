import { Plus } from "lucide-react";
import { Button } from "../button";

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export function AddButton({
  onClick,
  disabled = false,
  className,
  title,
}: AddButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`cursor-pointer w-6 p-0 ${className || ""}`}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
