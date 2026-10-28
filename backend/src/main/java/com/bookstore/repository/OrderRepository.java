package com.bookstore.repository;

import com.bookstore.model.CustomerOrder;
import com.bookstore.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    @Query("SELECT DISTINCT o FROM CustomerOrder o LEFT JOIN FETCH o.items ORDER BY o.createdAt DESC")
    List<CustomerOrder> findAllWithItems();

    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    List<CustomerOrder> findByStatus(OrderStatus status);

    List<CustomerOrder> findByCustomerEmailIgnoreCase(String customerEmail);

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);
}
