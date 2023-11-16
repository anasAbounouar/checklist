import FullList from "@/model/FullList";

interface DOMList {
    ul: HTMLUListElement;
    clear(): void;
    render(fullList: FullList): void;
}

export default class ListTemplate implements DOMList {
    ul: HTMLUListElement = document.getElementById("listItems") as HTMLUListElement;

    static instance: ListTemplate = new ListTemplate();

    private constructor() {
        const body = document.body;

        // You can use the 'body' element as needed
        console.log(body.innerHTML);
        console.log(document);
        console.log(document.getElementById("listItems")?.innerHTML);

        // Access your 'ul' element if needed
        this.ul = document.getElementById("listItems") as HTMLUListElement;
    }

    clear(): void {
        // this.ul.innerHTML = "";
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
            console.log(li);

            this.ul.append(li);
        });
    }
}
