# Los modelos pa' la base de datos. Pensemos bien los campos antes de migrar.
# Aquí irán las clases de SQLAlchemy u ORM que elijas.

from pydantic import BaseModel


class LoginRequest(BaseModel):
	email: str
	password: str


class LoginResponse(BaseModel):
	access_token: str
	token_type: str
	user: dict
	message: str