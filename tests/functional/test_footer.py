import pytest
from datetime import datetime

from .pages import elements
from pages.footer import Footer


test_data = [
    ('https://www.kazis.dev/', "homepage"),
    ('https://www.kazis.dev/about', "about page"),
    ('https://www.kazis.dev/blogs', "blogs page"),
    ('https://www.kazis.dev/blogs/python-type-checking', "blog page")
]


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_copyrights_year_link_exists(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     year = home_page.get_year_cr_text(xpath=elements.FOOTER_CR_YEAR_XPATH)
#     assert year == datetime.now().date().year


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_about_me_link_navigation(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     link_url = home_page.click_link("link", xpath=elements.FOOTER_ABOUT_ME_LINK_XPATH)
#     assert "about" in link_url, "Link navigation failed."


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_blog_posts_link_exists(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     element_exists = home_page.check_element_exists(xpath=elements.FOOTER_BLOG_POSTS_LINK_XPATH)
#     assert element_exists, "Element not found."


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_blog_posts_link_navigation(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     link_url = home_page.click_link("link", xpath=elements.FOOTER_BLOG_POSTS_LINK_XPATH)
#     assert "blogs" in link_url, "Link navigation failed."


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_home_link_exists(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     element_exists = home_page.check_element_exists(xpath=elements.FOOTER_HOME_LINK_XPATH)
#     assert element_exists, "Element not found."


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_home_link_navigation(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     link_url = home_page.click_link("link", xpath=elements.FOOTER_HOME_LINK_XPATH)
#     assert link_url == "https://www.kazis.dev/", "Link navigation failed."


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_copyrights_link_exists(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     element_exists = home_page.check_element_exists(xpath=elements.FOOTER_CR_KAZI_XPATH)
#     assert element_exists, "Element not found."


# @pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
# def test_footer_copyrights_link_navigation(sync_page, test_url, test_id):
#     home_page = Footer(sync_page)
#     home_page.open(test_url)
#     link_url = home_page.click_link("link", xpath=elements.FOOTER_CR_KAZI_XPATH)
#     assert link_url == "https://www.kazis.dev/", "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_linkedin_link_navigation(sync_page, test_url, test_id):
    expected_url = "https://www.linkedin.com/in/kazaz-or/"
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_svg(xpath=elements.FOOTER_LINKEDIN_SVG_XPATH, expected_url=expected_url)
    assert link_url == expected_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_twitter_link_navigation(sync_page, test_url, test_id):
    expected_url = "https://twitter.com/OrKazaz"
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_svg(xpath=elements.FOOTER_TWITTER_SVG_XPATH, expected_url=expected_url)
    assert link_url == expected_url, "Link navigation failed."


@pytest.mark.parametrize("test_url, test_id", test_data, ids=[item[1] for item in test_data])
def test_footer_github_link_navigation(sync_page, test_url, test_id):
    expected_url = "https://github.com/Kazaz-Or"
    home_page = Footer(sync_page)
    home_page.open(test_url)
    link_url = home_page.click_svg(xpath=elements.FOOTER_GITHUB_SVG_XPATH, expected_url=expected_url)
    assert link_url == expected_url, "Link navigation failed."
