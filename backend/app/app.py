from fastapi import FastAPI, HTTPException, status, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from dotenv import load_dotenv
import os

from app import database, models, schemas, auth

app = FastAPI(title="Career Tracker API", version="1.0.0")

models.Base.metadata.create_all(bind=database.engine)

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")
if not FRONTEND_URL:
    raise ValueError("FRONTEND_URL environment variable is not set")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: schemas.UserRegister, db: Session = Depends(database.get_db)
):
    existing_user = (
        db.query(models.User).filter(models.User.username == user_data.username).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    user = models.User(
        username=user_data.username,
        hashed_password=auth.hash_password(user_data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": f"{user.username} registered successfully!"}


@app.post("/login")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    response = Response(content="Logged in")
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=auth.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return response


@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out"}


@app.get("/me")
async def read_current_user(user: models.User = Depends(auth.get_user_from_cookie)):
    return user


@app.get("/application/get")
async def read_applications(
    current_user: models.User = Depends(auth.get_user_from_cookie),
    db: Session = Depends(database.get_db),
):
    applications = (
        db.query(models.Application)
        .filter(models.Application.user_id == current_user.id)
        .all()
    )
    return applications


@app.post("/application/create", status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: schemas.ApplicationSchema,
    current_user: models.User = Depends(auth.get_user_from_cookie),
    db: Session = Depends(database.get_db),
):
    application = models.Application(
        user_id=current_user.id,
        title=application_data.title,
        company=application_data.company,
        city=application_data.city,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@app.delete(
    "/application/delete/{application_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_application(
    application_id: str,
    current_user: models.User = Depends(auth.get_user_from_cookie),
    db: Session = Depends(database.get_db),
):
    application = (
        db.query(models.Application)
        .filter(models.Application.id == application_id)
        .filter(models.Application.user_id == current_user.id)
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )
    db.delete(application)
    db.commit()


@app.put("/application/update/{application_id}")
async def update_application(
    application_id: str,
    update_data: schemas.UpdateStatusSchema,
    current_user: models.User = Depends(auth.get_user_from_cookie),
    db: Session = Depends(database.get_db),
):
    application = (
        db.query(models.Application)
        .filter(models.Application.id == application_id)
        .filter(models.Application.user_id == current_user.id)
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )
    application.status = update_data.status  # type: ignore
    db.commit()
    db.refresh(application)
    return application
