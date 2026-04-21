from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="axk_theme",
    version="0.1.0",
    description="AXK Network brand styling and public page templates — portable Frappe theme app.",
    author="Afrikabal",
    author_email="team@afrikabal.org",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
