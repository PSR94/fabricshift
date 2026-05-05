from setuptools import setup, find_packages

setup(
    name="fabricshift",
    version="1.0.0",
    description="Synapse-to-Fabric Migration Readiness and Data Product Workbench — standalone Python CLI",
    author="FabricShift",
    packages=find_packages(),
    python_requires=">=3.10",
    entry_points={
        "console_scripts": ["fabricshift=fabricshift.cli:main"],
    },
)
