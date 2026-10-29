import 'package:flutter/material.dart';

import '../../models/user.dart';
import '../../services/auth_service.dart';
import '../auth/login_screen.dart';

// TẠM THỜI: sẽ viết lại thành danh sách công việc ở Giai đoạn 4
class TaskListScreen extends StatelessWidget {
  final User user;

  const TaskListScreen({super.key, required this.user});

  Future<void> _handleLogout(BuildContext context) async {
    await AuthService().logout();
    if (!context.mounted) return;
    // Về màn hình đăng nhập và xóa hết các màn hình trước đó
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Công việc'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Đăng xuất',
            onPressed: () => _handleLogout(context),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Xin chào, ${user.fullName}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(user.email),
          ],
        ),
      ),
    );
  }
}