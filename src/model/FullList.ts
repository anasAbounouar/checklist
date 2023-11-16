import ListItem from "./ListItem";
interface List {
    list: ListItem[];
    load(): void;
    //load used after refreshing
    save(): void;
    clearList(): void;
    addItem(itemObj: ListItem): void;
    removeItem(id: string): void;
}
export default class FullList implements List {
    static instance: FullList = new FullList();
    constructor(private _list: ListItem[] = []) {}
    get list(): ListItem[] {
        return this._list;
    }
    save(): void {
        localStorage.setItem("myList", JSON.stringify(this._list));
    }
    load(): void {
        const loadList: string | null = localStorage.getItem("myList");
        if (typeof loadList !== "string") return;
        console.log(`local storage contains elements`);
        const parsedList: { _id: string; _item: string; _checked: boolean }[] =
            JSON.parse(loadList);
        parsedList.forEach((itemObj) => {
            const newListItem = new ListItem(itemObj._id, itemObj._item, itemObj._checked);
            FullList.instance.addItem(newListItem);
            console.log(`item ${newListItem} is being added from the local storage`);
        });
    }
    clearList(): void {
        this._list = [];
        this.save();
    }
    addItem(itemObj: ListItem): void {
        this._list.push(itemObj);
        this.save();
        console.log(`the item ${itemObj} is being added to the list ${this.list}`);
    }
    removeItem(id: string): void {
        this._list = this._list.filter((item) => item.id !== id);
        this.save();
    }
}
