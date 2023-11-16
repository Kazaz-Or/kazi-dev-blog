import pytest
from datetime import datetime

from functional.pages import elements
from functional.pages.footer import Footer


test_data = [
    ('https:localhost:3000/', "homepage"),
    ('https:localhost:3000/about', "about page"),
    ('https:localhost:3000/blogs', "blogs page"),
    ('https:localhost:3000/blogs/python-type-checking', "blog page")
]


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_copyrights_year_link_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    year = home_page.get_year_cr_text(xpath=elements.FOOTER_CR_YEAR_XPATH)
    assert year == datetime.now().date().year


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_about_me_link_navigation(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", xpath=elements.FOOTER_ABOUT_ME_LINK_XPATH)
    assert "about" in link_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_blog_posts_link_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_BLOG_POSTS_LINK_XPATH)
    assert element_exists, "Element not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_blog_posts_link_navigation(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", xpath=elements.FOOTER_BLOG_POSTS_LINK_XPATH)
    assert "blogs" in link_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_home_link_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_HOME_LINK_XPATH)
    assert element_exists, "Element not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_home_link_navigation(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", xpath=elements.FOOTER_HOME_LINK_XPATH)
    assert link_url == "https://www.kazis.dev/", "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_copyrights_link_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_CR_KAZI_XPATH)
    assert element_exists, "Element not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_copyrights_link_navigation(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_link("link", xpath=elements.FOOTER_CR_KAZI_XPATH)
    assert link_url == "https://www.kazis.dev/", "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_linkedin_svg_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_LINKEDIN_SVG_XPATH)
    assert element_exists, "Element not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_twitter_svg_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_TWITTER_SVG_XPATH)
    assert element_exists, "Element not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_github_svg_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_GITHUB_SVG_XPATH)
    assert element_exists, "Element not found."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_israel_flag_svg_exists(sync_page, test_url, test_id):
    home_page = Footer(sync_page)
    home_page.open(test_url)
    element_exists = home_page.check_element_exists(xpath=elements.FOOTER_ISRAEL_FLAG_SVG_XPATH)
    assert element_exists, "Element not found."
