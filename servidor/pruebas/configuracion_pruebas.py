import pytest
from fastapi.testclient import TestClient
from app.principal import aplicacion

@pytest.fixture
def cliente():
    return TestClient(aplicacion)
