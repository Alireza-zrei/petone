from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "ada@petone.com",
                "password": "a-strong-password",
                "full_name": "Ada Lovelace",
                "phone": "9124301159",
            }
        }
    )

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=8, max_length=20)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    phone: str
    full_name: str
    is_active: bool
    is_admin: bool
    created_at: datetime


class LoginRequest(BaseModel):
    # `identifier` accepts either an email address or an Iranian mobile number.
    # We don't pin it to EmailStr so phones validate too; the service layer
    # routes the lookup based on whether the value contains '@'.
    identifier: str = Field(min_length=3, max_length=320)
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class OtpRequest(BaseModel):
    mobile: str = Field(min_length=8, max_length=20)


class OtpLoginVerify(BaseModel):
    mobile: str = Field(min_length=8, max_length=20)
    code: str = Field(min_length=4, max_length=8)


class PasswordResetVerify(BaseModel):
    mobile: str = Field(min_length=8, max_length=20)
    code: str = Field(min_length=4, max_length=8)
    new_password: str = Field(min_length=8, max_length=72)


class PhoneSignupVerify(BaseModel):
    mobile: str = Field(min_length=8, max_length=20)
    code: str = Field(min_length=4, max_length=8)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str = Field(min_length=1, max_length=255)
