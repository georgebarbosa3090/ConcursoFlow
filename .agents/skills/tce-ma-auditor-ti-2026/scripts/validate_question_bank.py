#!/usr/bin/env python3
"""Validate structural invariants of a Markdown question bank."""
from __future__ import annotations

import hashlib
import re
import sys
from collections import Counter
from pathlib import Path


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: validate_question_bank.py QUESTION_BANK.md")
    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    matches = list(re.finditer(r"^###\s+(TCE-MA-TI-\d{3,})\s*$", text, re.M))
    if not matches:
        raise SystemExit("ERROR: no TCE-MA-TI question IDs found")

    errors: list[str] = []
    ids: list[str] = []
    answers: list[str] = []
    hashes: Counter[str] = Counter()
    required = ("Disciplina", "Assunto", "Subassunto", "Banca", "Ano", "Natureza", "Dificuldade")

    for index, match in enumerate(matches):
        qid = match.group(1)
        ids.append(qid)
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[match.start():end]
        for field in required:
            if not re.search(rf"\*\*{re.escape(field)}:\*\*", block):
                errors.append(f"{qid}: missing {field}")
        options = re.findall(r"(?m)^([A-E])\)\s+", block)
        if options != list("ABCDE"):
            errors.append(f"{qid}: expected options A-E exactly once, got {options}")
        answer = re.search(r"\*\*Gabarito:\*\*\s*([A-E])", block)
        if not answer:
            errors.append(f"{qid}: missing valid answer")
        else:
            answers.append(answer.group(1))
        if "**Análise:**" not in block and "**Comentário:**" not in block:
            errors.append(f"{qid}: missing analysis/comment")
        stem = block.split("\nA)", 1)[0]
        normalized = re.sub(r"\W+", " ", stem.lower()).strip()
        hashes[hashlib.sha256(normalized.encode()).hexdigest()] += 1

    duplicates = [item for item, count in Counter(ids).items() if count > 1]
    if duplicates:
        errors.append(f"duplicate IDs: {duplicates}")
    duplicate_stems = sum(count - 1 for count in hashes.values() if count > 1)
    if duplicate_stems:
        errors.append(f"{duplicate_stems} duplicate normalized stems")
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        raise SystemExit(1)

    print(f"OK: {len(ids)} questions; unique IDs; complete metadata; A-E options")
    print("Answer distribution:", dict(sorted(Counter(answers).items())))


if __name__ == "__main__":
    main()
