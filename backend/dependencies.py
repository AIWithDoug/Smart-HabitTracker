from fastapi import HTTPException, Header, Depends
from supabase_admin_client import supabase_admin  # 👈 make sure you import this

async def verify_token(authorization: str = Header(...)):
    try:
        # Get the token from the header
        scheme, token = authorization.split()

        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        # Use Supabase Admin API to validate the token and get user
        user_response = supabase_admin.auth.get_user(jwt=token)

        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user_id = user_response.user.id

        return user_id

    except Exception as e:
        print(f"Token validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
