import { Id } from "@/convex/_generated/dataModel";
import { DisplayableItem } from "@/lib/adapters/item-adapter";
import { type UpdateItemFormData } from "@/lib/zod/item";
import { HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { AddButton } from "../../ui/custom/AddButton";
import { CheckButton } from "../../ui/custom/CheckButton";
import { DeleteButton } from "../../ui/custom/DeleteButton";
import { DownButton } from "../../ui/custom/DownButton";
import { EditButton } from "../../ui/custom/EditButton";
import { UpButton } from "../../ui/custom/UpButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

interface ItemCardProps {
  item: DisplayableItem;
  isEditing: boolean;
  editForm: UseFormReturn<UpdateItemFormData>;
  onKeyDown: (e: React.KeyboardEvent, id: Id<"items">) => void;
  onEdit: (item: DisplayableItem) => void;
  onSave: (id: Id<"items">) => void;
  onDelete: (id: Id<"items">) => void;
  orderNumber?: number;
  onMoveUp?: (id: Id<"items">) => void;
  onMoveDown?: (id: Id<"items">) => void;
  onAddToEnd?: (id: Id<"items">) => void;
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
}

export function ItemCard({
  item,
  isEditing,
  editForm,
  onKeyDown,
  onEdit,
  onSave,
  onDelete,
  orderNumber,
  onMoveUp,
  onMoveDown,
  onAddToEnd,
  isFirst = false,
  isLast = false,
  className,
}: ItemCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="gap-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            {orderNumber && onMoveUp && onMoveDown && (
              <div className="flex flex-row gap-1">
                <UpButton
                  onClick={() => onMoveUp(item._id)}
                  disabled={isFirst}
                />
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-sm font-medium">
                  {orderNumber}
                </div>
                <DownButton
                  onClick={() => onMoveDown(item._id)}
                  disabled={isLast}
                />
              </div>
            )}
            {!orderNumber && onAddToEnd && (
              <div className="flex flex-row gap-1">
                <AddButton
                  onClick={() => onAddToEnd(item._id)}
                  title="Add to shopping list"
                />
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-sm font-medium">
                  <HelpCircle className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing && (
              <Form {...editForm}>
                <div className="space-y-2">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Item name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-lg font-semibold"
                            onKeyDown={e => onKeyDown(e, item._id)}
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Description</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Description (optional)"
                            className="text-sm text-muted-foreground"
                            onKeyDown={e => onKeyDown(e, item._id)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}
            {!isEditing && (
              <>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </>
            )}
          </div>
        </div>
        <CardAction>
          {isEditing && <CheckButton onClick={() => onSave(item._id)} />}
          {!isEditing && (
            <div className="flex gap-1">
              <EditButton onClick={() => onEdit(item)} />
              <DeleteButton onClick={() => onDelete(item._id)} />
            </div>
          )}
        </CardAction>
      </CardHeader>
    </Card>
  );
}
