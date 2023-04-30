from playwright.sync_api import Page


class Base:
    def __init__(self, page: Page):
        self.page = page

    def open(self, base_url):
        self.page.goto(f"{base_url}")

    def click_link(self, role: str = None, name: str = None, xpath: str = None) -> str:
        if xpath:
            link = self.page.query_selector(f'xpath={xpath}')
        else:
            link = self.page.query_selector(f'role="{role}" >> text={name}')
        with self.page.expect_navigation():
            link.click()
        return self.page.url

    def check_element_exists(self, role: str = None, name: str = None, xpath: str = None) -> bool:
        if xpath:
            element = self.page.query_selector(f'xpath={xpath}')
        else:
            element = self.page.query_selector(f'role="{role}" >> text={name}')
        return element is not None
