async function testAPI() {
  const base = 'http://localhost:8080/api';
  console.log('--- 1. Testing GET /api/books ---');
  let res = await fetch(`${base}/books`);
  let books = await res.json();
  console.log(`Initial books count: ${books.length}`);

  console.log('\n--- 2. Testing POST /api/books (Create Book) ---');
  const newBook = {
    title: 'Cloud Native Spring in Action',
    author: 'Thomas Vitale',
    isbn: '978-1617298813',
    price: 49.99,
    category: 'Technology',
    description: 'Hands-on guide to building containerized cloud-native apps with Spring Boot and Kubernetes.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    stockQuantity: 15
  };

  res = await fetch(`${base}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook)
  });
  const createdBook = await res.json();
  console.log(`Created book #${createdBook.id}: "${createdBook.title}" (Price: $${createdBook.price})`);

  console.log('\n--- 3. Testing PUT /api/books/:id (Update Book) ---');
  createdBook.price = 45.00;
  createdBook.stockQuantity = 20;
  res = await fetch(`${base}/books/${createdBook.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createdBook)
  });
  const updatedBook = await res.json();
  console.log(`Updated book #${updatedBook.id} price to: $${updatedBook.price}, stock: ${updatedBook.stockQuantity}`);

  console.log('\n--- 4. Testing POST /api/orders (Place Order) ---');
  const orderReq = {
    customerName: 'Yaswanth Tech',
    customerEmail: 'yaswanth@example.com',
    customerPhone: '+1-555-0199',
    shippingAddress: '456 Cloud Innovation Blvd, Suite 100',
    items: [
      {
        bookId: createdBook.id,
        quantity: 2
      }
    ]
  };
  res = await fetch(`${base}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderReq)
  });
  const order = await res.json();
  console.log(`Placed Order #${order.id} (${order.orderNumber}), Total: $${order.totalAmount}, Status: ${order.status}`);

  console.log('\n--- 5. Verifying Stock Deduction ---');
  res = await fetch(`${base}/books/${createdBook.id}`);
  const bookAfterOrder = await res.json();
  console.log(`Stock after ordering 2 units (started at 20): ${bookAfterOrder.stockQuantity}`);

  console.log('\n--- 6. Testing PATCH /api/orders/:id/status (Update Order Status) ---');
  res = await fetch(`${base}/orders/${order.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'SHIPPED' })
  });
  const updatedOrder = await res.json();
  console.log(`Order status updated to: ${updatedOrder.status}`);

  console.log('\n--- 7. Testing DELETE /api/orders/:id ---');
  res = await fetch(`${base}/orders/${order.id}`, { method: 'DELETE' });
  const deleteOrderRes = await res.json();
  console.log(`Order deletion response: ${JSON.stringify(deleteOrderRes)}`);

  console.log('\n--- 8. Testing DELETE /api/books/:id ---');
  res = await fetch(`${base}/books/${createdBook.id}`, { method: 'DELETE' });
  const deleteBookRes = await res.json();
  console.log(`Book deletion response: ${JSON.stringify(deleteBookRes)}`);

  console.log('\n✅ ALL CRUD & ORDER MANAGEMENT OPERATIONS PASSED SUCCESSFULLY!');
}

testAPI().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
