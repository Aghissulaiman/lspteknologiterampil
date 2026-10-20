// tsx uses os.userInfo() only to suffix its temporary directory on Windows.
// Some restricted Node 25 environments fail that lookup, although Windows has no euid.
if (process.platform === "win32" && typeof process.geteuid !== "function") {
  Object.defineProperty(process, "geteuid", {
    configurable: true,
    value: () => 0,
  });
}
