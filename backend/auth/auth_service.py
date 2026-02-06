import bcrypt
from flask_jwt_extended import create_access_token
from database.models import db, User

class AuthService:
    
    @staticmethod
    def hash_password(password):
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def verify_password(password, password_hash):
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    @staticmethod
    def register_user(email, password, role='student'):
        """Register a new user"""
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None, "Email already registered"
        
        # Create new user
        password_hash = AuthService.hash_password(password)
        user = User(email=email, password_hash=password_hash, role=role)
        db.session.add(user)
        db.session.commit()
        
        return user, None
    
    @staticmethod
    def login_user(email, password):
        """Login a user and return JWT token"""
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return None, "Invalid email or password"
        
        if not AuthService.verify_password(password, user.password_hash):
            return None, "Invalid email or password"
        
        # Create JWT token
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role, 'email': user.email}
        )
        
        return {
            'access_token': access_token,
            'user': user.to_dict()
        }, None
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        user = User.query.get(user_id)
        return user.to_dict() if user else None
