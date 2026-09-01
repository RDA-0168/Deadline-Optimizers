"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'RailMark AI — Backend REST API',
        version: '1.0.0',
        description: `### AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
*Smart India Hackathon Prototype*

**Disclaimer:** All data provided by this API is **DEMO / PROTOTYPE DATA ONLY** and is not affiliated with or extracted from an official Indian Railways database.

---
### Architecture Overview
- **Authentication**: JWT Bearer Token with Role-Based Access Control (**ADMIN**, **INSPECTOR**, **MAINTENANCE**).
- **QR Traceability**: Scanned Laser QR codes resolve directly to complete lifecycle timelines.
- **AI-Assisted Field Inspections**: AI vision/defect advisory metadata (\`aiAssistanceResult\`, \`aiConfidence\`) assists inspectors without automated override.
- **Audit Compliance**: Every fitting creation, modification, QR scan, and maintenance submission is immutably logged.
    `,
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local Development Server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token obtained from `/api/auth/login`',
            },
        },
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Operation completed successfully' },
                    data: { type: 'object' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string', example: 'admin' },
                    password: { type: 'string', example: 'Admin@123' },
                },
            },
            QRResolveRequest: {
                type: 'object',
                required: ['qrValue'],
                properties: {
                    qrValue: { type: 'string', example: 'RM-FIT-0001' },
                },
            },
            CreateFittingRequest: {
                type: 'object',
                required: [
                    'fittingId',
                    'fittingType',
                    'manufacturer',
                    'batchNumber',
                    'manufacturingDate',
                    'materialGrade',
                    'standardSpec',
                    'railLine',
                    'trackSection',
                    'sleeperNumber',
                    'gpsLatitude',
                    'gpsLongitude',
                    'installedBy',
                    'installationDate',
                    'torqueSpecNm',
                ],
                properties: {
                    fittingId: { type: 'string', example: 'RM-FIT-0015' },
                    fittingType: { type: 'string', example: 'Elastic Rail Clip (ERC MK-V)' },
                    manufacturer: { type: 'string', example: 'Bharat Track Tech Ltd' },
                    batchNumber: { type: 'string', example: 'BATCH-2026-015' },
                    manufacturingDate: { type: 'string', format: 'date', example: '2026-02-01' },
                    materialGrade: { type: 'string', example: 'Spring Steel 60Si7' },
                    standardSpec: { type: 'string', example: 'RDSO/T-3701' },
                    status: { type: 'string', enum: ['Active', 'Maintenance Required', 'Critical', 'Pending Inspection', 'Replaced'], example: 'Active' },
                    railLine: { type: 'string', example: 'Northern High-Density Corridor' },
                    trackSection: { type: 'string', example: 'Section KM 144/2 - Down Main' },
                    sleeperNumber: { type: 'string', example: 'PSC-SLP-4480' },
                    gpsLatitude: { type: 'number', example: 28.6145 },
                    gpsLongitude: { type: 'number', example: 77.2102 },
                    installedBy: { type: 'string', example: 'Northern Track Team #1' },
                    installationDate: { type: 'string', format: 'date', example: '2026-02-10' },
                    torqueSpecNm: { type: 'number', example: 120.0 },
                    qrCodeValue: { type: 'string', example: 'RM-FIT-0015' },
                    markingMachineId: { type: 'string', example: 'LASER-ENG-MARK-02' },
                },
            },
            CreateInspectionRequest: {
                type: 'object',
                required: [
                    'condition',
                    'qrReadability',
                    'corrosion',
                    'surfaceDamage',
                    'deformation',
                    'wear',
                    'notes',
                    'aiAssistanceResult',
                    'aiConfidence',
                ],
                properties: {
                    inspectionDate: { type: 'string', format: 'date-time', example: '2026-02-28T10:00:00.000Z' },
                    inspector: { type: 'string', example: 'inspector_user' },
                    condition: { type: 'string', enum: ['Good', 'Moderate', 'Fair', 'Critical', 'Severe'], example: 'Good' },
                    qrReadability: { type: 'string', enum: ['High', 'Medium', 'Low', 'Unreadable'], example: 'High' },
                    corrosion: { type: 'string', enum: ['None', 'Light', 'Moderate', 'Severe'], example: 'None' },
                    surfaceDamage: { type: 'string', enum: ['None', 'Minor Scratch', 'Crack Detected', 'Spalling'], example: 'None' },
                    deformation: { type: 'string', enum: ['None', 'Slight Bend', 'Severe Distortion'], example: 'None' },
                    wear: { type: 'string', enum: ['Minimal', 'Normal', 'Excessive'], example: 'Minimal' },
                    notes: { type: 'string', example: 'Laser mark pristine; clip toe seated properly.' },
                    aiAssistanceResult: { type: 'string', example: 'AI Vision Assist: No defects detected. Geometry verified within 0.2mm tolerance.' },
                    aiConfidence: { type: 'number', example: 0.985 },
                },
            },
            CreateMaintenanceRequest: {
                type: 'object',
                required: ['maintenanceDate', 'maintenanceType', 'description', 'status', 'nextMaintenance'],
                properties: {
                    maintenanceDate: { type: 'string', format: 'date', example: '2026-02-28' },
                    maintenanceType: { type: 'string', example: 'Routine Torque Check & Lubrication' },
                    technician: { type: 'string', example: 'Vikram Singh' },
                    description: { type: 'string', example: 'Torque calibrated to 110 Nm with digital wrench.' },
                    status: { type: 'string', enum: ['Completed', 'In Progress', 'Scheduled', 'Deferred'], example: 'Completed' },
                    nextMaintenance: { type: 'string', format: 'date', example: '2026-08-28' },
                },
            },
        },
    },
    paths: {
        '/api/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Authenticate user and obtain JWT token',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
                },
                responses: {
                    200: { description: 'Login successful with JWT token' },
                    401: { description: 'Invalid credentials' },
                },
            },
        },
        '/api/auth/me': {
            get: {
                tags: ['Authentication'],
                summary: 'Get currently authenticated user profile',
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: 'User profile retrieved' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/api/fittings': {
            get: {
                tags: ['Fittings'],
                summary: 'List all railway track fittings',
                parameters: [
                    { name: 'status', in: 'query', schema: { type: 'string' } },
                    { name: 'fittingType', in: 'query', schema: { type: 'string' } },
                    { name: 'manufacturer', in: 'query', schema: { type: 'string' } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
                ],
                responses: {
                    200: { description: 'List of fittings' },
                },
            },
            post: {
                tags: ['Fittings'],
                summary: 'Create a new railway fitting record',
                security: [{ BearerAuth: [] }],
                description: 'Requires ADMIN or INSPECTOR role.',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateFittingRequest' } } },
                },
                responses: {
                    201: { description: 'Fitting created' },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/fittings/{fittingId}': {
            get: {
                tags: ['Fittings'],
                summary: 'Get full composite details for a fitting',
                description: 'Returns Basic, Installation, QR, Inspection, Maintenance, and Lifecycle information.',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string', example: 'RM-FIT-0001' } }],
                responses: {
                    200: { description: 'Full fitting record' },
                    404: { description: 'Fitting not found' },
                },
            },
            put: {
                tags: ['Fittings'],
                summary: 'Update fitting details',
                security: [{ BearerAuth: [] }],
                description: 'Requires ADMIN role.',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object' } } },
                },
                responses: {
                    200: { description: 'Fitting updated' },
                    403: { description: 'Forbidden' },
                    404: { description: 'Fitting not found' },
                },
            },
            delete: {
                tags: ['Fittings'],
                summary: 'Delete fitting record (Prototype admin use)',
                security: [{ BearerAuth: [] }],
                description: 'Requires ADMIN role.',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Fitting deleted' },
                    403: { description: 'Forbidden' },
                    404: { description: 'Fitting not found' },
                },
            },
        },
        '/api/qr/{fittingId}': {
            get: {
                tags: ['QR & Laser Marking'],
                summary: 'Get QR-related metadata and laser marking specs',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string', example: 'RM-FIT-0001' } }],
                responses: {
                    200: { description: 'QR info returned' },
                    404: { description: 'Fitting not found' },
                },
            },
        },
        '/api/qr/resolve': {
            post: {
                tags: ['QR & Laser Marking'],
                summary: 'Resolve scanned QR code string/URL to Fitting ID',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QRResolveRequest' } } },
                },
                responses: {
                    200: { description: 'QR resolved successfully' },
                    404: { description: 'Fitting not found' },
                },
            },
        },
        '/api/fittings/{fittingId}/inspections': {
            get: {
                tags: ['Inspections'],
                summary: 'Get all inspection records for a fitting',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Inspections list' },
                    404: { description: 'Fitting not found' },
                },
            },
            post: {
                tags: ['Inspections'],
                summary: 'Submit field inspection with AI assistance results',
                security: [{ BearerAuth: [] }],
                description: 'Requires INSPECTOR or ADMIN role.',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateInspectionRequest' } } },
                },
                responses: {
                    201: { description: 'Inspection recorded' },
                    400: { description: 'Validation error' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/fittings/{fittingId}/maintenance': {
            get: {
                tags: ['Maintenance'],
                summary: 'Get maintenance history for a fitting',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Maintenance history' },
                    404: { description: 'Fitting not found' },
                },
            },
            post: {
                tags: ['Maintenance'],
                summary: 'Record maintenance activity',
                security: [{ BearerAuth: [] }],
                description: 'Requires MAINTENANCE or ADMIN role.',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMaintenanceRequest' } } },
                },
                responses: {
                    201: { description: 'Maintenance recorded' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/api/fittings/{fittingId}/lifecycle': {
            get: {
                tags: ['Lifecycle'],
                summary: 'Get chronological digital lifecycle events for a fitting',
                parameters: [{ name: 'fittingId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Lifecycle timeline events' },
                    404: { description: 'Fitting not found' },
                },
            },
        },
        '/api/search': {
            get: {
                tags: ['Search'],
                summary: 'Global search across fittings, QR codes, batch numbers, and locations',
                parameters: [
                    { name: 'q', in: 'query', schema: { type: 'string', example: 'ERC' } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                ],
                responses: {
                    200: { description: 'Search results' },
                },
            },
        },
        '/api/dashboard/stats': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get aggregate operational statistics & KPIs',
                responses: {
                    200: { description: 'Dashboard metrics' },
                },
            },
        },
        '/api/audit-logs': {
            get: {
                tags: ['Audit Logs'],
                summary: 'Get immutable audit logs',
                security: [{ BearerAuth: [] }],
                description: 'Requires ADMIN or INSPECTOR role.',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
                ],
                responses: {
                    200: { description: 'Audit logs list' },
                    403: { description: 'Forbidden' },
                },
            },
        },
    },
};
//# sourceMappingURL=swagger.js.map