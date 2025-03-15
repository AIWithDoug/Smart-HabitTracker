from fastapi import HTTPException, Header
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()



JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

async def verify_token(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return user_id

    except Exception as e:
        print(f"JWT validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
