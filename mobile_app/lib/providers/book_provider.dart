import 'package:flutter/foundation.dart';
import '../data/models/book.dart';
import '../data/repositories/book_repository.dart';

class BookProvider with ChangeNotifier {
  final BookRepository _bookRepository = BookRepository();

  List<Book> _books = [];
  List<Book> _filteredBooks = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';

  List<Book> get books => _filteredBooks;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadBooks() async {
    _isLoading = true;
    _error = null;
    _searchQuery = '';
    _selectedCategory = 'All';
    notifyListeners();

    try {
      _books = await _bookRepository.getAvailableBooks();
      _filteredBooks = List.from(_books);
      _error = null;
    } catch (e) {
      _error = e.toString();
      _books = [];
      _filteredBooks = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  String _selectedCategory = 'All';

  Future<void> searchBooks(String query) async {
    _searchQuery = query;
    _applyFilters();
  }

  void filterByCategory(String? category) {
    _selectedCategory = category ?? 'All';
    _applyFilters();
  }

  void _applyFilters() {
    // 1. Start with all books
    List<Book> result = List.from(_books);

    // 2. Apply Category Filter
    if (_selectedCategory != 'All') {
      result = result.where((book) => book.category == _selectedCategory).toList();
    }

    // 3. Apply Search Query
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      result = result.where((book) {
        return book.title.toLowerCase().contains(query) ||
               book.author.toLowerCase().contains(query) ||
               book.category.toLowerCase().contains(query);
      }).toList();
    }

    _filteredBooks = result;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}

