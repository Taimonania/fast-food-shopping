# Goal

This app's goal is to make shopping the supermarket easier. It empowers the user to set an order for all shopping items and then auto-sorts their shopping list to streamline the process of running through a store and picking up all items.

In the future, the app will be enhanced by features, such as:

- Recipes which can be easily added to a shopping list
- AI to create new personalized recipes

# Database Schema

## Shopping Items

A shopping item is a unique item that can be bought in a supermarket.

```json
{
  "_id": "Id<'shopping_items'>",
  "name": "string",
  "description": "string?"
}
```

## Supermarkets

Supermarkets define store layouts and item ordering for optimized shopping routes.

```json
{
  "_id": "Id<'supermarkets'>",
  "name": "string",
  "location": "string?"
}
```

## Item Orders

Defines the ordering/positioning of items within a specific supermarket.

```json
{
  "_id": "Id<'item_orders'>",
  "supermarketId": "Id<'supermarkets'>",
  "itemId": "Id<'shopping_items'>",
  "orderPosition": "number"
}
```

## Shopping Lists

User-created lists of items to purchase.

```json
{
  "_id": "Id<'shopping_lists'>",
  "userId": "Id<'users'>",
  "name": "string",
  "isCompleted": "boolean"
}
```

## Shopping List Items

Individual items within a shopping list with quantity and collection status. Quantity is a string to accomodate different measurements easily.

```json
{
  "_id": "Id<'shopping_list_items'>",
  "shoppingListId": "Id<'shopping_lists'>",
  "itemId": "Id<'shopping_items'>",
  "quantity": "string",
  "isCollected": "boolean",
  "notes": "string?"
}
```

# Notes on UI Design

For now there should be a simple page for the supermarket where the user can add new items and order them. No need to be able to have several supermarkets yet.

Then there should also be a page containing the current shopping list. The user should be able to add list items (if the items don't exist yet in the supermarket they will be added there as unordered) and edit their quanities. The user should be able to mark list items as collected. The user should be able to delete list items from the shopping list (not items from the supermarket). The shopping list is automatically sorted by the supermarket ordering.