package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;

    public DataInitializer(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            Book b1 = new Book(
                    "Clean Code: A Handbook of Agile Software Craftsmanship",
                    "Robert C. Martin",
                    "978-0132350884",
                    new BigDecimal("39.99"),
                    "Technology",
                    "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
                    "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
                    25
            );

            Book b2 = new Book(
                    "Designing Data-Intensive Applications",
                    "Martin Kleppmann",
                    "978-1449373320",
                    new BigDecimal("49.50"),
                    "Technology",
                    "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.",
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                    18
            );

            Book b3 = new Book(
                    "Atomic Habits",
                    "James Clear",
                    "978-0735211292",
                    new BigDecimal("21.99"),
                    "Self-Help",
                    "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies that teach you exactly how to form good habits and break bad ones.",
                    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
                    40
            );

            Book b4 = new Book(
                    "The Pragmatic Programmer",
                    "David Thomas & Andrew Hunt",
                    "978-0135957059",
                    new BigDecimal("44.95"),
                    "Technology",
                    "Your journey to mastery starts here. Written as a series of self-contained sections and filled with entertaining anecdotes and thoughtful examples.",
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                    12
            );

            Book b5 = new Book(
                    "Zero to One: Notes on Startups",
                    "Peter Thiel",
                    "978-0804139298",
                    new BigDecimal("18.50"),
                    "Business",
                    "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur Peter Thiel shows how we can find ways to create those new things.",
                    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
                    30
            );

            Book b6 = new Book(
                    "Sapiens: A Brief History of Humankind",
                    "Yuval Noah Harari",
                    "978-0062316097",
                    new BigDecimal("24.00"),
                    "History",
                    "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller that explores how biology and history have defined us.",
                    "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80",
                    15
            );

            bookRepository.saveAll(Arrays.asList(b1, b2, b3, b4, b5, b6));
            System.out.println("DataInitializer: Seeded 6 initial sample books into database.");
        }
    }
}
