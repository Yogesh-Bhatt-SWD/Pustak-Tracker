import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/user_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/stat_card.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/branded_logo.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final RefreshController _refreshController = RefreshController(initialRefresh: false);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  Future<void> _loadData() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    await userProvider.loadBorrowedBooks();
    await userProvider.loadFines();
    await userProvider.loadDashboardStats();
  }

  void _onRefresh() async {
    await _loadData();
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final userProvider = Provider.of<UserProvider>(context);

    // Get first name for a cleaner greeting
    final userName = authProvider.user?.name ?? "User";
    final firstName = userName.split(' ').first;

    return WillPopScope(
      onWillPop: () async {
        final shouldExit = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Text('Exit App?'),
            content: const Text('Do you want to exit the app?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('Exit'),
              ),
            ],
          ),
        );
        return shouldExit ?? false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              const BrandedLogo(size: 32, showShadow: false),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back,',
                    style: TextStyle(
                      fontSize: 12,
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                  Text(
                    firstName,
                    style: const TextStyle(fontSize: 18),
                  ),
                ],
              ),
            ],
          ).animate().fade(duration: 500.ms).slideX(begin: -0.2, end: 0),
          actions: [
            IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () => context.go('/notifications'),
            ).animate().fade(duration: 500.ms).scale(begin: const Offset(0.8, 0.8)),
          ],
        ),
      body: SmartRefresher(
        controller: _refreshController,
        onRefresh: _onRefresh,
        header: const WaterDropHeader(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Quick Stats',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ).animate().fade(duration: 400.ms).slideY(begin: 0.2, end: 0),
              
              const SizedBox(height: 16),
              
              Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Borrowed',
                      value: userProvider.borrowedCount.toString(),
                      icon: Icons.library_books_rounded,
                      color: Theme.of(context).colorScheme.primary,
                      onTap: () => context.go('/my-books'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: StatCard(
                      title: 'Overdue',
                      value: userProvider.overdueCount.toString(),
                      icon: Icons.warning_rounded,
                      color: Theme.of(context).colorScheme.error,
                      onTap: () => context.go('/my-books?filter=overdue'),
                    ),
                  ),
                ],
              ).animate().fade(duration: 500.ms, delay: 100.ms).slideY(begin: 0.2, end: 0),
              
              const SizedBox(height: 12),
              
              StatCard(
                title: 'Pending Fines',
                value: '₹${userProvider.totalFines.toStringAsFixed(2)}',
                icon: Icons.account_balance_wallet_rounded,
                color: Theme.of(context).colorScheme.secondary,
              ).animate().fade(duration: 500.ms, delay: 200.ms).slideY(begin: 0.2, end: 0),
              
              const SizedBox(height: 32),
              
              Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ).animate().fade(duration: 400.ms, delay: 300.ms).slideY(begin: 0.2, end: 0),
              
              const SizedBox(height: 16),
              
              // Staggered grid animations
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.3, // Slightly taller for modern look
                children: [
                  _buildActionCard(
                    context,
                    'Search Books',
                    Icons.search_rounded,
                    Theme.of(context).colorScheme.primary,
                    () => context.go('/books'),
                  ),
                  _buildActionCard(
                    context,
                    'My Books',
                    Icons.bookmark_rounded,
                    Theme.of(context).colorScheme.secondary,
                    () => context.go('/my-books'),
                  ),
                  _buildActionCard(
                    context,
                    'Notifications',
                    Icons.notifications_active_rounded,
                    Theme.of(context).colorScheme.tertiary,
                    () => context.go('/notifications'),
                  ),
                  _buildActionCard(
                    context,
                    'Profile',
                    Icons.person_rounded,
                    Theme.of(context).colorScheme.outline,
                    () => context.go('/profile'),
                  ),
                ].animate(interval: 100.ms, delay: 400.ms)
                 .fade(duration: 400.ms)
                 .slideY(begin: 0.2, end: 0)
                 .scale(begin: const Offset(0.95, 0.95), curve: Curves.easeOutBack),
              ),
              
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 0)
          .animate()
          .fade(duration: 600.ms, delay: 600.ms)
          .slideY(begin: 1.0, end: 0, curve: Curves.easeOut),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      clipBehavior: Clip.antiAlias, // Ensures ink ripple stays inside rounded corners
      child: InkWell(
        onTap: onTap,
        splashColor: color.withOpacity(0.1),
        highlightColor: color.withOpacity(0.05),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.05),
                Colors.transparent,
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, size: 28, color: color),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
