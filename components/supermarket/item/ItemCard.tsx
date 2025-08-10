import { Doc, Id } from "@/convex/_generated/dataModel";
import { SuperOrderItem } from "@/convex/functions/super_order";
import { type UpdateItemFormData } from "@/lib/zod/item";
import { UseFormReturn } from "react-hook-form";
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

// Union type that works for both regular items and ordered items
type ItemLike = Doc<"items"> | SuperOrderItem;

interface ItemCardProps {
  item: ItemLike;
  isEditing: boolean;
  editForm: UseFormReturn<UpdateItemFormData>;
  onKeyDown: (e: React.KeyboardEvent, id: Id<"items">) => void;
  onEdit: (item: ItemLike) => void;
  onSave: (id: Id<"items">) => void;
  onDelete: (id: Id<"items">) => void;
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
  className,
  dragHandle,
}: ItemCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start">
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
