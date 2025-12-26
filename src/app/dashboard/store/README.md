# Store Management System - Admin Panel

The Store Management system allows admins to manage products for the e-commerce store.

## Features

### 1. View All Products
- Display all products in a grid layout
- Search products by name
- Filter by category
- Sort and pagination capabilities

### 2. Add New Products
- Create physical or digital products
- Upload multiple product images
- Set product price and discounts
- Configure stock for physical products
- Set digital file URLs for digital products
- Mark products as featured
- Add product tags

### 3. Update Products
- Edit existing product details
- Update images
- Change pricing and stock
- Modify product status

### 4. Delete Products
- Permanently remove products
- Confirmation dialog before deletion

### 5. Toggle Product Status
- Activate/deactivate products
- Control product visibility

## File Structure

```
admin-pannel/
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── store/
│   │           └── page.tsx          # Main store management page
│   ├── components/
│   │   ├── cards/
│   │   │   └── ProductCard.tsx       # Product display card
│   │   ├── modals/
│   │   │   └── ProductModal.tsx      # Product form modal
│   │   └── skeletons/
│   │       └── ProductSkeleton.tsx   # Loading skeleton
│   └── store/
│       └── api/
│           └── store.ts             # Store API calls
```

## API Endpoints Used

### Create Product
```
POST /store/admin/products/create
```

### Get All Products
```
GET /store/products
```

### Update Product
```
PUT /store/admin/products/:productId
```

### Delete Product
```
DELETE /store/admin/products/:productId
```

### Toggle Product Status
```
PATCH /store/admin/products/:productId/toggle-status
```

## Color Theme
- **Primary Yellow**: `#FFD700`
- **Off Yellow**: `#FCF5CC`
- **Creamy Yellow**: `#FFE07B`
- **Black**: `#000000`
- **Prime Green**: `#04A82A`
- **Prime Red**: `#FF0008`

## Product Fields

### Basic Information
- **Product Name** (required)
- **Short Description** (optional)
- **Full Description** (required)
- **Category** (required)
- **Product Type** (required) - Physical or Digital

### Pricing
- **Price** (required)
- **Discount Price** (optional)

### Product Details
- **Stock** (for physical products)
- **Weight** (optional)
- **Dimensions** (optional)
- **Tags** (comma-separated)
- **Featured** (checkbox)

### Digital Products
- **Digital File URL** (required for digital products)
- **Download Link Expiry** (in days)

### Images
- Multiple image upload support (up to 10 images)
- Image preview with removal option

## Usage

1. Navigate to **Store** in the admin sidebar
2. View all products or search/filter as needed
3. **Add Product**: Click "Add Product" button to create a new product
4. **Edit Product**: Click the edit icon on any product card
5. **Delete Product**: Click the trash icon to delete a product
6. **Toggle Status**: Click the eye icon to activate/deactivate products

## Validation

- All required fields must be filled
- Digital products must have a file URL
- Product images must be valid image files
- Price must be a positive number

## Toast Notifications

The system provides real-time feedback through toast notifications for:
- Product creation success
- Product update success
- Product deletion success
- Error messages
