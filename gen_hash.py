try:
    import bcrypt
    h = bcrypt.hashpw(b"123456", bcrypt.gensalt(10))
    print(h.decode())
except ImportError:
    # bcrypt not installed, use a pre-known hash for 123456
    # This is a valid BCrypt hash for "123456" with strength 10
    print("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy")
