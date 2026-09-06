## Task Management

For every non-trivial task, use OpenCode's TODO list to track the work.

### Before starting

Before making changes, analyze the request and create a TODO list containing the main steps required to complete the task.

The TODO list should be:
- specific
- actionable
- ordered logically
- focused on the actual work required

Do not create unnecessary TODO items for trivial tasks.

## Todo list rules

Todo list yang sudah ada TIDAK BOLEH diganti/dihapus/direstrukturisasi. Setiap
kali memanggil todowrite, WAJIB menyertakan ULANG seluruh item lama persis
seperti sebelumnya (termasuk yang sudah completed), lalu menambahkan item baru
sebagai entri TAMBAHAN di akhir list — bukan menggantikan. Sub-task dari item
yang sedang in_progress ditambahkan sebagai item baru terpisah dengan prefix
yang jelas (misal "[nama-parent] sub-task"), BUKAN dengan menghapus/mengganti
item parent.

## Todo persistence

File TODO.md di root project adalah SATU-SATUNYA sumber kebenaran untuk daftar
todo, dan bertahan lintas sesi (tidak hilang saat restart). Di AWAL setiap sesi,
SELALU baca TODO.md terlebih dahulu sebelum melakukan apa pun. Todo list internal
(via todowrite) WAJIB selalu identik dengan isi TODO.md — jangan pernah
menghapus/mengganti item yang sudah ada di TODO.md, hanya boleh menambah item
baru atau mengubah status (checkbox) item yang sudah ada.

### While working

Keep the TODO list synchronized with the actual work.

When a task is completed:
- immediately mark it as `completed`
- do not wait until the entire task is finished

When a new requirement, dependency, bug, or necessary piece of work is discovered:
- add a new TODO item
- place it in the appropriate position

When the implementation changes the original plan:
- update, reorder, split, merge, or remove TODO items as necessary

The TODO list must always reflect the current state of the work.

### TODO status

Use these states appropriately:

- `pending` — work has not started
- `in_progress` — currently being worked on
- `completed` — successfully finished

Only mark a TODO as `completed` when the corresponding work has actually been completed and verified.

### Verification

Before marking an implementation-related TODO as completed:
- verify the change when practical
- run relevant tests, type checks, linting, or build commands when appropriate

If verification reveals additional work:
- add the required work to the TODO list
- do not mark the original task as completed until it is actually resolved

### Completion

Before finishing the response:
- ensure the TODO list accurately reflects the final state
- all successfully completed work must be marked `completed`
- unresolved work must remain visible as `pending`
- do not claim a task is completed if it is not

## Development Workflow

For non-trivial implementation tasks, generally follow:

1. Understand the request
2. Inspect the existing code
3. Create/update the TODO list
4. Implement the changes
5. Test and verify
6. Fix issues discovered during verification
7. Update the TODO list
8. Summarize the result

## Progress reporting

Saat mengupdate todo dengan status "in_progress" via todowrite, SELALU sertakan
perkiraan persentase progress task tersebut di akhir teks todo, format: "(XX%)"
— contoh: "Env flag DEMO_MODE + fake session superadmin (28%)". Update ulang
persentase ini setiap kali progress task berubah signifikan, bukan cuma sekali
di awal task.

Do not blindly follow the initial TODO plan if the codebase reveals a better or necessary approach. Keep the TODO list updated as the understanding of the task evolves.
