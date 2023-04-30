from playwright.sync_api import Page

from pages.base import Base


class NavBar(Base):
    def __init__(self, page: Page):
        self.page = page

    def open(self, base_url):
        self.page.goto(f"{base_url}")
