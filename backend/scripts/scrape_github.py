"""Scrape all public GitHub repos for Ernest-Gray and write knowledge-base/github-projects.md.

Run: uv run python scripts/scrape_github.py
No auth required — uses public GitHub API (60 req/hr unauthenticated).
"""

import base64
import json
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path

GITHUB_USER = "Ernest-Gray"
KB_DIR = Path(__file__).parent.parent.parent / "knowledge-base"
OUTPUT_FILE = KB_DIR / "github-projects.md"

HEADERS = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "portfolio-knowledge-base-scraper/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
}


def gh_get(url: str) -> dict | list | None:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        print(f"  HTTP {e.code} for {url}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  Error fetching {url}: {e}", file=sys.stderr)
        return None


def fetch_repos() -> list[dict]:
    repos = []
    page = 1
    while True:
        url = (
            f"https://api.github.com/users/{GITHUB_USER}/repos?per_page=100&type=public&page={page}"
        )
        page_data = gh_get(url)
        if not page_data:
            break
        repos.extend(page_data)
        if len(page_data) < 100:
            break
        page += 1
        time.sleep(0.5)
    return repos


def fetch_readme(repo_name: str) -> str:
    data = gh_get(f"https://api.github.com/repos/{GITHUB_USER}/{repo_name}/readme")
    if not data or "content" not in data:
        return ""
    try:
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
        # Strip markdown images/badges and collapse whitespace
        lines = []
        for line in content.splitlines():
            stripped = line.strip()
            # Skip badge lines and image-only lines
            if stripped.startswith("![") or stripped.startswith("[!["):
                continue
            lines.append(line)
        return "\n".join(lines).strip()
    except Exception:
        return ""


def fetch_languages(repo_name: str) -> dict[str, int]:
    data = gh_get(f"https://api.github.com/repos/{GITHUB_USER}/{repo_name}/languages")
    return data if isinstance(data, dict) else {}


def truncate(text: str, max_chars: int = 2000) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit("\n", 1)[0] + "\n\n*(README truncated)*"


def format_date(iso: str) -> str:
    try:
        return datetime.fromisoformat(iso.replace("Z", "+00:00")).strftime("%B %Y")
    except Exception:
        return iso


def build_markdown(repos: list[dict]) -> str:
    # Sort: pinned/starred first, then alphabetical
    repos_sorted = sorted(repos, key=lambda r: (-r.get("stargazers_count", 0), r["name"].lower()))

    lines = [
        "# Ernest Gray — GitHub Projects",
        "",
        f"Public repositories for https://github.com/{GITHUB_USER}. "
        f"Scraped {datetime.utcnow().strftime('%Y-%m-%d')}.",
        "",
        f"Total public repos: {len(repos_sorted)}",
        "",
        "---",
        "",
    ]

    for repo in repos_sorted:
        name: str = repo["name"]
        description: str = repo.get("description") or ""
        url: str = repo["html_url"]
        primary_lang: str = repo.get("language") or "N/A"
        topics: list[str] = repo.get("topics") or []
        stars: int = repo.get("stargazers_count", 0)
        forks: int = repo.get("forks_count", 0)
        created: str = format_date(repo.get("created_at", ""))
        updated: str = format_date(repo.get("updated_at", ""))
        is_fork: bool = repo.get("fork", False)
        homepage: str = repo.get("homepage") or ""

        print(f"  Processing: {name}")

        languages = fetch_languages(name)
        lang_list = ", ".join(languages.keys()) if languages else primary_lang
        readme = fetch_readme(name)
        time.sleep(0.3)  # be polite to GitHub API

        lines += [
            f"## {name}",
            "",
        ]

        if is_fork:
            lines += ["*(Fork)*", ""]

        if description:
            lines += [f"**Description:** {description}", ""]

        lines += [
            f"**URL:** {url}",
            f"**Primary Language:** {primary_lang}",
            f"**Languages:** {lang_list}",
        ]

        if topics:
            lines += [f"**Topics:** {', '.join(topics)}"]

        if homepage:
            lines += [f"**Live Site:** {homepage}"]

        lines += [
            f"**Stars:** {stars} | **Forks:** {forks}",
            f"**Created:** {created} | **Last Updated:** {updated}",
            "",
        ]

        if readme:
            lines += [
                "### README",
                "",
                truncate(readme),
                "",
            ]

        lines += ["---", ""]

    return "\n".join(lines)


def main():
    print(f"Fetching public repos for {GITHUB_USER}...")
    repos = fetch_repos()
    print(f"Found {len(repos)} public repos")

    if not repos:
        print("No repos found — exiting")
        sys.exit(1)

    print("Fetching details for each repo...")
    markdown = build_markdown(repos)

    KB_DIR.mkdir(exist_ok=True)
    OUTPUT_FILE.write_text(markdown, encoding="utf-8")
    print(f"\nWrote {len(markdown):,} chars to {OUTPUT_FILE}")
    print(f"File: {OUTPUT_FILE.name}")


if __name__ == "__main__":
    main()
