import { createServerFn } from '@tanstack/react-start';
import { WebflowClient } from "webflow-api";
import { z } from 'zod';
import { createHash } from 'crypto';
import type { WebflowAsset, WebflowAssetResponse } from './types';

const FOLDER_NAME = 'Discord Verification Submissions';
const FOLDER_ID = process.env.WEBFLOW_ASSET_FOLDER || '';
const initWebflowClient = () => {
  const token = process.env.WEBFLOW_API_TOKEN;
  const siteId = process.env.WEBFLOW_SITE_ID;
  
  if (!token || !siteId) {
    throw new Error('Missing WEBFLOW_API_TOKEN or WEBFLOW_SITE_ID environment variables');
  }
  
  return {
    client: new WebflowClient({ accessToken: token }),
    siteId
  };
};

const generateFileHash = (buffer: ArrayBuffer): string => {
  const hash = createHash('md5');
  hash.update(Buffer.from(buffer));
  return hash.digest('hex');
};

export const uploadAsset = createServerFn({ method: 'POST' })
  .validator(z.object({
    fileName: z.string(),
    fileBuffer: z.string(),
    contentType: z.string(),
  }))
  .handler(async ({ data }) => {
    try {
        // SUBVERT AND HARD CODE FOLDER ID FOR NOW
    //   const folderResult = await findOrCreateFolder();
    //   if (!folderResult.success) {
    //     throw new Error('Failed to create/find folder');
    //   }

      // Convert base64 string back to ArrayBuffer
      const binaryString = atob(data.fileBuffer);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;

      // ✅ Step 1: Generate MD5 hash from file contents
      const fileHash = generateFileHash(arrayBuffer);
      
      const { client, siteId } = initWebflowClient();
      const assetResponse = await client.assets.create(siteId, {
        fileName: data.fileName,
        parentFolder: FOLDER_ID,
        fileHash: fileHash,
      });

      // Step 4: Upload file to S3 using the provided upload details
      if (!assetResponse.uploadDetails || !assetResponse.uploadUrl) {
        throw new Error('Missing upload details from Webflow response');
      }

      const formData = new FormData();
      
      // ✅ Step 2: Add upload details following Webflow documentation example
      const uploadDetails = assetResponse.uploadDetails;
      
      // Append all required fields to the form (following Webflow docs)
      if (uploadDetails.acl) formData.append("acl", uploadDetails.acl);
      if (uploadDetails.bucket) formData.append("bucket", uploadDetails.bucket);
      if (uploadDetails.xAmzAlgorithm) formData.append("X-Amz-Algorithm", uploadDetails.xAmzAlgorithm);
      if (uploadDetails.xAmzCredential) formData.append("X-Amz-Credential", uploadDetails.xAmzCredential);
      if (uploadDetails.xAmzDate) formData.append("X-Amz-Date", uploadDetails.xAmzDate);
      if (uploadDetails.key) formData.append("key", uploadDetails.key);
      if (uploadDetails.policy) formData.append("Policy", uploadDetails.policy);
      if (uploadDetails.xAmzSignature) formData.append("X-Amz-Signature", uploadDetails.xAmzSignature);
      if (uploadDetails.successActionStatus) formData.append("success_action_status", uploadDetails.successActionStatus);
      if (uploadDetails.contentType) formData.append("Content-Type", uploadDetails.contentType);
      if (uploadDetails.cacheControl) formData.append("Cache-Control", uploadDetails.cacheControl);
      
      // ✅ Step 3: Add the file LAST (required by S3 policy)
      const fileBlob = new Blob([arrayBuffer], { type: data.contentType });
      formData.append('file', fileBlob, data.fileName);

      // ✅ Step 4: Upload to S3 with proper error handling
      const uploadResponse = await fetch(assetResponse.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('S3 upload error details:', errorText);
        throw new Error(`S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
      }

      return {
        success: true,
        message: 'Asset uploaded successfully',
        asset: {
          
          fileName: assetResponse.originalFileName,
          id: assetResponse.id,
          parentFolder: assetResponse.parentFolder,
          assetUrl: assetResponse.assetUrl,
          hostedUrl: assetResponse.hostedUrl,
          uploadUrl: assetResponse.uploadUrl,
        }
      };

    } catch (error) {
      console.error('Error in uploadAsset:', error);
      return {
        success: false,
        message: 'Error uploading asset',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });


// SUNSET AND HARD CODE FOLDER ID FOR NOW
export const getFolder = createServerFn({ method: 'GET' })
  .validator(z.object({
    folderId: z.string(),
  }))
  .handler(async ({ data }) => {
    const { client, siteId } = initWebflowClient();
    const response = await client.assets.getFolder(data.folderId);
    return response;
  });


// SUNSET AND HARD CODE FOLDER ID FOR NOW
export const createFolder = createServerFn({ method: 'POST' })
  .validator(z.object({
    folderName: z.string(),
  }))
  .handler(async ({ data }) => {
    const { client, siteId } = initWebflowClient();
    const response = await client.assets.createFolder(siteId, {
      displayName: data.folderName,
    });
    return response.id;
  });


  // SUNSET AND HARD CODE FOLDER ID FOR NOW
export const findOrCreateFolder = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const { client, siteId } = initWebflowClient();
      
      console.log('Fetching asset folders for site:', siteId);
      const response = await client.assets.listFolders(siteId);
      console.log('Webflow response:', response);
      
      const folder = response.assetFolders?.find((folder) => folder.displayName === FOLDER_NAME);
      
      if (folder) {
        return { 
          success: true, 
          message: 'Folder exists', 
          folderId: folder.id,
          folder 
        };
      } else {
        const folderId = await createFolder({ data: { folderName: FOLDER_NAME } });
        return { 
          success: true, 
          message: 'Folder created', 
          folderId 
        };
      }
      
    } catch (error) {
      console.error('Error in findOrCreateFolder:', error);
      return { 
        success: false, 
        message: 'Error fetching folders', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });

// DEBUGGING ONLY
export const getFolderWithLastAsset = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const { client, siteId } = initWebflowClient();
      
      // Get the specific folder with its assets array
      const folderResponse = await client.assets.getFolder(process.env.WEBFLOW_ASSET_FOLDER || '');
      
      if (!folderResponse.assets || folderResponse.assets.length === 0) {
        return {
          success: true,
          message: 'No assets found in Discord Verification folder',
          folder: folderResponse,
          totalAssets: 0,
          lastAsset: null
        };
      }

      // Track asset IDs for debugging
      const assetIds = folderResponse.assets;
      const uniqueAssetIds = [...new Set(assetIds)];
      
      // Fetch detailed information for each asset in the folder
      const assetPromises = uniqueAssetIds.map(async (assetId) => {
        try {
          return await client.assets.get(assetId);
        } catch (error) {
          console.error(`Failed to fetch asset ${assetId}:`, error);
          return null;
        }
      });
      
      const assetResults = await Promise.all(assetPromises);
      const validAssets = assetResults.filter(asset => asset !== null);
      const invalidAssetIds = uniqueAssetIds.filter((_, index) => assetResults[index] === null);

      // Sort by creation date (newest first) and get the last uploaded asset
      const sortedAssets = validAssets.sort((a, b) => 
        new Date(b.createdOn || '').getTime() - new Date(a.createdOn || '').getTime()
      );

      return {
        success: true,
        message: `Found ${validAssets.length} valid assets in Discord Verification folder`,
        folder: {
          ...folderResponse,
          totalAssetIds: assetIds.length,
          uniqueAssetIds: uniqueAssetIds.length
        },
        totalAssets: validAssets.length,
        lastAsset: sortedAssets[0] || null,
        invalidAssetIds: invalidAssetIds.length > 0 ? invalidAssetIds : undefined
      };
    } catch (error) {
      console.error('Error in getFolderWithLastAsset:', error);
      return {
        success: false,
        message: 'Error fetching folder with last asset',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
