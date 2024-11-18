<script>
    import { entries } from '$lib/stores/entries';

    export let entry;
    export let habitType;
    export let habitColor;
    
    let isEditing = false;
    let editedNote = entry.note || '';
    let editedValue = entry.value;

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
                on:click={handleEdit}
            >
                Save
            </button>
            <button 
                class="btn btn-sm btn-ghost"
                on:click={() => isEditing = false}
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
                    {new Date(entry.timestamp).toLocaleTimeString()}
                {/if}
            </span>
            {#if entry.note}
                <span class="flex-1 text-base-content/70 italic">
                    {entry.note}
                </span>
            {/if}
            <span class="text-sm text-base-content/50 min-w-[6rem]">
                {new Date(entry.timestamp).toLocaleDateString()}
            </span>
            <div class="flex gap-1">
                <button 
                    class="btn btn-ghost btn-xs"
                    on:click={() => isEditing = true}
                >
                    ✏️
                </button>
                <button 
                    class="btn btn-ghost btn-xs"
                    on:click={handleDelete}
                >
                    🗑️
                </button>
            </div>
        </div>
    {/if}
</div>