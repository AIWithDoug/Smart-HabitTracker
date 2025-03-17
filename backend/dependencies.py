from fastapi import HTTPException, Header
from supabase_admin_client import supabase_admin

async def verify_token(authorization: str = Header(..., alias="Authorization")):
    try:

        scheme, token = authorization.split()

        if scheme.lower() != 'bearer':
            print("Invalid auth scheme")
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        # This is the critical line
        user = supabase_admin.auth.get_user(token)

        print(f"Supabase returned user: {user}")

        if not user or not user.user:
            print("No user found or user.user missing")
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        payload = {
            "sub": user.user.id,
            "email": user.user.email,
        }

        print(f"Payload extracted: {payload}")

        return payload

    except Exception as e:
        print(f"Token validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

