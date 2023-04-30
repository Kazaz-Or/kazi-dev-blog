from playwright.sync_api import Page

from pages.base import Base


class HomePage(Base):
    def __init__(self, page: Page):
        self.page = page

    def open(self, base_url):
        self.page.goto(f"{base_url}")

    def get_main_header_text(self):
        main_header = self.page.query_selector("text=Welcome to")
        if main_header is None:
            return None
        return main_header.inner_text()

    def get_main_header_text2(self):
        main_header2 = self.page.query_selector("text=Kazi's Dev Blog")
        if main_header2 is None:
            return None
        text = main_header2.inner_text()
        cleaned_text = text.replace('\xa0', ' ').strip()
        return cleaned_text

    def get_newest_blogs_text(self):
        main_header = self.page.query_selector("text=Newest Blog Posts")
        if main_header is None:
            return None
        return main_header.inner_text()

    def get_child_div_count(self, xpath: str) -> int:
        parent_element = self.page.query_selector(f'xpath={xpath}')
        if parent_element is None:
            return 0
        child_divs = parent_element.query_selector_all("div.group")
        return len(child_divs)
