from pydantic import BaseModel


class UserRegister(BaseModel):
    username: str
    password: str


class ApplicationSchema(BaseModel):
    title: str
    company: str
    city: str


class UpdateStatusSchema(BaseModel):
    status: str
