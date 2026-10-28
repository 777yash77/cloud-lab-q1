package com.bookstore.service;

import com.bookstore.dto.OrderItemRequest;
import com.bookstore.dto.OrderRequest;
import com.bookstore.model.Book;
import com.bookstore.model.CustomerOrder;
import com.bookstore.model.OrderItem;
import com.bookstore.model.OrderStatus;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, BookRepository bookRepository) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerOrder> getAllOrders() {
        return orderRepository.findAllWithItems();
    }

    @Transactional(readOnly = true)
    public CustomerOrder getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    public CustomerOrder createOrder(OrderRequest request) {
        CustomerOrder order = new CustomerOrder();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Book book = bookRepository.findById(itemReq.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book with ID " + itemReq.getBookId() + " not found"));

            if (book.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for book: " + book.getTitle()
                        + ". Available: " + book.getStockQuantity() + ", Requested: " + itemReq.getQuantity());
            }

            // Deduct inventory
            book.setStockQuantity(book.getStockQuantity() - itemReq.getQuantity());
            bookRepository.save(book);

            OrderItem orderItem = new OrderItem(book.getId(), book.getTitle(), itemReq.getQuantity(), book.getPrice());
            order.addItem(orderItem);

            total = total.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public CustomerOrder updateOrderStatus(Long orderId, OrderStatus newStatus) {
        CustomerOrder order = getOrderById(orderId);

        // If transitioning to CANCELLED and wasn't already CANCELLED, restore book stock
        if (newStatus == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                bookRepository.findById(item.getBookId()).ifPresent(book -> {
                    book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
                    bookRepository.save(book);
                });
            }
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        CustomerOrder order = getOrderById(orderId);
        // If deleting a non-cancelled order, restore stock
        if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.DELIVERED) {
            for (OrderItem item : order.getItems()) {
                bookRepository.findById(item.getBookId()).ifPresent(book -> {
                    book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
                    bookRepository.save(book);
                });
            }
        }
        orderRepository.delete(order);
    }
}
