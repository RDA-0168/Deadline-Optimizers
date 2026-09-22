// =============================================================================
// RailMark AI — Media Metadata Service
// =============================================================================

import { prisma } from '../db/prisma.js';

export class MediaService {
  static async getMediaByFittingId(fittingId: string) {
    try {
      return await prisma.mediaMetadata.findMany({
        where: { fittingId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  static async getMediaByInspectionId(inspectionId: string) {
    try {
      return await prisma.mediaMetadata.findMany({
        where: { inspectionId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  static async recordMedia(data: {
    fittingId?: string;
    inspectionId?: string;
    mediaType?: any;
    fileName: string;
    url: string;
    mimeType?: string;
    fileSize?: number;
    uploadedBy?: string;
    hashSha256?: string;
  }) {
    return await prisma.mediaMetadata.create({
      data: {
        fittingId: data.fittingId,
        inspectionId: data.inspectionId,
        mediaType: data.mediaType || 'IMAGE',
        fileName: data.fileName,
        url: data.url,
        mimeType: data.mimeType || 'image/jpeg',
        fileSize: data.fileSize,
        uploadedBy: data.uploadedBy || 'Inspector',
        hashSha256: data.hashSha256,
      },
    });
  }
}
