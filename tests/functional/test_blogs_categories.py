import pytest
from functional.pages import elements
from functional.pages.blogs_categories import BlogCategories


def test_tags_page_header(sync_page, base_url):
    tags_page = BlogCategories(sync_page)
    tags_page.open(base_url)
    header = tags_page.get_main_text()

    assert header is not None


def test_tag_page_navigation(sync_page, base_url):
    tags_page = BlogCategories(sync_page)
    tags_page.open(base_url)
    url = tags_page.navigate_to_python_tag(xpath=elements.BLOGS_CATEGORIES_PYTHON_TAG)

    assert "tags/python" in url.lower()


def test_first_article_in_tag_page_has_correct_tag(sync_page, base_url):
    tags_page = BlogCategories(sync_page)
    tags_page.open(base_url)
    tags_page.navigate_to_python_tag(xpath=elements.BLOGS_CATEGORIES_PYTHON_TAG)
    has_correct_tag = tags_page.navigate_to_first_article_in_python_tag(xpath=elements.BLOGS_CATEGORIES_FIRST_ARTICLE_XPATH)

    assert has_correct_tag is True
