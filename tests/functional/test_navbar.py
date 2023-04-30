import pytest

from pages.navbar import NavBar
from .pages import elements


test_data = [
    ('https://www.kazis.dev/', "homepage"),
    ('https://www.kazis.dev/about', "about page"),
    ('https://www.kazis.dev/blogs', "blogs page"),
    ('https://www.kazis.dev/blogs/python-type-checking', "blog page")
]


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_logo_element_exists(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Kazis Dev Blog Kazi\'s Dev Blog')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_logo_link_navigation(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link(role="link", xpath=elements.NAVBAR_LOGO_LINK_XPATH)
    assert link_url == "https://www.kazis.dev/", "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_about_me_element_exists(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=About Me')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_about_me_link_navigation(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", "About Me", xpath=elements.NAVBAR_ABOUT_ME_LINK_XPATH)
    assert "about" in link_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_blog_posts_element_exists(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Blog Posts')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_blog_posts_link_navigation(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", "About Me", xpath=elements.NAVBAR_BLOG_POSTS_LINK_XPATH)
    assert "blogs" in link_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_home_element_exists(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Home')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_home_link_navigation(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", "Home", xpath=elements.NAVBAR_HOME_LINK_XPATH)
    assert link_url == "https://www.kazis.dev/", "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_search_exists(sync_page, test_url):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Search')
    assert link, "Link not found."
