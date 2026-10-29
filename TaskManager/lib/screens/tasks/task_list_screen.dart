import 'package:flutter/material.dart';

import '../../models/user.dart';
import '../profile/profile_screen.dart';

// TẠM THỜI: sẽ viết lại thành danh sách công việc ở Giai đoạn 4
class TaskListScreen extends StatefulWidget {
  final User user;

  const TaskListScreen({super.key, required this.user});

  @override
  State<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  late User _user;

  @override
  void initState() {
    super.initState();
    _user = widget.user;
  }

  void _openProfile() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => ProfileScreen(
          user: _user,
          // Khi hồ sơ được sửa, cập nhật lại lời chào ở màn hình này
          onUserUpdated: (updated) => setState(() => _user = updated),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Công việc'),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle),
            tooltip: 'Cá nhân',
            onPressed: _openProfile,
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Xin chào, ${_user.fullName}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(_user.email),
          ],
        ),
      ),
    );
  }
}