# Vendored contract artifacts

These are copied verbatim from `folia-app/folia-contracts` at the commit this
project pins in package.json (`dc42f2ee`), and they are the artifacts of
contracts that are already deployed and immutable, so they do not change.

They are vendored because the dependency cannot supply them any more. That
package declares

    "files": ["./dist/**/*", "./dist/*"]

while `dist/` is listed in its .gitignore, so a git-dependency install of that
commit unpacks to an *empty* directory. Every build that has succeeded since
was reading a `node_modules/folia-contracts` left over in a build cache — one
that no longer matches the pinned commit either (Migrations.json and
ReserveAuction.json had drifted). A cache clear on the build host would have
broken the build permanently, with no commit to blame.

Verified before vendoring: the addresses in these files
(0x6CA044FB…6cb71C and 0xCF1f4b4f…424043DB) are the ones present in the
bundle currently served from the live site, so this changes no behaviour.

If folia-contracts ever publishes its build artifacts again, these can go back
to being an import from the package.
