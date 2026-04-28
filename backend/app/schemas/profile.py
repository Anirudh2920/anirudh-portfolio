from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    full_name: str
    role: str
    location: str
    email: EmailStr
    phone: str | None
    github: str | None
    linkedin: str | None


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    full_name: str | None = Field(default=None, max_length=200)
    role: str | None = Field(default=None, max_length=200)
    location: str | None = Field(default=None, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=40)
    github: str | None = Field(default=None, max_length=120)
    linkedin: str | None = Field(default=None, max_length=120)


class AboutRead(BaseModel):
    raw: str


class AboutUpdate(BaseModel):
    raw: str = Field(min_length=1)


class PasswordUpdate(BaseModel):
    current_password: str = Field(min_length=1, max_length=72)
    new_password: str = Field(min_length=8, max_length=72)
