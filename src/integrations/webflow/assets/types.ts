export type WebflowAsset = {
  id: string
  url: string
  displayName: string
  fileName: string
  fileSize: number
  createdOn: string
  parentFolder?: string
}

export type WebflowAssetResponse = {
  data: WebflowAsset
}