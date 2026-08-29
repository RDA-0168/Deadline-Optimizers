export declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            ApiResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    data: {
                        type: string;
                    };
                };
            };
            LoginRequest: {
                type: string;
                required: string[];
                properties: {
                    username: {
                        type: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        example: string;
                    };
                };
            };
            QRResolveRequest: {
                type: string;
                required: string[];
                properties: {
                    qrValue: {
                        type: string;
                        example: string;
                    };
                };
            };
            CreateFittingRequest: {
                type: string;
                required: string[];
                properties: {
                    fittingId: {
                        type: string;
                        example: string;
                    };
                    fittingType: {
                        type: string;
                        example: string;
                    };
                    manufacturer: {
                        type: string;
                        example: string;
                    };
                    batchNumber: {
                        type: string;
                        example: string;
                    };
                    manufacturingDate: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    materialGrade: {
                        type: string;
                        example: string;
                    };
                    standardSpec: {
                        type: string;
                        example: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    railLine: {
                        type: string;
                        example: string;
                    };
                    trackSection: {
                        type: string;
                        example: string;
                    };
                    sleeperNumber: {
                        type: string;
                        example: string;
                    };
                    gpsLatitude: {
                        type: string;
                        example: number;
                    };
                    gpsLongitude: {
                        type: string;
                        example: number;
                    };
                    installedBy: {
                        type: string;
                        example: string;
                    };
                    installationDate: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    torqueSpecNm: {
                        type: string;
                        example: number;
                    };
                    qrCodeValue: {
                        type: string;
                        example: string;
                    };
                    markingMachineId: {
                        type: string;
                        example: string;
                    };
                };
            };
            CreateInspectionRequest: {
                type: string;
                required: string[];
                properties: {
                    inspectionDate: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    inspector: {
                        type: string;
                        example: string;
                    };
                    condition: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    qrReadability: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    corrosion: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    surfaceDamage: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    deformation: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    wear: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    notes: {
                        type: string;
                        example: string;
                    };
                    aiAssistanceResult: {
                        type: string;
                        example: string;
                    };
                    aiConfidence: {
                        type: string;
                        example: number;
                    };
                };
            };
            CreateMaintenanceRequest: {
                type: string;
                required: string[];
                properties: {
                    maintenanceDate: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    maintenanceType: {
                        type: string;
                        example: string;
                    };
                    technician: {
                        type: string;
                        example: string;
                    };
                    description: {
                        type: string;
                        example: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    nextMaintenance: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
        };
    };
    paths: {
        '/api/auth/login': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/me': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/fittings': {
            get: {
                tags: string[];
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                })[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                    400: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                    403: {
                        description: string;
                    };
                };
            };
        };
        '/api/fittings/{fittingId}': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        example: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    403: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    403: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/api/qr/{fittingId}': {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        example: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/api/qr/resolve': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/api/fittings/{fittingId}/inspections': {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                    400: {
                        description: string;
                    };
                    403: {
                        description: string;
                    };
                };
            };
        };
        '/api/fittings/{fittingId}/maintenance': {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                    403: {
                        description: string;
                    };
                };
            };
        };
        '/api/fittings/{fittingId}/lifecycle': {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/api/search': {
            get: {
                tags: string[];
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        example: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                        example?: undefined;
                    };
                })[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/dashboard/stats': {
            get: {
                tags: string[];
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/audit-logs': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                description: string;
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    403: {
                        description: string;
                    };
                };
            };
        };
    };
};
