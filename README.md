# Product Management System

A modern, responsive web application for managing products with a beautiful table-based UI and full CRUD functionality.

## Features

- 📊 **Beautiful Table Display**: Clean, modern table layout with product information
- 🔍 **Advanced Filtering**: Search by name, filter by company, sort by various criteria
- ➕ **Add Products**: Create new products with a user-friendly modal form
- ✏️ **Edit Products**: Update existing product information
- 🗑️ **Delete Products**: Remove products with confirmation
- 📄 **Pagination**: Navigate through large datasets efficiently
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Gradient backgrounds, smooth animations, and professional styling

## API Endpoints

- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Usage

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Open your browser** and go to `http://localhost:5000`

3. **Use the interface**:
   - View products in the table
   - Use search and filters to find specific products
   - Click "Add Product" to create new items
   - Use Edit/Delete buttons for existing products
   - Navigate pages with Previous/Next buttons

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI/UX**: Modern responsive design with Font Awesome icons

## Database Schema

```javascript
{
  name: String (required),
  price: Number (required),
  featured: Boolean (default: false),
  rating: Number (default: 4.9),
  company: String (enum: ["apple", "samsung", "dell", "mi"]),
  createdAt: Date (default: Date.now)
}
```

## Development

The application includes:
- Error handling and validation
- Loading states and user feedback
- Confirmation dialogs for destructive actions
- Debounced search for better performance
- CORS support for API access

## File Structure

```
rest-api/
├── public/
│   ├── index.html      # Main UI
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── controllers/
│   └── products.js     # API controllers
├── models/
│   └── product.js      # MongoDB schema
├── routes/
│   └── products.js     # API routes
├── db/
│   └── connect.js      # Database connection
├── app.js              # Main application
├── .env                # Environment variables
└── package.json        # Dependencies
```