import db from "./db";
import { unlink } from "fs/promises";

const ZO_TOKEN = process.env.ZO_CLIENT_IDENTITY_TOKEN || "";

export async function syncToDropbox(submissionId: number, filename: string, publicUrl: string, gigId: number, djName?: string | null) {
  const gig = db.prepare("SELECT name FROM gigs WHERE id = ?").get(gigId) as any;
  if (!gig) return;

  let dropboxFolder = `Hoang Clips/${gig.name}`;
  if (djName) {
    dropboxFolder = `${dropboxFolder}/${djName}`;
  }
  const uploadName = `${filename}.mp4`;
  const dropboxPath = `/${dropboxFolder}/${uploadName}`;
  const tmpPath = `/tmp/${uploadName}`;

  db.prepare("UPDATE submissions SET dropbox_path = ? WHERE id = ?").run(dropboxPath, submissionId);

  try {
    console.log(`[Dropbox] Downloading from public_url: ${publicUrl}`);
    const res = await fetch(publicUrl);
    if (!res.ok) {
      throw new Error(`Failed to download from public_url: ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    await Bun.write(tmpPath, buffer);
    console.log(`[Dropbox] Downloaded ${buffer.byteLength} bytes to ${tmpPath}`);
  } catch (err) {
    console.error(`[Dropbox] Download error for ${uploadName}:`, err);
    return;
  }

  try {
    console.log(`[Dropbox] Uploading ${uploadName} -> ${dropboxFolder}/`);

    const res = await fetch("https://api.zo.computer/mcp", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ZO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "use_app_dropbox",
          arguments: {
            tool_name: "dropbox-upload-file",
            configured_props: {
              path: dropboxFolder,
              name: uploadName,
              filePath: tmpPath,
              autorename: true,
              mute: true,
            },
            email: "justin@clouted.com",
          },
        },
      }),
    });

    const result = await res.json() as any;
    const content = result?.result?.content?.[0]?.text || "";

    if (result?.result?.isError) {
      console.error(`[Dropbox] Failed: ${uploadName} - ${content}`);
    } else {
      db.prepare("UPDATE submissions SET dropbox_synced = 1 WHERE id = ?").run(submissionId);
      console.log(`[Dropbox] Done: ${uploadName}`);
    }
  } catch (err) {
    console.error(`[Dropbox] Error uploading ${uploadName}:`, err);
  }

  try {
    await unlink(tmpPath);
  } catch {}
}
