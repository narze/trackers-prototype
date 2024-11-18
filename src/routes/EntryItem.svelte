<script>
    import { entries } from '$lib/stores/entries';

    let { entry, habitType, habitColor } = $props();

    let isEditing = $state(false);
    let editedNote = $state(entry.note || '');
    let editedValue = $state(entry.value);

    function handleEdit() {
        entries.updateEntry(entry.id, {
            value: editedValue,
            note: editedNote.trim() || null
        });
        isEditing = false;
    }

    function handleDelete() {
        if (confirm('Are you sure you want to delete this entry?')) {
            entries.deleteEntry(entry.id);
        }
    }
</script>

<div class="py-3">
    {#if isEditing}
        <div class="flex items-center gap-2">
            {#if habitType === 'scale'}
                <select
                    bind:value={editedValue}
                    class="select select-bordered select-sm"
                >
                    {#each Array(5) as _, i}
                        <option value={i + 1}>{i + 1}</option>
                    {/each}
                </select>
            {/if}
            <input
                type="text"
                bind:value={editedNote}
                placeholder="Add note"
                class="input input-bordered input-sm flex-1"
            />
            <button
                class="btn btn-sm btn-primary"
                onclick={handleEdit}
            >
                Save
            </button>
            <button
                class="btn btn-sm btn-ghost"
                onclick={() => isEditing = false}
            >
                Cancel
            </button>
        </div>
    {:else}
        <div class="flex items-center gap-2">
            <span
                class="font-bold min-w-[3rem]"
                style="color: {habitColor}"
            >
                {#if habitType === 'scale'}
                    {entry.value}/5
                {:else}
                    ⏱️
                {/if}
            </span>
            {#if entry.note}
                <span class="flex-1 text-base-content/70 italic">
                    {entry.note}
                </span>
            {/if}
            <span class="text-sm text-base-content/50 min-w-[12rem] flex-1">
                {new Date(entry.timestamp).toLocaleString()}
            </span>
            <div class="flex gap-1">
                <button
                    class="btn btn-ghost btn-xs"
                    onclick={() => isEditing = true}
                >
                    ✏️
                </button>
                <button
                    class="btn btn-ghost btn-xs"
                    onclick={handleDelete}
                >
                    🗑️
                </button>
            </div>
        </div>
    {/if}
</div>
