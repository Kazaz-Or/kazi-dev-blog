from playwright.sync_api import Page

from functional.pages.base import Base


class NavBar(Base):
    def __init__(self, page: Page):
        self.page = page

    def open(self, base_url):
        self.page.goto(f"{base_url}")
        self.page.wait_for_load_state("networkidle")
