package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<Book> getAllBooks(String query, String category) {
        if (query != null && !query.trim().isEmpty()) {
            return bookRepository.searchBooks(query.trim());
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            return bookRepository.findByCategoryIgnoreCase(category.trim());
        }
        return bookRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));
    }

    public Book createBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new IllegalArgumentException("A book with ISBN " + book.getIsbn() + " already exists.");
        }
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updatedBook) {
        Book existing = getBookById(id);

        if (!existing.getIsbn().equals(updatedBook.getIsbn()) && bookRepository.existsByIsbn(updatedBook.getIsbn())) {
            throw new IllegalArgumentException("A book with ISBN " + updatedBook.getIsbn() + " already exists.");
        }

        existing.setTitle(updatedBook.getTitle());
        existing.setAuthor(updatedBook.getAuthor());
        existing.setIsbn(updatedBook.getIsbn());
        existing.setPrice(updatedBook.getPrice());
        existing.setCategory(updatedBook.getCategory());
        existing.setDescription(updatedBook.getDescription());
        existing.setCoverImageUrl(updatedBook.getCoverImageUrl());
        existing.setStockQuantity(updatedBook.getStockQuantity());

        return bookRepository.save(existing);
    }

    public void deleteBook(Long id) {
        Book existing = getBookById(id);
        bookRepository.delete(existing);
    }
}
