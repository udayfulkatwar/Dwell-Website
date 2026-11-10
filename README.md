# ASTRA DWELL

**From a builder's brief to an architect-grade plan and a 3D walkthrough, in the browser.**

ASTRA DWELL is a bootstrapped technology startup from Nagpur, India. We build software that gives small and mid-size builders the design and presentation quality that until now only large developers with in-house teams could afford.

| | |
| --- | --- |
| Website | https://dwell.astragrp.net |
| Private project portal | https://projects.astragrp.net |
| Founded | 2026, Nagpur, India |
| Stage | Pre-revenue, self-funded by the founders |
| Contact | founder@astragrp.net |

## The problem

A large developer has architects, structural consultants and a visualization team on payroll. A builder doing ten to a hundred homes a year has none of these. They sell from flat 2D drawings, find design clashes on site instead of on paper, and lose buyers to firms with better presentation.

## What we are building

### 1. ASTRA Studio (in development)

An AI design engine for residential projects. The builder gives a brief in plain language; the engine does the work of a design office.

| Stage | What it does | Status |
| --- | --- | --- |
| Brief intake | Understands a brief in English, Hindi, Marathi or Hinglish and asks only for what is missing | Built and tested |
| Rule selection | Picks the applicable rules from our sourced knowledge base | Built and tested |
| Site and setbacks | Works out the buildable area on the plot | Built and tested |
| Room layout | Solves zones, rooms and doors | Built and tested |
| Checks and fix loop | Finds clashes and rule failures, then repairs the plan | Built and tested |
| Structure | Column grid, frame and load checks | Built and tested |
| Services, cost (BOQ), roof | Plumbing stacks, quantities, roof design | Next |
| Drawings, reports and BIM | Client-ready output package | Planned |
| Edits by command | "Make the kitchen bigger" changes the whole design consistently | Planned |
| 3D walkthrough | The finished design, walkable in the browser | Planned |

How it is built:

- **Sourced, not guessed.** Every law and safety number comes from a rule table or a knowledge card with a recorded source, and is computed in code. The knowledge base holds 184 cards today, each with a source and a verification status.
- **Engine first, model second.** Each stage works as deterministic code before a large language model is added on top of it.
- **Tested.** 59 automated test suites cover the pipeline, including planted clashes the engine must catch.
- **Honest output.** Plans are concept and schematic. Approval and structural sign-off stay with a licensed architect and structural engineer.

The engine code and knowledge base are in a private repository. Read access is available to partners and reviewers on request.

### 2. Browser-based 3D experiences (live)

The presentation layer, already running on this site: interactive walkthroughs, walkthrough films and sales websites generated from floor plans. One link, no app to install, runs in any modern browser.

Try it: the free 3D room and the map-to-home film at https://dwell.astragrp.net. The projects shown are studio concepts built to demonstrate the pipeline, and are labelled as such on the site.

## Technology

| Layer | Stack |
| --- | --- |
| Design engine | Python, rule tables, constraint solver, large language model per department |
| 3D pipeline | Blender (code-driven), three.js, WebGL |
| Web | Next.js, static export |
| Outputs | PDF, DXF, IFC |

## Team

| | |
| --- | --- |
| Uday Fulkatwar | Founder. Product and engineering |
| Vivek Chaudhary | Co-Founder. Marketing and content |

## This repository

This repository holds the built static site served at https://dwell.astragrp.net (branch `gh-pages`). The files here are build output; the source lives in a separate repository.

---

© 2026 ASTRA DWELL. All rights reserved.
