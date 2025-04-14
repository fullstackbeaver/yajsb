# Yajsb (Yet Another Jamstack Site Builder)

The project involves creating a static website generator using reusable components.
It's another Jamstack tool, but this one aim to be simple for devloppers and for final user with an web interface to change page data.
It doesn't use database, only json files.
This project aims to produce the lightest possible sites with good SEO capabilities.

## Architecture

* **generated**      : folder that contains built website

* **scripts**        : folder that contains script for automate some things like create quickly a component or register handmade components, etc.

* **site/components**: customs components used for the final site
* **site/pages**     : site tree with templates for rendering pages
* **site/public**    : contains all that is not html pages and that need to be exposed (medias, fonts, etc.)

* **src/core**       : constants, basic functions for data and component management.
* **src/components** : definitions of reusable components, each with its own data schema and template. These are buil in component like header, image,  etc.
* **src/data**       : functions for data management, including reading and writing JSON files.
* **src/adapters**   : adapters for the different technologies used, such as files, server, and admin interface. All theses elements are thought to be replaced by others easily if you want to custom this project.

## Technologies

This is a typescript project, based on Bun for performances. It use Zod for defining and validate component data.

* **Bun**       : JavaScript runtime for code execution.
* **Zod**       : library for data validation and component definition.
* **TypeScript**: programming language for type definitions and code compilation.

## Roadmap

### backend
- [X] handle components
- [X] handle components inside components
- [X] handle default values and data schema thru Zod
- [X] render page for build
- [X] render page for editor
- [X] load data
- [X] introduce shared data
- [X] add description in component;
- [X] handle site tree
- [X] rename Global
- [ ] add data for editor
- [ ] Add eslint
- [ ] send component data (WIP)
- [ ] valid schema and save partial data from front
- [ ] add system to publish page
- [ ] sanitize data from editor
- [ ] register special component for page data (like json-ld)
- [ ] add documentation (WIP)
- [ ] add site generator
- [ ] handle sitemap.xml
- [ ] add ls4bun watcher
- [ ] add CSS builder
- [ ] add tests
- [ ] handle robot.txt
- [ ] handle published and draft status
- [ ] add socket to handle refresh
- [ ] add hsts in head https://hstspreload.org/
- [ ] test built web site and server with https://developer.mozilla.org/en-US/observatory
- [ ] include JSON-LD https://laconsole.dev/blog/booster-seo-jsonld
- [ ] ??? : add dynmamic routes with for exampmle a folder like [lang] to set the lang. In this folder a json file will define which values are possibles.
- [ ] rework to pure function

### front end
- [ ] load data
- [ ] show rendered page
- [ ] add floating card that include page setting, add page, deploy site buttons and publish / unpublish page toogle
- [ ] show popup for selected component
- [ ] add listener on editable component
- [ ] save data
- [ ] show registered special component for page data
- [ ] create specific interface for image
- [ ] handle html editor
- [ ] add link target selector
- [ ] refresh on server reload

### scripts
- [ ] add name validation in script that register component to avoid redifining built in component
- [ ] add a script that create a component (use watcher instead) (WIP)


