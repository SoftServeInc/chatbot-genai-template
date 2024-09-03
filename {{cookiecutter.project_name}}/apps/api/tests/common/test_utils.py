import pytest

from {{ cookiecutter.__api_package_name }}.common.utils import find_first


def test_find_first() -> None:
    # ARRANGE
    array = [1, 3, 6, 9, 12]

    # ACT
    value = find_first(array, lambda x: x % 2 == 0)

    # ASSERT
    assert value == 6


def test_find_first_with_default() -> None:
    # ARRANGE
    array = [1, 3, 6, 9, 12]

    # ACT
    value = find_first(array, lambda x: x == 0, default=None)

    # ASSERT
    assert value is None


def test_find_first_with_no_default() -> None:
    # ARRANGE
    array = [1, 3, 6, 9, 12]

    with pytest.raises(ValueError):  # ASSERT
        # ACT
        find_first(array, lambda x: x == 0)

