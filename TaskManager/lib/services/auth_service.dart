import '../models/user.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _api = ApiClient();

  // Đăng nhập: gọi API, lưu token, trả về thông tin user
  Future<User> login(String email, String password) async {
    final response = await _api.post(
      '/auth/login',
      {'email': email, 'password': password},
      auth: false,
    );

    final data = response['data'] as Map<String, dynamic>;
    await _api.saveToken(data['token'].toString());
    return User.fromJson(data['user'] as Map<String, dynamic>);
  }

  // Đăng ký: chỉ tạo tài khoản (backend không cấp token ở bước này)
  Future<User> register(String fullName, String email, String password) async {
    final response = await _api.post(
      '/auth/register',
      {'fullName': fullName, 'email': email, 'password': password},
      auth: false,
    );

    final data = response['data'] as Map<String, dynamic>;
    return User.fromJson(data['user'] as Map<String, dynamic>);
  }

  // Dùng khi mở app: nếu còn token hợp lệ thì trả về user, ngược lại trả null
  Future<User?> getCurrentUser() async {
    final token = await _api.getToken();
    if (token == null) {
      return null;
    }

    try {
      final response = await _api.get('/auth/me');
      final data = response['data'] as Map<String, dynamic>;
      return User.fromJson(data['user'] as Map<String, dynamic>);
    } on ApiException catch (e) {
      // Token hết hạn hoặc bị từ chối: xóa token để đăng nhập lại
      if (e.statusCode == 401) {
        await _api.clearToken();
      }
      return null;
    }
  }

  // Đăng xuất: xóa token trên máy
  Future<void> logout() async {
    await _api.clearToken();
  }
}