<template>
    <h1 class="offscreen">My List</h1>

    <section class="newItemEntry">
        <h2 class="offscreen">New Item Entry</h2>
        <form class="newItemEntry__form" id="itemEntryForm">
            <label for="newItem" class="offscreen">Enter a new to do item</label>
            <input
                class="newItemEntry__input"
                id="newItem"
                type="text"
                maxlength="40"
                autocomplete="off"
                placeholder="Add item"
            />
            <button
                id="addItem"
                class="button newItemEntry__button"
                title="Add new item"
                aria-label="Add new item to list"
            >
                +
            </button>
        </form>
    </section>

    <section class="listContainer">
        <header class="listTitle">
            <h2 id="listName">List</h2>
            <button
                id="clearItemsButton"
                class="button listTitle__button"
                title="Clear the list"
                aria-label="Remove all items from the list"
            >
                Clear
            </button>
        </header>
        <hr />
        <ul id="listItems"></ul>
    </section>
</template>
<script setup lang="ts">
import FullList from "@/model/FullList";
import ListItem from "@/model/ListItem";
// import ListTemplate from "@/templates/ListItems";
document.addEventListener("DOMContentLoaded", () => {
    const fullList = FullList.instance;
    interface DOMList {
        ul: HTMLUListElement;
        clear(): void;
        render(fullList: FullList): void;
    }
    class ListTemplate implements DOMList {
        ul: HTMLUListElement;

        static instance: ListTemplate = new ListTemplate();

        private constructor() {
            // Access your 'ul' element if needed
            this.ul = document.getElementById("listItems") as HTMLUListElement;
            if (!this.ul) {
                console.log("ul not found");
            }
        }

        clear(): void {
            this.ul.innerHTML = "";
        }

        render(fullList: FullList): void {
            this.clear();

            fullList.list.forEach((item) => {
                const li = document.createElement("li") as HTMLLIElement;
                li.className = "item";
                console.log(li);

                const check = document.createElement("input") as HTMLInputElement;
                check.type = "checkbox";
                check.id = item.id;
                check.checked = item.checked;
                li.append(check);

                check.addEventListener("change", () => {
                    item.checked = !item.checked;
                    fullList.save();
                });

                const label = document.createElement("label") as HTMLLabelElement;
                label.htmlFor = item.id;
                label.textContent = item.item;
                li.append(label);

                const button = document.createElement("button") as HTMLButtonElement;
                button.className = "button";
                button.textContent = "X";
                li.append(button);

                button.addEventListener("click", () => {
                    fullList.removeItem(item.id);
                    this.render(fullList);
                });

                this.ul.append(li);
            });
        }
    }
    const template = ListTemplate.instance;

    // Add listener to new entry form submit
    const itemEntryForm = document.getElementById("itemEntryForm") as HTMLFormElement;
    console.log(itemEntryForm.textContent);
    console.log(document.getElementById("listItems")?.innerHTML);

    itemEntryForm.addEventListener("submit", (event: SubmitEvent): void => {
        event.preventDefault();
        console.log("i submitted");
        // Get the new item value
        const input = document.getElementById("newItem") as HTMLInputElement;
        const newEntryText: string = input.value.trim();
        if (!newEntryText.length) return;

        // calculate item ID
        const itemId: number = fullList.list.length
            ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
            : 1;
        console.log(`item id is ${itemId}`);

        // create new item
        const newItem = new ListItem(itemId.toString(), newEntryText, false);
        // Add new item to full list
        console.log(fullList);
        fullList.addItem(newItem);
        // Re-render list with new item included
        console.log(document.getElementById("listItems")?.innerHTML);
        template.render(fullList);
        console.log(document.getElementById("listItems")?.innerHTML);

        input.value = "";
    });

    // Add listener to "Clear" button
    const clearItems = document.getElementById("clearItemsButton") as HTMLButtonElement;

    clearItems.addEventListener("click", (): void => {
        fullList.clearList();
        template.clear();
    });

    // load initial data
    fullList.load();
    // initial render of template
    template.render(fullList);
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.offscreen {
    position: absolute;
    left: -10000px;
}

input,
button {
    font: inherit;
}

html {
    font-family: "Poppins", sans-serif;
}

body {
    min-height: 100vh;
    background-color: #333;
    color: #fff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

main {
    flex-grow: 1;
    margin: auto;
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-flow: column nowrap;
}

section {
    border: 1px solid whitesmoke;
    border-radius: 10px;
    padding: 0.5rem;
}

.button {
    border-radius: 10px;
    min-width: 48px;
    min-height: 48px;
}

.button:hover {
    cursor: pointer;
}

.newItemEntry {
    position: sticky;
    top: 0;
    margin-bottom: 1rem;
}

.newItemEntry__form {
    display: flex;
    gap: 0.25rem;
    font-size: 1.5rem;
}

.newItemEntry__input {
    width: calc(100% - (0.25rem + 48px));
    flex-grow: 1;
    border: 2px solid whitesmoke;
    border-radius: 10px;
    padding: 0.5em;
    background-color: black;
}

.newItemEntry__button {
    background-color: transparent;
    color: whitesmoke;
    border: 3px dashed whitesmoke;
    padding: 0.75em;
}

.newItemEntry__button:hover,
.newItemEntry__button:focus {
    color: limegreen;
}

.listContainer {
    font-size: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    gap: 1rem;
}

.listTitle {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.listTitle__button {
    background-color: transparent;
    color: whitesmoke;
    padding: 0.25em;
}

.listItems {
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    list-style-type: none;
}

.item {
    display: flex;
    align-items: center;
    padding-top: 1em;
    gap: 1em;
}

.item > input[type="checkbox"] {
    text-align: center;
    min-width: 2.5rem;
    min-height: 2.5rem;
    cursor: pointer;
}

.item > input[type="checkbox"]:checked + label {
    text-decoration: line-through;
}

.item > label {
    flex-grow: 1;
    word-break: break-all;
}

.item > button:hover,
.item > button:focus {
    color: red;
}

@media (min-width: 768px) {
    section {
        padding: 1rem;
    }
    .newItemEntry__form {
        gap: 0.5rem;
    }
}
</style>
