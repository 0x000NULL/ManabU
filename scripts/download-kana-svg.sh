#!/usr/bin/env bash
# Downloads animated stroke order SVGs for hiragana and katakana characters
# from the animCJK project (https://github.com/parsimonhi/animCJK, LGPL licensed).
#
# SVGs are saved to public/svg/kana/ named by Unicode codepoint (e.g. 12354.svg for あ).
# Run once during project setup: bash scripts/download-kana-svg.sh

set -euo pipefail

REPO_URL="https://raw.githubusercontent.com/parsimonhi/animCJK/master/svgsJaKana"
OUTPUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/svg/kana"

# All 46 base hiragana characters (Unicode codepoints)
HIRAGANA_CODEPOINTS=(
  # Vowels: あいうえお
  12354 12356 12358 12360 12362
  # K-row: かきくけこ
  12363 12365 12367 12369 12371
  # S-row: さしすせそ
  12373 12375 12377 12379 12381
  # T-row: たちつてと
  12383 12385 12388 12390 12392
  # N-row: なにぬねの
  12394 12395 12396 12397 12398
  # H-row: はひふへほ
  12399 12402 12405 12408 12411
  # M-row: まみむめも
  12414 12415 12416 12417 12418
  # Y-row: やゆよ
  12420 12422 12424
  # R-row: らりるれろ
  12425 12426 12427 12428 12429
  # W-row + N: わをん
  12431 12434 12435
  # Dakuten G-row: がぎぐげご
  12364 12366 12368 12370 12372
  # Dakuten Z-row: ざじずぜぞ
  12374 12376 12378 12380 12382
  # Dakuten D-row: だぢづでど
  12384 12386 12389 12391 12393
  # Dakuten B-row: ばびぶべぼ
  12400 12403 12406 12409 12412
  # Handakuten P-row: ぱぴぷぺぽ
  12401 12404 12407 12410 12413
)

# All 46 base katakana characters (Unicode codepoints)
KATAKANA_CODEPOINTS=(
  # Vowels: アイウエオ
  12450 12452 12454 12456 12458
  # K-row: カキクケコ
  12459 12461 12463 12465 12467
  # S-row: サシスセソ
  12469 12471 12473 12475 12477
  # T-row: タチツテト
  12479 12481 12484 12486 12488
  # N-row: ナニヌネノ
  12490 12491 12492 12493 12494
  # H-row: ハヒフヘホ
  12495 12498 12501 12504 12507
  # M-row: マミムメモ
  12510 12511 12512 12513 12514
  # Y-row: ヤユヨ
  12516 12518 12520
  # R-row: ラリルレロ
  12521 12522 12523 12524 12525
  # W-row + N: ワヲン
  12527 12530 12531
  # Dakuten G-row: ガギグゲゴ
  12460 12462 12464 12466 12468
  # Dakuten Z-row: ザジズゼゾ
  12470 12472 12474 12476 12478
  # Dakuten D-row: ダヂヅデド
  12480 12482 12485 12487 12489
  # Dakuten B-row: バビブベボ
  12496 12499 12502 12505 12508
  # Handakuten P-row: パピプペポ
  12497 12500 12503 12506 12509
)

# Combine both arrays
ALL_CODEPOINTS=("${HIRAGANA_CODEPOINTS[@]}" "${KATAKANA_CODEPOINTS[@]}")

mkdir -p "$OUTPUT_DIR"

echo "Downloading kana stroke order SVGs to $OUTPUT_DIR..."
echo "Source: animCJK project (LGPL license)"
echo ""

success=0
fail=0

for cp in "${ALL_CODEPOINTS[@]}"; do
  filename="${cp}.svg"
  url="${REPO_URL}/${filename}"
  output="${OUTPUT_DIR}/${filename}"

  if [ -f "$output" ]; then
    echo "  [skip] ${filename} (already exists)"
    success=$((success + 1))
    continue
  fi

  if curl -sSf -o "$output" "$url" 2>/dev/null; then
    echo "  [ok]   ${filename}"
    success=$((success + 1))
  else
    echo "  [fail] ${filename} (${url})"
    fail=$((fail + 1))
  fi
done

echo ""
echo "Done: ${success} downloaded, ${fail} failed (out of ${#ALL_CODEPOINTS[@]} total)"
echo ""
echo "Note: Combination characters (yoon) use their component characters'"
echo "SVGs — no separate files are needed."
