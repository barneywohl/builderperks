import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const extensionFileNames = [
  "content.js",
  "content.css",
  "manifest.json",
  "popup.js",
  "popup.html",
  "popup.css"
];

async function firstExistingDirectory(paths) {
  for (const path of paths) {
    try {
      await access(path);
      return path;
    } catch {}
  }

  throw new Error(`Could not find extension source directory in: ${paths.join(", ")}`);
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const time =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const day =
    ((year - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  return { time, day };
}

function writeUInt16(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value);
  return buffer;
}

function writeUInt32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0);
  return buffer;
}

async function createZip(outputPath, filePaths) {
  const localRecords = [];
  const centralRecords = [];
  let offset = 0;
  const { time, day } = dosDateTime();

  for (const filePath of filePaths) {
    const data = await readFile(filePath);
    const name = Buffer.from(filePath.split("/").pop() ?? filePath);
    const crc = crc32(data);

    const localHeader = Buffer.concat([
      writeUInt32(0x04034b50),
      writeUInt16(20),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(time),
      writeUInt16(day),
      writeUInt32(crc),
      writeUInt32(data.length),
      writeUInt32(data.length),
      writeUInt16(name.length),
      writeUInt16(0),
      name
    ]);

    const centralHeader = Buffer.concat([
      writeUInt32(0x02014b50),
      writeUInt16(20),
      writeUInt16(20),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(time),
      writeUInt16(day),
      writeUInt32(crc),
      writeUInt32(data.length),
      writeUInt32(data.length),
      writeUInt16(name.length),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt32(0),
      writeUInt32(offset),
      name
    ]);

    localRecords.push(localHeader, data);
    centralRecords.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralRecords);
  const endRecord = Buffer.concat([
    writeUInt32(0x06054b50),
    writeUInt16(0),
    writeUInt16(0),
    writeUInt16(filePaths.length),
    writeUInt16(filePaths.length),
    writeUInt32(centralDirectory.length),
    writeUInt32(offset),
    writeUInt16(0)
  ]);

  await writeFile(outputPath, Buffer.concat([...localRecords, centralDirectory, endRecord]));
}

const extensionSourceDirectory = await firstExistingDirectory(["../extension", "extension"]);
const extensionFiles = extensionFileNames.map((fileName) => `${extensionSourceDirectory}/${fileName}`);

await rm("public/builderperks-extension-beta.zip", { force: true });
await createZip("public/builderperks-extension-beta.zip", extensionFiles);

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
