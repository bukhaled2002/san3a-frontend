// function extractDriveFileId(url: string) {
//   const regex = /\/d\/([^\/]+)\//;
//   const match = url.match(regex);
//   if (match && match[1]) {
//       return match[1];
//   } else {
//       return null;
//   }
// }

export function extractDriveFileId(url: string) {
  const regex = /\/d\/([^\/]+)\//;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}
