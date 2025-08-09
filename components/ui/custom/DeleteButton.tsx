import { Button } from "../button";
import { Trash } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
}

export function DeleteButton({ onClick, className }: DeleteButtonProps) {
  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={onClick}
      className={`cursor-pointer ${className || ""}`}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
}
