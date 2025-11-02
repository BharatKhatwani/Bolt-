import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import { useEffect, useState, useRef } from "react";
import * as CryptoJS from "crypto-js";
import type { FileItem } from "../types";
import { Loader2 } from "lucide-react";
// import { CheckCircle, Circle, Clock, Loader2 } from "lucide-react";
interface PreviewFrameProps {
  files: FileItem[];
  webContainer: WebContainer | undefined;
}

declare global {
  interface Window {
    __pkgHash__?: string;
    __installDone__?: boolean;
    __devProcess__?: WebContainerProcess;
  }
}

export function PreviewFrame({ webContainer, files }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const filesHashRef = useRef<string>("");
  const isServerReadyRef = useRef(false);

  // Compute hash to detect file changes
  function getFilesHash(filesList: FileItem[]): string {
    const fileContents = JSON.stringify(
      filesList.map((f) => ({
        path: f.path,
        content: f.content,
        type: f.type,
      }))
    );
    return CryptoJS.SHA256(fileContents).toString().slice(0, 12);
  }

  async function getPackageJsonHash(wc: WebContainer) {
    try {
      const pkg = await wc.fs.readFile("/package.json", "utf-8");
      return CryptoJS.SHA256(pkg).toString().slice(0, 12);
    } catch {
      return "no-pkg";
    }
  }

  async function installDependencies(wc: WebContainer) {
    const pkgHash = await getPackageJsonHash(wc);

    if (!window.__installDone__ || window.__pkgHash__ !== pkgHash) {
      // console.log("📦 Installing dependencies...");
      const installProcess = await wc.spawn("npm", ["install"]);

      installProcess.output.pipeTo(
        new WritableStream({
          write() {
            // console.log(data);
          },
        })
      );

      const exitCode = await installProcess.exit;
      if (exitCode !== 0) throw new Error("❌ npm install failed");

      window.__installDone__ = true;
      window.__pkgHash__ = pkgHash;
      // console.log("✅ Dependencies installed & cached");
    } else {
      // console.log("♻️ Using cached node_modules");
    }
  }

  async function startDevServer(wc: WebContainer) {
    // console.log("🚀 Starting dev server...");
    const devProcess = await wc.spawn("npm", ["run", "dev"]);
    window.__devProcess__ = devProcess;

    devProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          if (data.toLowerCase().includes("error")) console.error(data);
        },
      })
    );

    wc.on("server-ready", (_port, previewUrl) => {
      // console.log(`✅ Server ready at: ${previewUrl}`);
      setUrl(previewUrl);
      setLoading(false);
      isServerReadyRef.current = true;
    });
  }

  async function writeFilesIncrementally(wc: WebContainer, filesList: FileItem[]) {
    for (const file of filesList) {
      if (file.type === "file") {
        try {
          await wc.fs.writeFile(file.path, file.content || "");
        } catch (err) {
          console.warn(`⚠️ Failed to write file ${file.path}:`, err);
        }
      } else if (file.children) {
        await writeFilesIncrementally(wc, file.children);
      }
    }
  }

  async function initPreview() {
    if (!webContainer) return;

    try {
      await installDependencies(webContainer);
      await startDevServer(webContainer);
    } catch (error) {
      console.error("❌ Failed to initialize preview:", error);
      setLoading(false);
    }
  }

  // 🧩 Watch for file changes
  useEffect(() => {
    if (!webContainer || !files.length) return;

    const newHash = getFilesHash(files);

    if (
      isServerReadyRef.current &&
      filesHashRef.current &&
      filesHashRef.current !== newHash
    ) {
      // console.log("🔄 Files changed — updating preview...");

      (async () => {
        try {
          // Update only changed files
          await writeFilesIncrementally(webContainer, files);

          // Restart the dev server for fresh build
          if (window.__devProcess__) {
            try {
              window.__devProcess__.kill();
            } catch (e) {
              console.warn("Failed to kill old dev process:", e);
            }
            window.__devProcess__ = undefined;
            isServerReadyRef.current = false;
          }

          await startDevServer(webContainer);
        } catch (err) {
          console.error("⚠️ File update failed:", err);
        }
      })();
    }

    filesHashRef.current = newHash;
  }, [files, webContainer]);

  useEffect(() => {
    initPreview();
  }, [webContainer]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {loading && (
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      )}
      {url && (
        <iframe
          key={url + filesHashRef.current}
          width="100%"
          height="100%"
          src={url}
          className="border-0"
        />
      )}
    </div>
  );
}