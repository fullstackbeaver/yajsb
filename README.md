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

* **templates**      : contains template for new page or new component

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
- [X] send component data
- [ ] valid schema and save partial data from front
- [ ] add system to publish page
- [X] sanitize data from editor
- [ ] register special component for page data (like json-ld)
- [ ] add documentation (WIP)
- [ ] add site generator
- [ ] handle sitemap.xml
- [X] add CSS builder
- [ ] fix bug when save component rendered with default values and has several sub editor -> merge default data with data from page when it makes render
- [ ] fix save for optional fields
- [ ] add tests
- [ ] handle robot.txt
- [ ] handle published and draft status
- [ ] add socket to handle refresh
- [ ] add hsts in head https://hstspreload.org/
- [ ] test built web site and server with https://developer.mozilla.org/en-US/observatory
- [ ] include JSON-LD https://laconsole.dev/blog/booster-seo-jsonld
- [ ] rework to pure function

### front end
- [X] load data
- [X] show rendered page
- [X] add floating card that include page setting, add page, deploy site buttons and publish / unpublish page toogle (WIP)
- [X] show popup for selected component
- [X] add listener on editable component
- [X] save data
- [ ] show registered special component for page data
- [X] handle html editor (OK for POC but should be replaced later)
- [ ] create specific interface for image
- [ ] wrapper | add link target selector
- [ ] wrapper | handle JSON
- [ ] wrapper | add image selector
- [ ] refresh on server reload

### common front & back
- [ ] handle field description (only wrapper currently supported)

### scripts
- [X] add name validation in script that register component to avoid redifining built in component
- [X] add a script that create a component
- [ ] fix scss script when no scss compoennt
- [ ] add update of tsconfig in script


## Sonar Cloud evaluation

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=bugs)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_yajsb&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_yajsb)