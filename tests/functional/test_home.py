from functional.pages import elements
from functional.pages.home_page import HomePage


def test_page_title(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    page_title = sync_page.title()
    assert page_title == "// Kazi's Dev Blog", "Page title doesn't match expected value."


def test_main_header_text(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    main_header_text = home_page.get_main_header_text()
    assert main_header_text == "Welcome to"

    main_header_text2 = home_page.get_main_header_text2()
    assert main_header_text2 == "Kazi's Dev Blog"


def test_main_picture_exists(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    element_exists = home_page.check_element_exists(xpath=elements.HOMEPAGE_MAIN_PIC_XPATH)
    assert element_exists, "Element not found."


def test_all_blog_posts_button_exists(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    element_exists = home_page.check_element_exists(xpath=elements.HOMEPAGE_ALL_BLOG_POSTS_BUTTON_XPATH)
    assert element_exists, "Element not found."


def test_all_blog_posts_link_navigation(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    link_url = home_page.click_link("link", xpath=elements.HOMEPAGE_ALL_BLOG_POSTS_BUTTON_XPATH)
    assert link_url == f"{base_url}blogs", "Link navigation failed."


def test_blog_posts_categories_button_exists(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    element_exists = home_page.check_element_exists(xpath=elements.HOMEPAGE_BLOG_POSTS_CATEGORIES_BUTTON_XPATH)
    assert element_exists, "Element not found."


def test_blog_posts_categories_link_navigation(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    link_url = home_page.click_link("link", xpath=elements.HOMEPAGE_BLOG_POSTS_CATEGORIES_BUTTON_XPATH)
    assert link_url == f"{base_url}tags", "Link navigation failed."


def test_newest_blog_posts_text(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    main_header_text = home_page.get_newest_blogs_text()
    assert main_header_text == "Newest Blog Posts(See All)"


def test_see_all_link_navigation(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    link_url = home_page.click_link("link", xpath=elements.HOMEPAGE_SEE_ALL_LINK_XPATH)
    assert link_url == f"{base_url}blogs", "Link navigation failed."


def test_maximum_number_of_blogs_in_homepage(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    child_div_count = home_page.get_child_div_count(elements.HOMEPAGE_BLOGS_DIV_ELE_XPATH)
    assert child_div_count <= 8, f"Expected the number of child divs to be less than or equal to 8, but found {child_div_count}."


def test_explore_discover_more_blogs(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    element_exists = home_page.check_element_exists(xpath=elements.HOMEPAGE_EXPLORE_MORE_BLOGS_XPATH)
    assert element_exists, "Element not found."

    element_exists = home_page.check_element_exists(xpath=elements.HOMEPAGE_DISCOVER_ARTICLES_BUTTON_XPATH)
    assert element_exists, "Element not found."


def test_discover_all_articles_link_navigation(sync_page, base_url):
    home_page = HomePage(sync_page)
    home_page.open(base_url)
    link_url = home_page.click_link("link", xpath=elements.HOMEPAGE_DISCOVER_ARTICLES_BUTTON_XPATH)
    assert link_url == f"{base_url}blogs", "Link navigation failed."
