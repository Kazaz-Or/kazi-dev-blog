from playwright.sync_api import Page

from pages.base import Base


class Footer(Base):
    def __init__(self, page: Page):
        self.page = page

    def open(self, base_url):
        self.page.goto(f"{base_url}")

    def get_year_cr_text(self, xpath: str) -> str:
        element = self.page.query_selector(f'xpath={xpath}')
        if element is None:
            return None
        element_text = element.inner_text()
        parts = element_text.split()
        year = int([part for part in parts if part.isdigit()][0])
        return year

    def click_svg(self, xpath: str, expected_url: str):
        svg_element = self.page.query_selector(f'xpath={xpath}')
        with self.page.expect_navigation():
            svg_element.click()
        self.page.wait_for_url(expected_url)
        return self.page.url
