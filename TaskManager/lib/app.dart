import 'package:flutter/material.dart';

import 'models/user.dart';
import 'screens/auth/login_screen.dart';
import 'screens/tasks/task_list_screen.dart';
import 'services/auth_service.dart';

class TaskManagerApp extends StatelessWidget {
  const TaskManagerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Task Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
      ),
      home: const AuthGate(),
    );
  }
}

// Kiểm tra trạng thái đăng nhập khi mở app
class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  late final Future<User?> _userFuture;

  @override
  void initState() {
    super.initState();
    // Chỉ gọi một lần khi màn hình được tạo
    _userFuture = AuthService().getCurrentUser();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<User?>(
      future: _userFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final user = snapshot.data;
        if (user != null) {
          return TaskListScreen(user: user);
        }
        return const LoginScreen();
      },
    );
  }
}