#!/usr/bin/env python3
"""
Validador estático do tema Paulex Advanced (Shopify).

É o "test suite" do tema: como Liquid não roda fora da Shopify, validamos tudo
que dá para checar estaticamente e que já causou bug de verdade neste projeto:

  1. Todo .json faz parse.
  2. Todo bloco {% schema %} das sections é JSON válido.
  3. Tags Liquid balanceadas (if/for/case/paginate/form/capture/comment/...).
  4. Chaves {} balanceadas no theme.css.
  5. Toda chave de tradução usada (`'x.y' | t`) existe em pt-BR.default.json.
  6. Todo Strings.* usado no theme.js está definido em PaulexSettings (theme.liquid).
  7. Toda tag de custom element usada no Liquid está registrada no theme.js.
  8. Sem placeholders públicos óbvios fora do editor (Produto exemplo / R$ 0,00).
  9. Sem href="#" nem default:'#' (links mortos).
 10. node --check no theme.js e animations.js (se node estiver disponível).

Uso:
    python3 tools/validate.py
Sai com código 0 se tudo passar; 1 se houver qualquer falha.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors = []
warnings = []
checks = 0


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def read(p):
    return p.read_text(encoding="utf-8")


def strip_comments(s):
    """Remove blocos {% comment %}...{% endcomment %} (evita falsos positivos
    ao buscar tags/links em texto de documentação dentro de comentários)."""
    return re.sub(
        r"\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}",
        "", s, flags=re.S,
    )


# 1. JSON parse -------------------------------------------------------------
def check_json():
    global checks
    for p in ROOT.rglob("*.json"):
        if "/tools/" in str(p):
            continue
        checks += 1
        try:
            json.loads(read(p))
        except Exception as e:
            err(f"[json] {p.relative_to(ROOT)}: {e}")


# 2. Section schemas --------------------------------------------------------
def check_schemas():
    global checks
    for p in (ROOT / "sections").glob("*.liquid"):
        s = read(p)
        m = re.search(r"\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}", s, re.S)
        if m:
            checks += 1
            try:
                json.loads(m.group(1))
            except Exception as e:
                err(f"[schema] {p.relative_to(ROOT)}: {e}")


# 3. Liquid tag balance -----------------------------------------------------
PAIRS = [
    ("if", "endif"), ("unless", "endunless"), ("for", "endfor"),
    ("case", "endcase"), ("paginate", "endpaginate"), ("form", "endform"),
    ("capture", "endcapture"), ("comment", "endcomment"),
    ("style", "endstyle"), ("javascript", "endjavascript"),
]


def check_liquid_balance():
    global checks
    for sub in ("sections", "snippets", "layout"):
        for p in (ROOT / sub).glob("*.liquid"):
            s = strip_comments(read(p))
            checks += 1
            for op, en in PAIRS:
                if op == "comment":
                    continue  # removidos por strip_comments
                o = len(re.findall(r"\{%-?\s*" + op + r"\b", s))
                c = len(re.findall(r"\{%-?\s*" + en + r"\b", s))
                if o != c:
                    err(f"[liquid] {p.relative_to(ROOT)}: {op}={o} mas {en}={c}")


# 4. CSS brace balance ------------------------------------------------------
def check_css():
    global checks
    css = read(ROOT / "assets" / "theme.css")
    checks += 1
    if css.count("{") != css.count("}"):
        err(f"[css] chaves desbalanceadas: {{={css.count('{')} }}={css.count('}')}")


# 5. Translation keys -------------------------------------------------------
def flatten(d, prefix=""):
    out = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            out.update(flatten(v, key))
        else:
            out[key] = v
    return out


def check_translations():
    global checks
    locale = json.loads(read(ROOT / "locales" / "pt-BR.default.json"))
    flat = flatten(locale)
    # chaves de pluralização: base existe se base.one/base.other existem
    plural_bases = set()
    for k in flat:
        if k.endswith(".one") or k.endswith(".other"):
            plural_bases.add(k.rsplit(".", 1)[0])
    known = set(flat) | plural_bases
    pat = re.compile(r"'([a-z0-9_]+(?:\.[a-z0-9_]+)+)'\s*\|\s*t\b")
    for sub in ("sections", "snippets", "layout"):
        for p in (ROOT / sub).glob("*.liquid"):
            s = read(p)
            for key in pat.findall(s):
                checks += 1
                if key not in known:
                    err(f"[i18n] {p.relative_to(ROOT)}: chave de tradução ausente: {key}")


# 6. JS Strings.* vs PaulexSettings -----------------------------------------
def check_js_strings():
    global checks
    js = read(ROOT / "assets" / "theme.js")
    layout = read(ROOT / "layout" / "theme.liquid")
    used = set(re.findall(r"Strings\.([a-zA-Z]+)", js))
    # Extrai o objeto `strings: { ... }` por balanceamento de chaves (os valores
    # contêm {{ ... }}, então um regex simples pararia cedo demais).
    defined = set()
    idx = layout.find("strings:")
    if idx != -1:
        start = layout.find("{", idx)
        depth, j = 0, start
        while j < len(layout):
            if layout[j] == "{":
                depth += 1
            elif layout[j] == "}":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        block = layout[start:j + 1]
        defined = set(re.findall(r"(\w+):\s*\{\{", block))
    for s in used:
        checks += 1
        if s not in defined:
            err(f"[js-strings] Strings.{s} usado no theme.js mas não definido em PaulexSettings")


# 7. Custom elements --------------------------------------------------------
def check_custom_elements():
    global checks
    js = read(ROOT / "assets" / "theme.js")
    registered = set(re.findall(r"customElements\.define\('([a-z-]+)'", js))
    liquid = ""
    for sub in ("sections", "snippets", "layout"):
        for p in (ROOT / sub).glob("*.liquid"):
            liquid += read(p)
    for tag in registered:
        pass  # registrados são ok
    # tags com hífen usadas como elemento (heurística): <tag-name
    used = set(re.findall(r"<([a-z]+-[a-z-]+)[\s>]", liquid))
    known_html = {"color-scheme"}  # falsos positivos conhecidos
    for tag in used - known_html:
        checks += 1
        if tag not in registered:
            warn(f"[custom-el] <{tag}> usado no Liquid mas não registrado no theme.js (confirmar)")


# 8. Public placeholders ----------------------------------------------------
def check_placeholders():
    global checks
    # "Produto exemplo" e "R$ 0,00" só podem aparecer sob request.design_mode
    for p in (ROOT / "sections").glob("*.liquid"):
        s = read(p)
        for needle in ("Produto exemplo", "R$ 0,00"):
            if needle in strip_comments(s):
                checks += 1
                if "request.design_mode" not in s:
                    err(f"[placeholder] {p.relative_to(ROOT)}: '{needle}' sem guarda request.design_mode")


# 9. Dead links -------------------------------------------------------------
def check_dead_links():
    global checks
    for sub in ("sections", "snippets", "layout"):
        for p in (ROOT / sub).glob("*.liquid"):
            s = strip_comments(read(p))
            checks += 1
            for m in re.finditer(r'href="#"|default:\s*\'#\'', s):
                err(f"[dead-link] {p.relative_to(ROOT)}: link morto ({m.group(0)})")


# 10. node --check ----------------------------------------------------------
def check_js_syntax():
    global checks
    for f in ("theme.js", "animations.js"):
        path = ROOT / "assets" / f
        if not path.exists():
            continue
        checks += 1
        try:
            r = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
            if r.returncode != 0:
                err(f"[js-syntax] {f}: {r.stderr.strip()}")
        except FileNotFoundError:
            warn("[js-syntax] node não disponível; pulei node --check")
            return


def main():
    for fn in (check_json, check_schemas, check_liquid_balance, check_css,
               check_translations, check_js_strings, check_custom_elements,
               check_placeholders, check_dead_links, check_js_syntax):
        fn()

    print(f"Paulex theme validator — {checks} verificações executadas")
    for w in warnings:
        print("  ⚠️  " + w)
    if errors:
        print(f"\n❌ {len(errors)} erro(s):")
        for e in errors:
            print("  " + e)
        sys.exit(1)
    print(f"✅ Tudo passou ({len(warnings)} aviso(s)).")
    sys.exit(0)


if __name__ == "__main__":
    main()
