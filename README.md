# site-generator

## Roadmap

### backend
- [X] handle components
- [X] handle components inside components
- [X] handle default values and data schema thru Zod
- [X] render page for build
- [X] render page for editor
- [X] load data
- [X] introduce shared data
- [ ] send component data and schema to editor
- [ ] save data
- [ ] save partial data from front
- [ ] add documentation (WIP)
- [ ] validate component data on save
- [ ] sanitize data from editor
- [ ] handle sitemap.xml
- [ ] add ls4bun watcher
- [ ] add CSS builder
- [ ] add name validation in script that register component to avoid redifining built in component
- [ ] add a script that create a component
- [X] add description in component;
- [ ] add tests
- [ ] add dynmamic routes with for exampmle a folder like [lang] to set the lang. In this folder a json file will define which values are possibles.
- [ ] handle robot.txt
- [ ] rename Global
- [ ] add socket to handle refresh
- [ ] add site generator

### front end
- [ ] load data
- [ ] save data
- [ ] show rendered page
- [ ] show popup for selected component
- [ ] add listener on editable component
- [ ] create specific interface for image
- [ ] handle html editor
- [ ] handle header for global data
- [ ] add link target selector
- [ ] refresh on server reload

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
