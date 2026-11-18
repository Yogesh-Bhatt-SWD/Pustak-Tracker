import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/branded_logo.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAuthentication();
    });
  }

  Future<void> _checkAuthentication() async {
    // Wait a moment for the nice animations to play
    await Future.delayed(const Duration(milliseconds: 1500));
    
    if (!mounted) return;
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (authProvider.isLoading) {
      authProvider.addListener(_onAuthChanged);
      return;
    }
    
    _navigateBasedOnAuth(authProvider);
  }

  void _onAuthChanged() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (!authProvider.isLoading && mounted) {
      authProvider.removeListener(_onAuthChanged);
      _navigateBasedOnAuth(authProvider);
    }
  }

  void _navigateBasedOnAuth(AuthProvider authProvider) {
    if (!mounted) return;
    
    if (authProvider.isAuthenticated) {
      context.go('/dashboard');
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    authProvider.removeListener(_onAuthChanged);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).colorScheme.primary.withOpacity(0.05),
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const BrandedLogo(size: 130)
                  .animate(onPlay: (controller) => controller.repeat(reverse: true))
                  .scaleXY(begin: 1.0, end: 1.05, duration: 1.seconds, curve: Curves.easeInOut)
                  .shimmer(duration: 2.seconds, color: Colors.white.withOpacity(0.2)),
              
              const SizedBox(height: 32),
              
              Text(
                AppConstants.appName,
                style: TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ).animate().fade(duration: 800.ms, curve: Curves.easeOut).slideY(begin: 0.2, end: 0),
              
              const SizedBox(height: 8),
              
              Text(
                AppConstants.appTagline,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                ),
              ).animate(delay: 200.ms).fade(duration: 800.ms, curve: Curves.easeOut).slideY(begin: 0.2, end: 0),
              
              const SizedBox(height: 60),
              
              // Custom Animated Loading Bar instead of CircularProgressIndicator
              Container(
                width: 100,
                height: 4,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(2),
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ).animate(onPlay: (controller) => controller.repeat())
                   .moveX(begin: -40, end: 100, duration: 1.seconds),
                ),
              ).animate(delay: 400.ms).fade(),
            ],
          ),
        ),
      ),
    );
  }
}
