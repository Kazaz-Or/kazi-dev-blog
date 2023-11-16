import pytest
from playwright.sync_api import sync_playwright


@pytest.fixture(scope="session")
def base_url():
    return "https:localhost:3000"


@pytest.fixture(scope="session")
def sync_playwright_context():
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="session")
def browser(sync_playwright_context):
    browser = sync_playwright_context.chromium.launch()
    yield browser
    browser.close()


@pytest.fixture
def sync_page(browser):
    context = browser.new_context()
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def additional_paths():
    return [
        ("https:localhost:3000", "homepage"),
        ("https:localhost:3000/about", "about page"),
        ("https:localhost:3000/blogs", "blogs page"),
        ("https:localhost:3000/blogs/python-type-checking", "blog page")
    ]
