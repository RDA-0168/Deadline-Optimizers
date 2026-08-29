# RailMark AI — Database Architecture & Schemas

> **AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings**  
> *Smart India Hackathon (SIH) Prototype*

This directory houses the database schemas, seed datasets, and persistent storage engine for the RailMark AI application.

---

## 🗄️ Database Architecture

The RailMark AI database engine is engineered with dual-mode flexibility:

1. **Embedded Transactional Persistent Engine (Default)**:
   - Stores data persistently in `railmark_store.json` (and SQLite compatible formats).
   - Zero external setup required: works instantly across Windows/Linux/macOS.
   - Automatically syncs all create, update, inspection, and maintenance operations from the UI.

2. **Enterprise PostgreSQL Mode**:
   - Ready-to-deploy schema defined in `schema.sql` with full indexes, checks, and foreign key relations.
   - Seed data in `seed.sql` for instant demonstration environments.
   - Switchable via `DB_TYPE=postgres` in `.env`.

---

## 📊 Entity Relationship (ER) Model

```
+------------------+         1:N          +-----------------------+
|     FITTINGS     | -------------------> |      INSPECTIONS      |
|------------------|                      |-----------------------|
| PK fitting_id    |                      | PK id                 |
|    fitting_type  |                      | FK fitting_id         |
|    manufacturer  |                      |    condition          |
|    qr_code_value |                      |    qr_readability     |
|    gps_coords    |                      |    ai_confidence      |
|    torque_spec   |                      +-----------------------+
|    status        |
+------------------+
         |
         | 1:N
         +------------------------------> +-----------------------+
         |                                |  MAINTENANCE_RECORDS  |
         |                                |-----------------------|
         |                                | PK id                 |
         |                                | FK fitting_id         |
         |                                |    maintenance_type   |
         |                                |    status             |
         +------------------------------> +-----------------------+
         | 1:N
         |                                +-----------------------+
         +------------------------------> |   LIFECYCLE_EVENTS    |
                                          |-----------------------|
                                          | PK id                 |
                                          | FK fitting_id         |
                                          |    event (DPM, etc.)  |
                                          |    timestamp          |
                                          +-----------------------+
```

---

## 📁 File Manifest

- `schema.sql`: Full PostgreSQL schema definitions and table constraints.
- `sqlite-schema.sql`: Embedded SQLite DDL script.
- `seed.sql`: Realistic railway track fitting test dataset.
- `railmark_store.json`: Persistent file-backed database storage.
- `db-init.js`: Standalone database sync and health verification utility.
