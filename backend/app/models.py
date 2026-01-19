from sqlalchemy import Column, ForeignKey, UUID, String
from sqlalchemy.orm import relationship
import uuid

from app.database import Base

APPLICATION_STATUS = ["Draft", "Applied", "Interviewing", "Offered", "Rejected"]


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)

    applications = relationship(
        "Application", back_populates="user", cascade="all, delete-orphan"
    )


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False)
    city = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Draft")

    user = relationship("User", back_populates="applications")
