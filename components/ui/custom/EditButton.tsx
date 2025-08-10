import { Button } from "../button";
import { Edit2 } from "lucide-react";

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export function EditButton({ onClick, className }: EditButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`cursor-pointer ${className || ""}`}
    >
      <Edit2 className="h-4 w-4" />
    </Button>
  );
}
