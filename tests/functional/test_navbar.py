import pytest

from functional.pages import elements
from functional.pages.navbar import NavBar

test_data = [
    ('https://www.kazis.dev/', "homepage"),
    ('https://www.kazis.dev/about', "about page"),
    ('https://www.kazis.dev/blogs', "blogs page"),
    ('https://www.kazis.dev/blogs/python-type-checking', "blog page")
]


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_logo_element_exists(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Kazis Dev Blog Kazi\'s Dev Blog')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_about_me_element_exists(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=About Me')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_about_me_link_navigation(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link(role="link", name="About Me")
    assert "about" in link_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_blog_posts_element_exists(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Blog Posts')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_blog_posts_link_navigation(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link(role="link", name="Blogs")
    assert "blogs" in link_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_home_element_exists(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Home')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_home_link_navigation(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", name="Home")
    assert link_url == "https://www.kazis.dev/", "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_search_exists(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    link = sync_page.locator('role=link >> text=Search')
    assert link, "Link not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_search_functionality_mouse(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    sync_page.locator("[placeholder=\"Search\"]").click()
    sync_page.locator("[placeholder=\"Search\"]").fill("python")
    with sync_page.expect_navigation():
        sync_page.locator("[aria-label=\"Global\"] >> text=Crafting Meaningful Custom Exceptions in Python: Best Practices and Common Techn").click()
    link = sync_page.url
    assert link == "https://www.kazis.dev/blogs/python-custom-exceptions"


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_search_functionality_keyboard(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    sync_page.locator("[placeholder=\"Search\"]").click()
    sync_page.locator("[placeholder=\"Search\"]").fill("python")
    with sync_page.expect_navigation():
        sync_page.locator("[aria-label=\"Global\"] >> text=Crafting Meaningful Custom Exceptions in Python: Best Practices and Common Techn")
        sync_page.keyboard.down("ArrowDown")
        sync_page.keyboard.press("Enter")
    link = sync_page.url
    assert link == "https://www.kazis.dev/blogs/python-custom-exceptions"


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_search_functionality_esc(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    sync_page.locator("[placeholder=\"Search\"]").click()
    sync_page.locator("[placeholder=\"Search\"]").fill("python")
    sync_page.keyboard.press("Escape")
    assert sync_page.locator(elements.NAVBAR_SEARCH_BOX_RESULTS_XPATH).is_hidden(), "Search results not hidden."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_search_functionality_click_somewhere_else(sync_page, test_url, test_id):
    home_page = NavBar(sync_page)
    home_page.open(test_url)
    sync_page.locator("[placeholder=\"Search\"]").click()
    sync_page.locator("[placeholder=\"Search\"]").fill("python")
    sync_page.locator(elements.FOOTER_CR_YEAR_XPATH).click()
    assert sync_page.locator(elements.NAVBAR_SEARCH_BOX_RESULTS_XPATH).is_hidden(), "Search results not hidden."
