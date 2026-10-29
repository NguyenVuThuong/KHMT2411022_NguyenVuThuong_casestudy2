import 'package:flutter/foundation.dart';

class AppConstants {
  // Địa chỉ gốc của API, tự chọn theo nền tảng đang chạy
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      // Android Emulator: 10.0.2.2 là "máy tính của bạn" nhìn từ máy ảo
      return 'http://10.0.2.2:3000/api';
    }
    // Windows desktop và các nền tảng còn lại
    return 'http://localhost:3000/api';
  }

  // Khóa dùng để lưu token trong SharedPreferences
  static const String tokenKey = 'auth_token';
}