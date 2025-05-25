This is a full description of the app I want to build, the technologies used within it and all features

# Fast Food Shopping - App

## Tech

- Typescript with strict type-safety enabled
- ESLint with strict rules following TypeScript best practices
- NextJS for the web app part
- Convex for the database part
- shadcn with tailwind for UI library & styling
- There is already a codebase with a template using these libraries

## Overview

This app will enable a user to track their shopping list in a unique way. The core feature is that it sorts the shopping list by where the item is located in their supermarket. If the item is at the entrance it comes first, if it is later in the walk through the supermarket it comes later. The user creates the ordering of items for each supermarket manually by having a list of all unique items that were added before and then rearranging it. The user can have different orderings for different supermarkets.

A base item only has a description. This is used for creating the order per supermarket. An item in the shopping list also has an amount added to it.

The user has to register and login before being able to use the app.

For v1 the user has two views:
1. Their shopping list. Here they see a list of all their items and also can add, update, delete and mark items as done (i.e. bought). Each item here has a description and an amount.
2. Their supermarket ordering. Here they can create or select an existing supermarket and then see the ordering for all existing items within this supermarket. They can then reorder the items or add previously unordered items to the supermarkets ordering.

## Database & Backend

The app uses Convex for managing the database. We use best practices from their docs and will implement every backend logic that is feasible through Convex. Only when it is not feasible or a good idea we will use other options from NextJS.

Convex will also be used for the user management, registration, login etc.

## Design

The app will have a clean, modern design. It will use shadcn as the UI library and tailwind for styling. The styling should be done in the best practice way for tailwind with shadcn to make sure it is easy to switch theme.

## User Stories

This is a non-exhaustive list. Some stories might be missing but be clear from the description above.
- As a user I want to login so that I can see my personal shopping list.
- As a user I want to register with email and password so I can get my personal shopping list.
- As a user I want to see my shopping list so that I can view it while being in the supermarket.
- As a user I want to add, edit and delete items with amounts to my shopping list.
- As a user I want to create a supermarket ordering so that I can order my items for it.
- As a user I want to sort my items in the supermarket ordering so that my shopping list gets automatically sorted by it.
