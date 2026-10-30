class User {
  final String id;
  final String fullName;
  final String email;
  final String avatarUrl;

  const User({
    required this.id,
    required this.fullName,
    required this.email,
    required this.avatarUrl,
  });

  // Tạo User từ JSON mà API trả về
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: (json['id'] ?? '').toString(),
      fullName: (json['fullName'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      avatarUrl: (json['avatarUrl'] ?? '').toString(),
    );
  }
}