#!/usr/bin/env bash
# Copies the built design system into ds/ as a stripped public copy:
# no comments or package headers, and only the should brand. Run with DS_DIR set to the design system checkout.
set -euo pipefail
: "${DS_DIR:?set DS_DIR to the design system checkout}"
cd "$(dirname "$0")/.."
node scripts/strip-design-system.mjs "$DS_DIR/dist" ds
echo '{ "type": "module" }' > ds/package.json
