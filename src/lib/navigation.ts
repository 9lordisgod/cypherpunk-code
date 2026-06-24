export function navigateToAppPath(path: string) {
  if (!path.startsWith("/")) {
    throw new Error("App navigation must use a site-relative path");
  }

  window.location.assign(path);
}