class ApiConfig {
  // Backend API base URL - configure via environment or build variants
  // For development:
  //   - Android Emulator: Set to your dev machine IP (e.g., 192.168.1.x)
  //   - Physical Device: Set to your backend server
  // For production: Should be set to production server URL
  //
  // Use const to allow dart-define override during build:
  //   flutter build apk --dart-define=API_BASE_URL=https://api.example.com
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.example.com', // Change to your backend URL
  );
  
  // API Endpoints
  static const String login = '/api/user/login';
  static const String userProfile = '/api/user/profile';
  static const String borrowedBooks = '/api/user/borrowed-books';
  static const String fines = '/api/user/fines';
  static const String notifications = '/api/user/notifications';
  static const String dashboardStats = '/api/dashboard/stats';
  static const String availableBooks = '/api/books/available';
  static const String searchBooks = '/api/books/search';
  
  // Headers
  static Map<String, String> getHeaders(String? token) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
}

