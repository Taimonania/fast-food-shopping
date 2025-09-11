import { Id } from "@/convex/_generated/dataModel";
import { DisplayableItem } from "@/lib/adapters/item-adapter";
import { type UpdateItemFormData } from "@/lib/zod/item";
import { ChevronDown, ChevronUp, HelpCircle, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { CheckButton } from "../../ui/custom/CheckButton";
import { DeleteButton } from "../../ui/custom/DeleteButton";
import { EditButton } from "../../ui/custom/EditButton";
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
  isFirst?: boolean; // Whether this is the first item in the ordered list
  isLast?: boolean; // Whether this is the last item in the ordered list
  className?: string;
  dragHandle?: React.ReactNode;
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
  dragHandle,
}: ItemCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="gap-0">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            {orderNumber && onMoveUp && onMoveDown ? (
              // Ordered items: show move buttons with order number in center
              <div className="flex flex-row gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveUp(item._id)}
                  disabled={isFirst}
                  className="cursor-pointer w-6 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-sm font-medium">
                  {orderNumber}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveDown(item._id)}
                  disabled={isLast}
                  className="cursor-pointer w-6 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Unordered items: show question mark with add button
              <div className="flex flex-row gap-1">
                {onAddToEnd && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAddToEnd(item._id)}
                    className="cursor-pointer w-6 p-0"
                    title="Add to shopping list"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-sm font-medium">
                  <HelpCircle className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {dragHandle}
          <div className="flex-1 min-w-0">
            {isEditing ? (
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
            ) : (
              <>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </>
            )}
          </div>
        </div>
        <CardAction>
          {isEditing ? (
            <CheckButton onClick={() => onSave(item._id)} />
          ) : (
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
