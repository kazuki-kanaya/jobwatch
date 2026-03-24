Third-Party Notices for the Obsern CLI
======================================

The Obsern CLI itself is licensed under the MIT License. See `LICENSE`.

This document lists third-party dependencies currently used by the CLI module
and notes the licenses that apply to redistribution of the CLI.

Included dependencies
---------------------

- `github.com/spf13/cobra` v1.10.2
  - License: Apache License 2.0

- `github.com/spf13/pflag` v1.0.10
  - License: BSD 3-Clause License

- `github.com/inconshreveable/mousetrap` v1.1.0
  - License: Apache License 2.0

- `gopkg.in/yaml.v3` v3.0.1
  - License: MIT and Apache License 2.0
  - Additional notice text is included below because the upstream module ships a
    `NOTICE` file.

Upstream notice text
--------------------

`gopkg.in/yaml.v3`:

Copyright 2011-2016 Canonical Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Redistribution guidance
-----------------------

Redistributed CLI release artifacts should include at least:

- `LICENSE`
- `THIRD_PARTY_NOTICES.md`
- `licenses/APACHE-2.0.txt`
- `licenses/BSD-3-Clause.txt`

If a future dependency adds its own `NOTICE` file or other redistribution
requirements, update this file and the release packaging accordingly.

Full license texts included in this directory
---------------------------------------------

- `licenses/APACHE-2.0.txt`
- `licenses/BSD-3-Clause.txt`
