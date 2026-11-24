// One Line of Earned Pride — a program that writes one line: a quiet,
// earned moment of pride for someone in a scene, to /output/entry.txt.
//
// The line is a fixed text on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that one line,
// byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is on the subject: a quiet, earned moment of pride — a school
//   caretaker who swept the same classroom floor for eleven years
//   watches the girl who used to hide under the desks read her own
//   name aloud. A small person, a long effort, finally landing.
// - The scene is concrete: a classroom floor, desks to hide under, a
//   name read aloud — the moment is seen happening, not summarised.
// - The pride is earned inside the line by the eleven years of
//   sweeping and the girl's climb from hiding to reading; the word
//   "proud" never appears, nothing is congratulated or explained.
// - It lands in one read: the pride arrives with the last words, the
//   girl reading her own name aloud.
// - It is fresh: no trophy, no podium, no graduation — a broom, a
//   classroom floor, and a name read aloud.
const LINE =
  "For eleven years she swept the same classroom floor, and today the girl who used to hide under the desks read her own name aloud.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 240 characters of UTF-8 text, so refuse
  // loudly instead of shipping a text the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (LINE.length < 1 || LINE.length > 240) {
    throw new Error(`entry must be 1-240 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // No leading or trailing white space either: the gate counts every
  // byte, and a stray space at either end would sit in front of the
  // judge for nothing.
  if (LINE !== LINE.trim()) {
    throw new Error("entry must not have leading or trailing white space");
  }
  // One line means no line break hiding inside it, and no tabs or
  // doubled spaces either: a stray tab would read as a formatting
  // glitch in front of the judge.
  if (/[\n\r]/.test(LINE)) {
    throw new Error("entry must be exactly one line");
  }
  if (/[\t]/.test(LINE) || /  /.test(LINE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // No invisible control characters for the same reason.
  if (/[\u0000-\u001f\u007f]/.test(LINE)) {
    throw new Error("entry must not contain control characters");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the line: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== LINE) {
    throw new Error("entry file does not hold exactly the line");
  }
  console.log(`Wrote ${LINE.length} characters to ${OUT_FILE}`);
}

main();
