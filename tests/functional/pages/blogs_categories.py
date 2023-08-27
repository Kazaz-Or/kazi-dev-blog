from playwright.sync_api import Page

from functional.pages.base import Base
from functional.pages import elements


class BlogCategories(Base):
    def __init__(self, page: Page):
        self.page = page

    def open(self, base_url):
        self.page.goto(f"{base_url}")
        self.page.query_selector(f"xpath={elements.HOMEPAGE_BLOG_POSTS_CATEGORIES_BUTTON_XPATH}").click()

    def get_main_text(self):
        main_header = self.page.query_selector("text=All Tag Categories of Blog Posts")
        if main_header is None:
            return None
        return main_header.inner_text()

    def get_all_tags(self):
        tag_elements = self.page.query_selector_all('a.border.border-gray-200.rounded-lg')
        return [{'name': tag.inner_text().split("\n")[0], 'href': tag.get_attribute('href')} for tag in tag_elements]

    def navigate_to_python_tag(self, xpath: str) -> None:
        parent_element = self.page.query_selector(f'xpath={xpath}')
        parent_element.click()
        assert self.page.query_selector("text=All Blog Posts in the Python Category") is not None
        return self.page.url

    def navigate_to_first_article_in_python_tag(self, xpath: str) -> bool:
        first_article = self.page.query_selector(f'xpath={xpath}')
        first_article.click()
        if self.page.wait_for_selector('a[href="/tags/Python"]').is_visible():
            return True
        else:
            return False
